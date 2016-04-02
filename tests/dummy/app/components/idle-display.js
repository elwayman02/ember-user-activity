import Ember from 'ember';

const { Component, computed, inject } = Ember;

export default Component.extend({
  classNames: ['idleDisplay'],
  userIdle: inject.service(),

  isIdle: computed.readOnly('userIdle.isIdle'),

  status: computed('isIdle', function () {
    return this.get('isIdle') ? 'idle' : 'not idle';
  })
});
