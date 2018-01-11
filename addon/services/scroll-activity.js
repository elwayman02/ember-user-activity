import Evented from '@ember/object/evented';
import Service from '@ember/service';
import { run } from '@ember/runloop';
import FastBootCompatMixin from '../mixins/fastboot-compat';
import getScrollTop from '../utils/get-scroll-top';
import getScrollLeft from '../utils/get-scroll-left';

/*
 * Polling uses rAF and/or a setTimeout at 16ms, however rAF will run in the
 * microtask queue and might fire just after Ember's render step occurred.
 * By enforcing that the interval between a poll and the previous must be
 * below a reasonable number, we can be reasonably sure the main UI
 * thread didn't just do a lot of work.
 *
 * This number show be above the minimum polling period (16ms)
 */
const MAX_POLL_PERIOD = 32;
const SCROLL_EVENT_TYPE_VERTICAL = 'vertical';
const SCROLL_EVENT_TYPE_HORIZONTAL = 'horizontal';
const SCROLL_EVENT_TYPE_DIAGONAL = 'diagonal';

export default Service.extend(Evented, FastBootCompatMixin, {

  init() {
    this._super(...arguments);

    if (this.get('_isFastBoot')) { return; }

    this._animationFrame = null;
    this._subscribers = [];
    this._lastCheckAt = new Date();
    this.subscribe(document, document, () => {}, false);

    this._pollScroll();
  },

  subscribe(
    target,
    element,
    callback=() => {},
    highPriority=true
  ) {
    this._subscribers.push({
      target,
      element,
      callback,
      highPriority,
      scrollTop: null,
      scrollLeft: null
    });
  },

  unsubscribe(target) {
    let { _subscribers: subscribers } = this;
    for (let i=0;i<subscribers.length;i++) {
      let subscriber = subscribers[i];
      if (subscriber.target === target) {
        subscribers.splice(i, 1);
        break;
      }
    }
  },

  _pollScroll() {
    if (this.get('_isFastBoot')) { return; }
    if (window.requestAnimationFrame) {
      this._animationFrame = requestAnimationFrame(() => this._checkScroll());
    } else {
      this._animationFrame = setTimeout(() => this._checkScroll(), 16);
    }
  },

  _checkScroll() {
    let {
      _subscribers: subscribers,
      _lastCheckAt: lastCheckAt } = this;
    let now = new Date();
    if (subscribers.length) {
      let lowPriorityFrame = (now - lastCheckAt) < MAX_POLL_PERIOD;
      let hasScrolled = false;
      for (let i=0;i<subscribers.length;i++) {
        let subscriber = subscribers[i];
        if (subscriber.highPriority || lowPriorityFrame) {
          let scrollTop = getScrollTop(subscriber.element);
          let scrollLeft = getScrollLeft(subscriber.element);
          if (scrollTop !== subscriber.scrollTop && scrollLeft !== subscriber.scrollLeft) {
            // If the values are changing from an initial null state to first
            // time values, do not treat it like a change.
            if (subscriber.scrollTop !== null && subscriber.scrollLeft !== null) {
              if (!hasScrolled) {
                run.begin();
                hasScrolled = true;
              }
              subscriber.callback(scrollTop, subscriber.scrollTop, SCROLL_EVENT_TYPE_DIAGONAL, scrollLeft, subscriber.scrollLeft);
            }
            subscriber.scrollTop = scrollTop;
            subscriber.scrollLeft = scrollLeft;
          } else if (scrollTop !== subscriber.scrollTop) {
            // If the value is changing from an initial null state to a first
            // time value, do not treat it like a change.
            if (subscriber.scrollTop !== null) {
              if (!hasScrolled) {
                run.begin();
                hasScrolled = true;
              }
              subscriber.callback(scrollTop, subscriber.scrollTop, SCROLL_EVENT_TYPE_VERTICAL);
            }
            subscriber.scrollTop = scrollTop;
            subscriber.scrollLeft = scrollLeft;
          } else if (scrollLeft !== subscriber.scrollLeft) {
            // If the value is changing from an initial null state to a first
            // time value, do not treat it like a change.
            if (subscriber.scrollLeft !== null) {
              if (!hasScrolled) {
                run.begin();
                hasScrolled = true;
              }
              subscriber.callback(scrollLeft, subscriber.scrollLeft, SCROLL_EVENT_TYPE_HORIZONTAL);
            }
            subscriber.scrollTop = scrollTop;
            subscriber.scrollLeft = scrollLeft;
          }
        }
      }
      if (hasScrolled) {
        this.trigger('scroll');
        run.end();
      }
    }
    this._lastCheckAt = now;
    this._pollScroll();
  },

  willDestroy() {
    if (this.get('_isFastBoot')) { return; }
    if (window.requestAnimationFrame) {
      cancelAnimationFrame(this._animationFrame);
    } else {
      clearTimeout(this._animationFrame);
    }
    this._subscribers.length = 0;

    this._super(...arguments);
  }
});
