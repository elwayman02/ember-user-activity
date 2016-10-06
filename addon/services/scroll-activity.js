import $ from 'jquery';
import Evented from 'ember-evented';
import Service from 'ember-service';
import run from 'ember-runloop';
import FastBootCompatMixin from '../mixins/fastboot-compat';

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
    if (!element.scrollTop) { // a DOM element instead of a jQuery object
      element = $(element);
    }
    this._subscribers.push({
      target,
      element,
      callback,
      highPriority,
      scrollTop: null
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
          let scrollTop = subscriber.element.scrollTop();
          if (scrollTop !== subscriber.scrollTop) {
            // If the value is changing from an initial null state to a first
            // time value, do not treat it like a change.
            if (subscriber.scrollTop !== null) {
              if (!hasScrolled) {
                run.begin();
                hasScrolled = true;
              }
              subscriber.callback(scrollTop, subscriber.scrollTop);
            }
            subscriber.scrollTop = scrollTop;
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
