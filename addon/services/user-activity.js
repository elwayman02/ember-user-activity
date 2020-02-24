import classic from 'ember-classic-decorator';
import FastBootAwareService from './-private/fastboot-aware'
import Ember from 'ember';
import { A } from '@ember/array'
import { addListener, removeListener, sendEvent } from '@ember/object/events';
import { throttle } from '@ember/runloop'
import { inject as injectService } from '@ember/service';
import { isEmpty } from '@ember/utils';

@classic
export default class UserActivityService extends FastBootAwareService {
  @injectService('ember-user-activity@scroll-activity')
  scrollActivity;

  EVENT_THROTTLE = 100;
  defaultEvents = ['keydown', 'mousedown', 'scroll', 'touchstart'];
  enabledEvents = null;
  _eventsListened = null;
  _eventSubscriberCount = null;
  _throttledEventHandlers = null;
  _boundEventHandler = null;

  init() {
    super.init(...arguments);

    if (Ember.testing) { // Do not throttle in testing mode
      this.set('EVENT_THROTTLE', 0);
    }

    this._boundEventHandler = this.handleEvent.bind(this);
    this._eventsListened = A();
    this._eventSubscriberCount = {};
    this._throttledEventHandlers = {};

    if (isEmpty(this.enabledEvents)) {
      this.set('enabledEvents', A());
    }
    this._setupListeners();
  }

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
  }

  off(eventName, target, method) {
    if (this._eventSubscriberCount[eventName]) {
      this._eventSubscriberCount[eventName]--;
    } else {
      delete this._eventSubscriberCount[eventName];
    }

    removeListener(this, eventName, target, method);
    return this;
  }

  trigger(eventName, ...args) {
    sendEvent(this, eventName, args);
  }

  has(eventName) {
    return this._eventSubscriberCount[eventName] && this._eventSubscriberCount[eventName] > 0;
  }

  handleEvent(event) {
    throttle(this, this._throttledEventHandlers[event.type], event, this.EVENT_THROTTLE);
  }

  _handleScroll() {
    this.handleEvent({ type: 'scroll' });
  }

  _setupListeners() {
    this.defaultEvents.forEach((eventName) => {
      this.enableEvent(eventName);
    });
  }

  _listen(eventName) {
    if (eventName === 'scroll') {
      this.scrollActivity.on('scroll', this, this._handleScroll);
    } else if (this._eventsListened.indexOf(eventName) === -1) {
      if (this._isFastBoot) { return; }
      this._eventsListened.pushObject(eventName);
      window.addEventListener(eventName, this._boundEventHandler, true);
    }

  }

  enableEvent(eventName) {
    if (!this.isEnabled(eventName)) {
      this.enabledEvents.pushObject(eventName);
      this._throttledEventHandlers[eventName] = function fireEnabledEvent(event) {
        if (this.isEnabled(event.type)) {
          this.fireEvent(event);
        }
      };
      this._listen(eventName);
    }
  }

  disableEvent(eventName) {
    this.enabledEvents.removeObject(eventName);
    this._eventsListened.removeObject(eventName);
    this._throttledEventHandlers[eventName] = null;
    if (eventName === 'scroll') {
      this.scrollActivity.off('scroll', this, this._handleScroll);
    } else {
      if (this._isFastBoot) { return; }
      window.removeEventListener(eventName, this._boundEventHandler, true);
    }
  }

  fireEvent(event) {
    // Only fire events that have subscribers
    if (this.has(event.type)) {
      this.trigger(event.type, event);
    }
    if (this.has('userActive')) {
      this.trigger('userActive', event);
    }
  }

  isEnabled(eventName) {
    return this.enabledEvents.includes(eventName);
  }

  willDestroy() {
    while (this._eventsListened.length > 0) {
      this.disableEvent(this._eventsListened[0]);
    }
    this._eventsListened = A();
    this._eventSubscriberCount = {};
    this._throttledEventHandlers = {};

    super.willDestroy(...arguments);
  }
}
