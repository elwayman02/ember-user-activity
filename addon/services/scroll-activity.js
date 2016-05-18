import $ from 'jquery';
import Evented from 'ember-evented';
import EmberObject from 'ember-object';
import Service from 'ember-service';
import { A } from 'ember-array/utils';
import { isPresent } from 'ember-utils';

export default Service.extend(Evented, {
  _animationFrame: null,

  subscribers: null,

  init() {
    this.set('subscribers', A());
    this.subscribe($(document));
    this.pollScroll();
  },

  subscribe(element, callback = function () {}) {
    this.get('subscribers').pushObject(EmberObject.create({
      element,
      callback,
      scrollTop: element.scrollTop() // get scroll pos
    }));
  },

  pollScroll() {
    let checkScroll = () => {
      let subscribers = this.get('subscribers');
      if (isPresent(subscribers)) {
        let hasScrolled = false;
        subscribers.forEach(function (subscriber) {
          let scrollTop = subscriber.get('element').scrollTop();
          if (scrollTop !== subscriber.get('scrollTop')) {
            hasScrolled = true;
            subscriber.get('callback')(scrollTop, subscriber.get('scrollTop'));
            subscriber.set('scrollTop', scrollTop);
          }
        });
        if (hasScrolled) {
          this.trigger('scroll');
        }
      }
      this.pollScroll();
    };

    if (window.requestAnimationFrame) {
      this._animationFrame = requestAnimationFrame(checkScroll);
    } else {
      this._animationFrame = setTimeout(checkScroll, 16);
    }
  },

  willDestroy() {
    if (window.requestAnimationFrame) {
      cancelAnimationFrame(this._animationFrame);
    } else {
      clearTimeout(this._animationFrame);
    }
  }
});
