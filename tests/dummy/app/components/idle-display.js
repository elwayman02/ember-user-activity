import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { computed } from '@ember/object'
import { inject as injectService } from '@ember/service';
import { classNames } from '@ember-decorators/component';

@classNames('idleDisplay')
export default class IdleDisplay extends Component {
  @injectService
  userIdle

  @readOnly('userIdle.isIdle')
  isIdle

  @computed('isIdle')
  get status () {
    return this.isIdle ? 'idle' : 'not idle';
  }
}
