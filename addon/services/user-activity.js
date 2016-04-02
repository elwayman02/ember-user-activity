import Ember from 'ember';

const { A: emberArray, Evented, Service, isEmpty } = Ember;

export default Service.extend(Evented, {
  defaultEvents: ['keydown', 'mousedown', 'mousemove', 'scroll'],
  enabledEvents: null,
  _eventsListened: null,

  _boundEventHandler: null,
  _eventHandler(event) {
    if (this.isEnabled(event.type)) {
      this.fireEvent(event);
    }
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
    this.setProperties({
      _boundEventHandler: this._eventHandler.bind(this),
      _eventsListened: emberArray()
    });
    if (isEmpty(this.get('enabledEvents'))) {
      this.set('enabledEvents', emberArray());
    }
    this._setupListeners();
  },

  enableEvent(eventName) {
    if (!this.isEnabled(eventName)) {
      this.get('enabledEvents').pushObject(eventName);
      this._listen(eventName);
    }
  },

  disableEvent(eventName) {
    this.get('enabledEvents').removeObject(eventName);
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
