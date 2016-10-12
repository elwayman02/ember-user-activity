import Ember from 'ember';
import FastbootCompatMixin from 'ember-user-activity/mixins/fastboot-compat';
import { moduleFor, test } from 'ember-qunit';
const { getOwner } = Ember;

moduleFor('mixin:fastboot-compat', 'Unit | Mixin | fastboot compat', {
integration: true,
  subject() {
    let FastbootCompatObject = Ember.Object.extend(FastbootCompatMixin);
    this.register('test-container:fastboot-compat-object', FastbootCompatObject);
    return getOwner(this).lookup('test-container:fastboot-compat-object');
  }
});

test('isFastBoot in the browser', function(assert) {
  const subject = this.subject();
  assert.equal(subject.get('_isFastBoot'), undefined, `it should be undefined`);
});
