import Ember from 'ember';
import Evented from 'ember-evented';
import Service from 'ember-service';
import injectService from 'ember-service/inject';
import { cancel, debounce } from 'ember-runloop';

const { testing } = Ember;

export default Service.extend(Evented, {
  userActivity: injectService('ember-user-activity@user-activity'),

  _debouncedTimeout: null,

  activeEvents: ['userActive'],
  IDLE_TIMEOUT: 600000, // 10 minutes
  isIdle: false,

  _setupListeners(method) {
    let userActivity = this.get('userActivity');
    this.get('activeEvents').forEach((event) => {
      userActivity[method](event, this, this.resetTimeout);
    });
  },

  init() {
    this._super(...arguments);

    if (testing) { // Shorter debounce in testing mode
      this.set('IDLE_TIMEOUT', 10);
    }
    this._setupListeners('on');
    this.resetTimeout();
  },

  willDestroy() {
    this._setupListeners('off');
    if (this._debouncedTimeout) {
      cancel(this._debouncedTimeout);
    }

    this._super(...arguments);
  },

  resetTimeout() {
    this.set('isIdle', false);
    this.trigger('idleChanged', false);
    this._debouncedTimeout = debounce(this, this.setIdle, this.get('IDLE_TIMEOUT'));
  },

  setIdle() {
    this.set('isIdle', true);
    this.trigger('idleChanged', true);
  }
});
