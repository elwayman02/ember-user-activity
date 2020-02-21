import Component from '@ember/component';
import { inject as injectService } from '@ember/service';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { classNames } from '@ember-decorators/component';

@classNames('eventDisplay')
export default class EventDisplay extends Component {
  eventName = 'userActive';
  events = null;

  @injectService
  userActivity

  init() {
    super.init(...arguments);
    this.set('events', A());
  }

  didInsertElement() {
    this.userActivity.on(this.eventName, this, this.registerActivity);
  }

  willDestroyElement() {
    this.userActivity.off(this.eventName, this, this.registerActivity);
    this.userActivity.disableEvent(this.eventName);
  }

  registerActivity(event) {
    this.events.unshiftObject(event.type);
  }

  @action
  closeDisplay() {
    this.close(this.eventName);
  }
}
