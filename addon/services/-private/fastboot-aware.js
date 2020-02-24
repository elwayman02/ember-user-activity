import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { readOnly } from '@ember/object/computed';

@classic
export default class FastBootAwareService extends Service {
  // Fastboot Compatibility
  @computed
  get _fastboot() {
    let owner = getOwner(this);
    return owner.lookup('service:fastboot');
  }

  @readOnly('_fastboot.isFastBoot')
  _isFastBoot;
}
