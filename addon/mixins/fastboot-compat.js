import { readOnly } from '@ember/object/computed';
import Mixin from '@ember/object/mixin'
import { getOwner } from '@ember/application';
import { computed } from "@ember/object";

export default Mixin.create({
    _fastboot: computed(function() {
      let owner = getOwner(this);
      return owner.lookup('service:fastboot');
    }),

    _isFastBoot: readOnly('_fastboot.isFastBoot')
});
