import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';
import test from 'ember-sinon-qunit/test-support/test';

module('Unit | Service | user idle', function(hooks) {
  setupTest(hooks);

  test('init starts timer', function (assert) {
    let service = this.owner.factoryFor('service:ember-user-activity@user-idle').create({
      resetTimeout: this.stub()
    });

    assert.ok(service.get('resetTimeout').calledOnce, 'resetTimeout was called');
  });

  test('init sets up event listeners', function (assert) {
    let event = 'foo';
    let service = this.owner.factoryFor('service:ember-user-activity@user-idle').create({
      activeEvents: [event],
      resetTimeout: this.stub()
    });

    service.get('userActivity').trigger(event);

    let stub = service.get('resetTimeout');
    assert.ok(stub.calledTwice, 'resetTimeout was called');
  });

  test('resetTimeout', function (assert) {
    assert.expect(5);

    let service = this.owner.factoryFor('service:ember-user-activity@user-idle').create({
      trigger: this.stub(),
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

    return settled().then(function () {
      assert.ok(service.get('isIdle'), 'isIdle is set to true after timeout');
    });
  });

  test('setIdle', function (assert) {
    let service = this.owner.factoryFor('service:ember-user-activity@user-idle').create({
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
});
