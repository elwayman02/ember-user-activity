import Ember from 'ember';
import EventManagerService from './-private/event-manager';
import { inject as injectService } from '@ember/service';
import { cancel, debounce } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

export default class UserIdleService extends EventManagerService {
  @injectService('ember-user-activity@user-activity')
  userActivity;

  _debouncedTimeout = null;
  activeEvents = ['userActive'];
  IDLE_TIMEOUT = 600000; // 10 minutes
  @tracked isIdle = false;

  _setupListeners(method) {
    this.activeEvents.forEach((event) => {
      this.userActivity[method](event, this, this.resetTimeout);
    });
  }

  // TODO: migrate to constructor
  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init(...arguments);

    if (Ember.testing) {
      // Shorter debounce in testing mode
      this.IDLE_TIMEOUT = 10;
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
    this.isIdle = false;
    if (oldIdle) {
      this.trigger('idleChanged', false);
    }
    this._debouncedTimeout = debounce(this, this.setIdle, this.IDLE_TIMEOUT);
  }

  setIdle() {
    if (this.isDestroyed) {
      return;
    }
    this.isIdle = true;
    this.trigger('idleChanged', true);
  }
}
