import FastBootAwareEventManagerService from './-private/fastboot-aware-event-manager';
import { begin as beginRunloop, end as endRunloop } from '@ember/runloop';
import getScroll from '../utils/get-scroll';

/*
 * Polling uses rAF and/or a setTimeout at 16ms, however rAF will run in the
 * microtask queue and might fire just after Ember's render step occurred.
 * By enforcing that the interval between a poll and the previous must be
 * below a reasonable number, we can be reasonably sure the main UI
 * thread didn't just do a lot of work.
 *
 * This number should be above the minimum polling period (16ms)
 */
const MAX_POLL_PERIOD = 32;
const SCROLL_EVENT_TYPE_VERTICAL = 'vertical';
const SCROLL_EVENT_TYPE_HORIZONTAL = 'horizontal';
const SCROLL_EVENT_TYPE_DIAGONAL = 'diagonal';

export default class ScrollActivityService extends FastBootAwareEventManagerService {
  _animationFrame = null;
  _subscribers = [];
  _lastCheckAt = new Date();

  constructor() {
    super(...arguments);

    if (this._isFastBoot) {
      return;
    }

    this.subscribe(document, document, () => {}, false);

    this._pollScroll();
  }

  subscribe(target, element, callback = () => {}, highPriority = true) {
    this._subscribers.push({
      target,
      element,
      callback,
      highPriority,
      scrollTop: null,
      scrollLeft: null,
    });
  }

  unsubscribe(target) {
    let { _subscribers: subscribers } = this;
    for (let i = 0; i < subscribers.length; i++) {
      let subscriber = subscribers[i];
      if (subscriber.target === target) {
        subscribers.splice(i, 1);
        break;
      }
    }
  }

  _pollScroll() {
    if (this._isFastBoot) {
      return;
    }
    if (window.requestAnimationFrame) {
      this._animationFrame = requestAnimationFrame(() => this._checkScroll());
    } else {
      this._animationFrame = setTimeout(() => this._checkScroll(), 16);
    }
  }

  _checkScroll() {
    let { _subscribers: subscribers } = this;
    let now = new Date();
    if (subscribers.length) {
      if (this._hasScrolled(now)) {
        this.trigger('scroll');
        endRunloop();
      }
    }
    this._lastCheckAt = now;
    this._pollScroll();
  }

  _updateScroll(subscriber) {
    subscriber.scrollTop = getScroll(subscriber.element);
    subscriber.scrollLeft = getScroll(subscriber.element, 'left');
  }

  _hasScrolled(now) {
    let { _subscribers: subscribers, _lastCheckAt: lastCheckAt } = this;
    let lowPriorityFrame = now - lastCheckAt < MAX_POLL_PERIOD;
    let hasScrolled = false;
    for (let i = 0; i < subscribers.length; i++) {
      let subscriber = subscribers[i];
      if (subscriber.highPriority || lowPriorityFrame) {
        let scrollTop = getScroll(subscriber.element);
        let scrollLeft = getScroll(subscriber.element, 'left');
        if (
          scrollTop !== subscriber.scrollTop &&
          scrollLeft !== subscriber.scrollLeft
        ) {
          hasScrolled = this._handleAllScrollChanged(subscriber, hasScrolled);
        } else if (scrollTop !== subscriber.scrollTop) {
          hasScrolled = this._handleScrollTopChanged(subscriber, hasScrolled);
        } else if (scrollLeft !== subscriber.scrollLeft) {
          hasScrolled = this._handleScrollLeftChanged(subscriber, hasScrolled);
        }
      }
    }
    return hasScrolled;
  }

  _handleAllScrollChanged(subscriber, hasScrolled) {
    // If the values are changing from an initial null state to first-time values, do not treat it like a change.
    if (subscriber.scrollTop !== null && subscriber.scrollLeft !== null) {
      if (!hasScrolled) {
        beginRunloop();
        hasScrolled = true;
      }

      let scrollTop = getScroll(subscriber.element);
      let scrollLeft = getScroll(subscriber.element, 'left');
      subscriber.callback(
        scrollTop,
        subscriber.scrollTop,
        SCROLL_EVENT_TYPE_DIAGONAL,
        scrollLeft,
        subscriber.scrollLeft
      );
    }
    this._updateScroll(subscriber);
    return hasScrolled;
  }

  _handleScrollLeftChanged(subscriber, hasScrolled) {
    // If the value is changing from an initial null state to a first
    // time value, do not treat it like a change.
    if (subscriber.scrollLeft !== null) {
      if (!hasScrolled) {
        beginRunloop();
        hasScrolled = true;
      }
      subscriber.callback(
        getScroll(subscriber.element, 'left'),
        subscriber.scrollLeft,
        SCROLL_EVENT_TYPE_HORIZONTAL
      );
    }
    this._updateScroll(subscriber);
    return hasScrolled;
  }

  _handleScrollTopChanged(subscriber, hasScrolled) {
    // If the value is changing from an initial null state to a first
    // time value, do not treat it like a change.
    if (subscriber.scrollTop !== null) {
      if (!hasScrolled) {
        beginRunloop();
        hasScrolled = true;
      }
      subscriber.callback(
        getScroll(subscriber.element),
        subscriber.scrollTop,
        SCROLL_EVENT_TYPE_VERTICAL
      );
    }
    this._updateScroll(subscriber);
    return hasScrolled;
  }

  willDestroy() {
    if (this._isFastBoot) {
      return;
    }
    if (window.requestAnimationFrame) {
      cancelAnimationFrame(this._animationFrame);
    } else {
      clearTimeout(this._animationFrame);
    }
    this._subscribers.length = 0;

    super.willDestroy(...arguments);
  }
}
