import Component from '@glimmer/component';
import { inject as injectService } from '@ember/service';

export default class IdleDisplay extends Component {
  @injectService('user-idle') // use the dummy's version, don't pull from addon directly
  userIdle;

  get status() {
    return this.userIdle.isIdle ? 'idle' : 'not idle';
  }
}
