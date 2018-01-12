import Component from '@ember/component';
import { inject as injectService } from '@ember/service';
import { A } from '@ember/array';

export default Component.extend({
  classNames: ['eventDisplay'],
  userActivity: injectService(),
  eventName: 'userActive',

  events: null,

  init() {
    this._super(...arguments);
    this.set('events', A());
  },

  didInsertElement() {
    this.get('userActivity').on(this.get('eventName'), this, this.registerActivity);
  },

  willDestroyElement() {
    let userActivity = this.get('userActivity');
    let eventName = this.get('eventName');
    userActivity.off(eventName, this, this.registerActivity);
    userActivity.disableEvent(eventName);
  },

  registerActivity(event) {
    this.get('events').unshiftObject(event.type);
  },

  actions: {
    close() {
      this.get('close')(this.get('eventName'));
    }
  }
});
