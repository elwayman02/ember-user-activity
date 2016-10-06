import Ember from 'ember';
import FastbootCompatMixin from 'ember-user-activity/mixins/fastboot-compat';
import { module, test } from 'qunit';

module('Unit | Mixin | fastboot compat');

// Replace this with your real tests.
test('it works', function(assert) {
  let FastbootCompatObject = Ember.Object.extend(FastbootCompatMixin);
  let subject = FastbootCompatObject.create();
  assert.ok(subject);
});
