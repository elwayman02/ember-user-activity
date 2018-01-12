import Component from '@ember/component';
import { computed } from '@ember/object'
import { inject as injectService } from '@ember/service';

export default Component.extend({
  classNames: ['idleDisplay'],
  userIdle: injectService(),

  isIdle: computed.readOnly('userIdle.isIdle'),

  status: computed('isIdle', function () {
    return this.get('isIdle') ? 'idle' : 'not idle';
  })
});
