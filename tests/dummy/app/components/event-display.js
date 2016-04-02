import Ember from 'ember';

const { A: emberArray, Component, inject } = Ember;

export default Component.extend({
  classNames: ['eventDisplay'],
  userActivity: inject.service(),
  eventName: 'userActive',

  events: null,

  init() {
    this._super(...arguments);
    this.set('events', emberArray());
  },

  didInsertElement() {
    this.get('userActivity').on(this.get('eventName'), this, this.registerActivity);
  },

  willDestroyElement() {
    this.get('userActivity').on(this.get('eventName'), this, this.registerActivity);
  },

  registerActivity(event) {
    this.get('events').unshiftObject(event.type);
  }
});
