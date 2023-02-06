import FastBootAwareEventManagerService from './-private/fastboot-aware-event-manager';
import Ember from 'ember';
import { A } from '@ember/array';
import { throttle } from '@ember/runloop';
import { inject as injectService } from '@ember/service';
import storageAvailable from '../utils/storage-available';

export default class UserActivityService extends FastBootAwareEventManagerService {
  @injectService('ember-user-activity@scroll-activity')
  scrollActivity;

  EVENT_THROTTLE;
  defaultEvents = ['keydown', 'mousedown', 'scroll', 'touchstart', 'storage'];
  enabledEvents = A();
  _eventsListened = A();
  _eventSubscriberCount = {};
  _throttledEventHandlers = {};
  _boundEventHandler = null;
  localStorageKey = 'ember-user-activity';

  // TODO: migrate to constructor
  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init(...arguments);

    // Do not throttle in testing mode
    this.EVENT_THROTTLE = Ember.testing ? 0 : 100;

    this._boundEventHandler = this.handleEvent.bind(this);

    this._setupListeners();
  }

  on(eventName) {
    this.enableEvent(eventName);
    if (this._eventSubscriberCount[eventName]) {
      this._eventSubscriberCount[eventName]++;
    } else {
      this._eventSubscriberCount[eventName] = 1;
    }

    return super.on(...arguments);
  }

  off(eventName) {
    if (this._eventSubscriberCount[eventName]) {
      this._eventSubscriberCount[eventName]--;
    } else {
      delete this._eventSubscriberCount[eventName];
    }

    return super.off(...arguments);
  }

  has(eventName) {
    return (
      this._eventSubscriberCount[eventName] &&
      this._eventSubscriberCount[eventName] > 0
    );
  }

  handleEvent(event) {
    if (event.type === 'storage' && event.key !== this.localStorageKey) {
      return;
    }
    throttle(
      this,
      this._throttledEventHandlers[event.type],
      event,
      this.EVENT_THROTTLE
    );
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
      if (this._isFastBoot) {
        return;
      }
      this._eventsListened.pushObject(eventName);
      window.addEventListener(eventName, this._boundEventHandler, true);
    }
  }

  enableEvent(eventName) {
    if (!this.isEnabled(eventName)) {
      this.enabledEvents.pushObject(eventName);
      this._throttledEventHandlers[eventName] = function fireEnabledEvent(
        event
      ) {
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
      if (this._isFastBoot) {
        return;
      }
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
    if (
      this._eventsListened.includes('storage') &&
      storageAvailable('localStorage')
    ) {
      // We store a date here since we have to update the storage with a new value
      localStorage.setItem(this.localStorageKey, new Date());
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

    if (this.localStorageKey && storageAvailable('localStorage')) {
      localStorage.removeItem(this.localStorageKey);
    }

    super.willDestroy(...arguments);
  }
}
