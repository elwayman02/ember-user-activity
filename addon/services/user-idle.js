import classic from 'ember-classic-decorator';
import Ember from 'ember';
import Evented from '@ember/object/evented';
import Service from '@ember/service';
import { inject as injectService } from '@ember/service';
import { cancel, debounce } from '@ember/runloop'

@classic
export default class UserIdleService extends Service.extend(Evented) {
  @injectService('ember-user-activity@user-activity')
  userActivity;

  _debouncedTimeout = null;
  activeEvents = ['userActive'];
  IDLE_TIMEOUT = 600000; // 10 minutes
  isIdle = false;

  _setupListeners(method) {
    this.activeEvents.forEach((event) => {
      this.userActivity[method](event, this, this.resetTimeout);
    });
  }

  init() {
    super.init(...arguments);

    if (Ember.testing) { // Shorter debounce in testing mode
      this.set('IDLE_TIMEOUT', 10);
    }
    this._setupListeners('on');
    this.resetTimeout();
  }

  willDestroy() {
    this._setupListeners('off');
    if (this._debouncedTimeout) {
      cancel(this._debouncedTimeout);
    }

    super.willDestroy(...arguments);
  }

  resetTimeout() {
    let oldIdle = this.isIdle;
    this.set('isIdle', false);
    if (oldIdle) {
      this.trigger('idleChanged', false);
    }
    this._debouncedTimeout = debounce(this, this.setIdle, this.IDLE_TIMEOUT);
  }

  setIdle() {
    if (this.isDestroyed) {
      return;
    }
    this.set('isIdle', true);
    this.trigger('idleChanged', true);
  }
}
