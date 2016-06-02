import Component from 'ember-component';
import injectService from 'ember-service/inject';
import { A } from 'ember-array/utils';

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
    this.get('userActivity').off(this.get('eventName'), this, this.registerActivity);
  },

  registerActivity(event) {
    this.get('events').unshiftObject(event.type);
  }
});
