import Controller from '@ember/controller';
import { A } from '@ember/array';
import { action } from '@ember/object';

export default Controller.extend({
  eventNames: null,

  init() {
    this._super(...arguments);
    this.set('eventNames', A(['userActive', 'scroll', 'mousedown', 'keydown', 'touchstart']));
  },

  @action
  addEvent(eventName) {
    if (!this.get('eventNames').includes(eventName)) {
      this.get('eventNames').pushObject(eventName);
    }
  },

  @action
  removeEvent(eventName) {
    this.get('eventNames').removeObject(eventName);
  }
});
