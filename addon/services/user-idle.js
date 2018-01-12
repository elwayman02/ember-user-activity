import Ember from 'ember';
import Evented from '@ember/object/evented';
import Service from '@ember/service';
import { inject as injectService } from '@ember/service';
import { cancel, debounce } from '@ember/runloop'

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

    if (Ember.testing) { // Shorter debounce in testing mode
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
    let oldIdle = this.get('isIdle');
    this.set('isIdle', false);
    if (oldIdle) {
      this.trigger('idleChanged', false);
    }
    this._debouncedTimeout = debounce(this, this.setIdle, this.get('IDLE_TIMEOUT'));
  },

  setIdle() {
    if (this.isDestroyed) {
      return;
    }
    this.set('isIdle', true);
    this.trigger('idleChanged', true);
  }
});
