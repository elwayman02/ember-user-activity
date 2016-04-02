import Ember from 'ember';

const { Service, inject, run } = Ember;

export default Service.extend({
  userActivity: inject.service('ember-user-activity@user-activity'),

  activeEvents: ['userActive'],
  IDLE_TIMEOUT: 600000, // 10 minutes
  isIdle: false,

  init() {
    let userActivity = this.get('userActivity');
    this.get('activeEvents').forEach((event) => {
      userActivity.on(event, this, this.resetTimeout);
    });
    this.resetTimeout();
  },

  willDestroy() {
    let userActivity = this.get('userActivity');
    this.get('activeEvents').forEach((event) => {
      userActivity.off(event, this, this.resetTimeout);
    });
  },

  resetTimeout() {
    this.set('isIdle', false);
    run.debounce(this, this.setIdle, this.get('IDLE_TIMEOUT'));
  },

  setIdle() {
    this.set('isIdle', true);
  }
});
