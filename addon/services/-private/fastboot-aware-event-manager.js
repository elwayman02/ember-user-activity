import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import EventManagerService from 'ember-user-activity/services/-private/event-manager';
import { getOwner } from '@ember/application';
import { readOnly } from '@ember/object/computed';

@classic
export default class FastBootAwareEventManagerService extends EventManagerService {
  // Fastboot Compatibility
  @computed
  get _fastboot() {
    let owner = getOwner(this);
    return owner.lookup('service:fastboot');
  }

  @readOnly('_fastboot.isFastBoot')
  _isFastBoot;
}
