import Ember from 'ember';
import ScrollActivityMixin from 'ember-user-activity/mixins/scroll-activity';
import { module, test } from 'qunit';

module('Unit | Mixin | scroll activity');

// Replace this with your real tests.
test('it works', function(assert) {
  let ScrollActivityObject = Ember.Object.extend(ScrollActivityMixin);
  let subject = ScrollActivityObject.create();
  assert.ok(subject);
});
