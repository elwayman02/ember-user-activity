import { moduleFor } from 'ember-qunit';
import test from 'dummy/tests/ember-sinon-qunit/test';
import wait from 'ember-test-helpers/wait';

moduleFor('service:user-idle', 'Unit | Service | user idle', {
  needs: ['service:ember-user-activity@user-activity', 'service:ember-user-activity@scroll-activity']
});

test('init starts timer', function (assert) {
  let service = this.subject({
    resetTimeout: this.stub()
  });

  assert.ok(service.get('resetTimeout').calledOnce, 'resetTimeout was called');
});

test('init sets up event listeners', function (assert) {
  let event = 'foo';
  let service = this.subject({
    activeEvents: [event],
    resetTimeout: this.stub()
  });

  service.get('userActivity').trigger(event);

  let stub = service.get('resetTimeout');
  assert.ok(stub.calledTwice, 'resetTimeout was called');
});

test('resetTimeout', function (assert) {
  assert.expect(2);

  let service = this.subject({
    init: this.stub(),
    isIdle: true,
    IDLE_TIMEOUT: 100
  });

  service.resetTimeout();

  assert.ok(!service.get('isIdle'), 'isIdle is false');

  return wait().then(function () {
    assert.ok(service.get('isIdle'), 'isIdle is set to true after timeout');
  });
});

test('setIdle', function (assert) {
  let service = this.subject({
    resetTimeout: this.stub()
  });

  service.setIdle();

  assert.ok(service.get('isIdle'), 'isIdle is true');
});
