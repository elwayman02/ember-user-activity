import Controller from '@ember/controller';
import { A } from '@ember/array';
import { action } from '@ember/object';

export default class IndexController extends Controller {
  eventNames = A([
    'userActive',
    'scroll',
    'mousedown',
    'keydown',
    'touchstart',
    'storage',
  ]);

  @action
  addEvent(eventName) {
    if (!this.eventNames.includes(eventName)) {
      this.eventNames.pushObject(eventName);
    }
  }

  @action
  removeEvent(eventName) {
    this.eventNames.removeObject(eventName);
  }
}
