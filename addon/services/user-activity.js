/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Ember from 'ember';
import { getOwner } from '@ember/application';
import { A } from '@ember/array'
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { addListener, removeListener, sendEvent } from '@ember/object/events';
import { throttle } from '@ember/runloop'
import { default as Service, inject as injectService } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Service.extend({
  scrollActivity: injectService('ember-user-activity@scroll-activity'),

  EVENT_THROTTLE: 100,
  defaultEvents: ['keydown', 'mousedown', 'scroll', 'touchstart'],
  enabledEvents: null,
  _eventsListened: null,
  _eventSubscriberCount: null,

  _throttledEventHandlers: null,
  _boundEventHandler: null,

  // Fastboot compatibility
  _fastboot: computed(function() {
    let owner = getOwner(this);
    return owner.lookup('service:fastboot');
  }),

  _isFastBoot: readOnly('_fastboot.isFastBoot'),

  init() {
    this._super(...arguments);

    if (Ember.testing) { // Do not throttle in testing mode
      this.set('EVENT_THROTTLE', 0);
    }

    this._boundEventHandler = this.handleEvent.bind(this);
    this._eventsListened = A();
    this._eventSubscriberCount = {};
    this._throttledEventHandlers = {};

    if (isEmpty(this.get('enabledEvents'))) {
      this.set('enabledEvents', A());
    }
    this._setupListeners();
  },

  // Evented Implementation: https://github.com/emberjs/ember.js/blob/v3.16.1/packages/%40ember/-internals/runtime/lib/mixins/evented.js#L13
  on(eventName, target, method) {
    this.enableEvent(eventName);
    if (this._eventSubscriberCount[eventName]) {
      this._eventSubscriberCount[eventName]++;
    } else {
      this._eventSubscriberCount[eventName] = 1;
    }

    addListener(this, eventName, target, method);
    return this;
  },

  off(eventName, target, method) {
    if (this._eventSubscriberCount[eventName]) {
      this._eventSubscriberCount[eventName]--;
    } else {
      delete this._eventSubscriberCount[eventName];
    }

    removeListener(this, eventName, target, method);
    return this;
  },

  trigger(eventName, ...args) {
    sendEvent(this, eventName, args);
  },

  has(eventName) {
    return this._eventSubscriberCount[eventName] && this._eventSubscriberCount[eventName] > 0;
  },

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
    while (this._eventsListened.length > 0) {
      this.disableEvent(this._eventsListened[0]);
    }
    this._eventsListened = A();
    this._eventSubscriberCount = {};
    this._throttledEventHandlers = {};

    this._super(...arguments);
  }
});
