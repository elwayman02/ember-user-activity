import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { computed } from '@ember/object'
import { inject as injectService } from '@ember/service';

export default Component.extend({
  classNames: ['idleDisplay'],
  userIdle: injectService(),

  isIdle: readOnly('userIdle.isIdle'),

  status: computed('isIdle', function () {
    return this.get('isIdle') ? 'idle' : 'not idle';
  })
});
