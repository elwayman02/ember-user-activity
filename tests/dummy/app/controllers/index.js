import Controller from '@ember/controller';
import { A } from '@ember/array';

export default Controller.extend({
  eventNames: null,

  init() {
    this._super(...arguments);
    this.set('eventNames', A(['userActive', 'scroll', 'mousedown', 'keydown', 'touchstart']));
  },

  actions: {
    addEvent(eventName, event) {
      if (event.which === 13 && !this.get('eventNames').includes(eventName)) { // enter key pressed
        this.get('eventNames').pushObject(eventName);
      }
    },

    removeEvent(eventName) {
      this.get('eventNames').removeObject(eventName);
    }
  }
});
