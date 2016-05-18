import Ember from 'ember';
import injectService from 'ember-service/inject';

const { A: emberArray, Evented, Service, isEmpty, run, testing } = Ember;

export default Service.extend(Evented, {
  scrollActivity: injectService('ember-user-activity@scroll-activity'),

  EVENT_THROTTLE: 100,
  defaultEvents: ['keydown', 'mousedown', 'scroll'],
  enabledEvents: null,
  _eventsListened: null,

  _throttledEventHandlers: null,

  _boundEventHandler: null,
  handleEvent(event) {
    run.throttle(this, this._throttledEventHandlers[event.type], event, this.get('EVENT_THROTTLE'));
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
    } else if (this.get('_eventsListened').indexOf(eventName) === -1) {
      this.get('_eventsListened').pushObject(eventName);
      window.addEventListener(eventName, this._boundEventHandler, true);
    }

  },

  init() {
    if (testing) { // Do not throttle in testing mode
      this.set('EVENT_THROTTLE', 0);
    }
    this.setProperties({
      _boundEventHandler: this.handleEvent.bind(this),
      _eventsListened: emberArray(),
      _throttledEventHandlers: {}
    });
    if (isEmpty(this.get('enabledEvents'))) {
      this.set('enabledEvents', emberArray());
    }
    this._setupListeners();
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
    this.set(`_throttledEventHandlers.${eventName}`, null);
    if (eventName === 'scroll') {
      this.get('scrollActivity').off('scroll', this, this._handleScroll);
    } else {
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
    this.get('_eventsListened').forEach((eventName) => {
      this.disableEvent(eventName);
    });
  }
});
