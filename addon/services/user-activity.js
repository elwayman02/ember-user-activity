import Ember from 'ember';

const { A: emberArray, Evented, Service, isEmpty, run, testing } = Ember;

export default Service.extend(Evented, {
  EVENT_THROTTLE: 100,
  defaultEvents: ['keydown', 'mousedown', 'mousemove', 'scroll'],
  enabledEvents: null,
  _eventsListened: null,

  _throttledEventHandlers: null,

  _boundEventHandler: null,
  _eventHandler(event) {
    run.throttle(this, this._throttledEventHandlers[event.type], event, this.get('EVENT_THROTTLE'));
  },

  _setupListeners() {
    this.get('defaultEvents').forEach((eventName) => {
      this.enableEvent(eventName);
    });
  },

  _listen(eventName) {
    if (this.get('_eventsListened').indexOf(eventName) === -1) {
      this.get('_eventsListened').pushObject(eventName);
      window.addEventListener(eventName, this._boundEventHandler, true);
    }
  },

  init() {
    if (testing) { // Do not throttle in testing mode
      this.set('EVENT_THROTTLE', 0);
    }
    this.setProperties({
      _boundEventHandler: this._eventHandler.bind(this),
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
      window.removeEventListener(eventName, this._boundEventHandler, true);
    });
  }
});
