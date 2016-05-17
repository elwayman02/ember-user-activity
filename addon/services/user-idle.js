import Ember from 'ember';

const { Service, inject, run, testing } = Ember;

export default Service.extend({
  userActivity: inject.service('ember-user-activity@user-activity'),

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
    if (testing) { // Shorter debounce in testing mode
      this.set('IDLE_TIMEOUT', 10);
    }
    this._setupListeners('on');
    this.resetTimeout();
  },

  willDestroy() {
    this._setupListeners('off');
  },

  resetTimeout() {
    this.set('isIdle', false);
    run.debounce(this, this.setIdle, this.get('IDLE_TIMEOUT'));
  },

  setIdle() {
    this.set('isIdle', true);
  }
});
