/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Ember from 'ember';
import Evented from '@ember/object/evented';
import Service from '@ember/service';
import { inject as injectService } from '@ember/service';
import { A } from '@ember/array'
import { isEmpty } from '@ember/utils';
import { throttle } from '@ember/runloop'
import FastBootCompatMixin from '../mixins/fastboot-compat';

export default Service.extend(Evented, FastBootCompatMixin, {
  scrollActivity: injectService('ember-user-activity@scroll-activity'),

  EVENT_THROTTLE: 100,
  defaultEvents: ['keydown', 'mousedown', 'scroll', 'touchstart'],
  enabledEvents: null,
  _eventsListened: null,

  _throttledEventHandlers: null,

  _boundEventHandler: null,
  handleEvent(event) {
    throttle(this, this._throttledEventHandlers[event.type], event, this.get('EVENT_THROTTLE'));
  },

  _handleScroll() {
    this.handleEvent({ type: 'scroll' });
  },

  _setupListeners() {
    this.get('defaultEvents').forEach((eventName) => {
      this.enableEvent(eventName);
    });
  },

  _listen(eventName) {
    if (eventName === 'scroll') {
      this.get('scrollActivity').on('scroll', this, this._handleScroll);
    } else if (this._eventsListened.indexOf(eventName) === -1) {
      if (this.get('_isFastBoot')) { return; }
      this._eventsListened.pushObject(eventName);
      window.addEventListener(eventName, this._boundEventHandler, true);
    }

  },

  init() {
    this._super(...arguments);

    if (Ember.testing) { // Do not throttle in testing mode
      this.set('EVENT_THROTTLE', 0);
    }

    this._boundEventHandler = this.handleEvent.bind(this);
    this._eventsListened = A();
    this._throttledEventHandlers = {};

    if (isEmpty(this.get('enabledEvents'))) {
      this.set('enabledEvents', A());
    }
    this._setupListeners();
  },

  on(eventName) {
    this.enableEvent(eventName);
    this._super(...arguments);
  },

  enableEvent(eventName) {
    if (!this.isEnabled(eventName)) {
      this.get('enabledEvents').pushObject(eventName);
      this._throttledEventHandlers[eventName] = function fireEnabledEvent(event) {
        if (this.isEnabled(event.type)) {
          this.fireEvent(event);
        }
      };
      this._listen(eventName);
    }
  },

  disableEvent(eventName) {
    this.get('enabledEvents').removeObject(eventName);
    this.get('_eventsListened').removeObject(eventName);
    this._throttledEventHandlers[eventName] = null;
    if (eventName === 'scroll') {
      this.get('scrollActivity').off('scroll', this, this._handleScroll);
    } else {
      if (this.get('_isFastBoot')) { return; }
      window.removeEventListener(eventName, this._boundEventHandler, true);
    }
  },

  fireEvent(event) {
    // Only fire events that have subscribers
    if (this.has(event.type)) {
      this.trigger(event.type, event);
    }
    if (this.has('userActive')) {
      this.trigger('userActive', event);
    }
  },

  isEnabled(eventName) {
    return this.get('enabledEvents').indexOf(eventName) !== -1;
  },

  willDestroy() {
    this._eventsListened.forEach((eventName) => {
      this.disableEvent(eventName);
    });
    this._eventsListened.length = 0;

    this._super(...arguments);
  }
});
