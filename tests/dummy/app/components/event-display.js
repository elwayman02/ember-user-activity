import Component from '@glimmer/component';
import { service } from '@ember/service';
import { A } from '@ember/array';

export default class EventDisplay extends Component {
  events = A();

  @service userActivity;

  constructor() {
    super(...arguments);
    this.userActivity.on(this.args.eventName, this, this.registerActivity);
  }

  willDestroy() {
    super.willDestroy();
    this.userActivity.off(this.args.eventName, this, this.registerActivity);
    this.userActivity.disableEvent(this.args.eventName);
  }

  registerActivity(event) {
    this.events.unshiftObject(event.type);
  }
}
