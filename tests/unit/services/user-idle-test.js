import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
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
  assert.expect(5);

  let service = this.subject({
    trigger: this.stub(),
    init: this.stub(),
    isIdle: true,
    IDLE_TIMEOUT: 100
  });

  service.resetTimeout();

  let stub = service.trigger;
  assert.ok(stub.calledOnce, 'triggers one event');
  let { args } = stub.firstCall;
  assert.equal(args[0], 'idleChanged', 'triggers idleChanged event');
  assert.equal(args[1], false, 'passes data');

  assert.ok(!service.get('isIdle'), 'isIdle is false');

  return wait().then(function () {
    assert.ok(service.get('isIdle'), 'isIdle is set to true after timeout');
  });
});

test('setIdle', function (assert) {
  let service = this.subject({
    trigger: this.stub(),
    resetTimeout: this.stub()
  });

  service.setIdle();

  let stub = service.trigger;
  assert.ok(stub.calledOnce, 'triggers one event');
  let { args } = stub.firstCall;
  assert.equal(args[0], 'idleChanged', 'triggers idleChanged event');
  assert.equal(args[1], true, 'passes data');

  assert.ok(service.get('isIdle'), 'isIdle is true');
});
