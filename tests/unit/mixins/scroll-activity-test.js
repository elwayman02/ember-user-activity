import Ember from 'ember';
import ScrollActivityMixin from 'ember-user-activity/mixins/scroll-activity';
import { module } from 'qunit';
import test from 'dummy/tests/ember-sinon-qunit/test';

module('Unit | Mixin | scroll activity');

let scrollActivity, elem, callback;

function setupTests(withCallback) {
  scrollActivity = {
    subscribe: this.stub(),
    unsubscribe: this.stub()
  };
  elem = 'foo';
  let ScrollActivityObject = Ember.Object.extend(ScrollActivityMixin, {
    scrollActivity,
    $() {
      return elem;
    }
  });
  let subject = ScrollActivityObject.create();

  if (withCallback) {
    callback = function () {
      return this; // return context so we can assert correct binding
    };
    subject.set('didScroll', callback);
  }

  return subject;
}

test('scrollSubscribe - no-op callback', function (assert) {
  let subject = setupTests.call(this);

  subject.scrollSubscribe();
  assert.ok(scrollActivity.subscribe.calledOnce, 'subscribe called');

  let { args } = scrollActivity.subscribe.firstCall;
  assert.equal(args[0], subject, 'object passed as target');
  assert.equal(args[1], elem, 'element passed');
  assert.equal(typeof(args[2]), 'function', 'no-op function passed as callback');
});

test('scrollSubscribe - with callback', function (assert) {
  let subject = setupTests.call(this, true);

  subject.scrollSubscribe();
  assert.ok(scrollActivity.subscribe.calledOnce, 'subscribe called');

  let { args } = scrollActivity.subscribe.firstCall;
  assert.equal(args[0], subject, 'object passed as target');
  assert.equal(args[1], elem, 'element passed');
  assert.equal(typeof(args[2]), 'function', 'callback passed');
  assert.equal(args[2](), subject, 'callback was bound to object context');
});

test('scrollUnsubscribe', function (assert) {
  let subject = setupTests.call(this);

  subject.scrollUnsubscribe();
  assert.ok(scrollActivity.unsubscribe.calledOnce, 'unsubscribe called');
  assert.equal(scrollActivity.unsubscribe.firstCall.args[0], subject, 'object passed as target');
});
