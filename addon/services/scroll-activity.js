import $ from 'jquery';
import Evented from 'ember-evented';
import EmberObject from 'ember-object';
import Service from 'ember-service';
import { A } from 'ember-array/utils';
import { bind } from 'ember-runloop';
import { isPresent } from 'ember-utils';

export default Service.extend(Evented, {
  _animationFrame: null,

  subscribers: null,

  init() {
    this._super(...arguments);

    this.set('subscribers', A());
    this.subscribe(document, document);
    this._pollScroll();
  },

  subscribe(target, element, callback = function () {}) {
    if (!element.scrollTop) { // a DOM element instead of a jQuery object
      element = $(element);
    }
    this.get('subscribers').pushObject(EmberObject.create({
      target,
      element,
      callback,
      scrollTop: element.scrollTop() // get scroll pos
    }));
  },

  unsubscribe(target) {
    this.get('subscribers').removeObject(this.get('subscribers').findBy('target', target));
  },

  _pollScroll() {
    if (window.requestAnimationFrame) {
      this._animationFrame = requestAnimationFrame(bind(this, this._checkScroll));
    } else {
      this._animationFrame = setTimeout(bind(this, this._checkScroll), 16);
    }
  },

  _checkScroll() {
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
    this._pollScroll();
  },

  willDestroy() {
    if (window.requestAnimationFrame) {
      cancelAnimationFrame(this._animationFrame);
    } else {
      clearTimeout(this._animationFrame);
    }
    this.set('subscribers', null);

    this._super(...arguments);
  }
});
