import Mixin from 'ember-metal/mixin';
import getOwner from 'ember-owner/get';
import computed from 'ember-computed';

export default Mixin.create({
    _fastboot: computed(function() {
      let owner = getOwner(this);
      return owner.lookup('service:fastboot');
    }),

    _isFastBoot: computed.readOnly('_fastboot.isFastBoot')
});
