import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class IdleDisplay extends Component {
  @service userIdle; // use the dummy's version, don't pull from addon directly

  get status() {
    return this.userIdle.isIdle ? 'idle' : 'not idle';
  }
}
