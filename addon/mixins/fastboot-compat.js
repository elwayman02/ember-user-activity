import Ember from 'ember';
import Mixin from 'ember-metal/mixin';
import computed from 'ember-computed';

export default Mixin.create({
    _fastboot: computed(function() {
      let owner = Ember.getOwner(this);
      return owner.lookup('service:fastboot');
    }),

    _isFastBoot: computed.readOnly('_fastboot.isFastBoot')
});
