import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';
import sinon from 'sinon';

module('Unit | Service | user idle', function (hooks) {
  setupTest(hooks);

  test('init starts timer', function (assert) {
    let service = this.owner
      .factoryFor('service:ember-user-activity@user-idle')
      .create({
        resetTimeout: sinon.stub(),
      });

    assert.ok(service.resetTimeout.calledOnce, 'resetTimeout was called');
  });

  test('init sets up event listeners', function (assert) {
    let event = 'foo';
    let service = this.owner
      .factoryFor('service:ember-user-activity@user-idle')
      .create({
        activeEvents: [event],
        resetTimeout: sinon.stub(),
      });

    service.userActivity.trigger(event);

    let stub = service.resetTimeout;
    assert.ok(stub.calledTwice, 'resetTimeout was called');
  });

  test('resetTimeout', function (assert) {
    assert.expect(5);

    let service = this.owner
      .factoryFor('service:ember-user-activity@user-idle')
      .create({
        trigger: sinon.stub(),
        isIdle: true,
        IDLE_TIMEOUT: 100,
      });

    service.resetTimeout();

    let stub = service.trigger;
    assert.ok(stub.calledOnce, 'triggers one event');
    let { args } = stub.firstCall;
    assert.equal(args[0], 'idleChanged', 'triggers idleChanged event');
    assert.equal(args[1], false, 'passes data');

    assert.ok(!service.isIdle, 'isIdle is false');

    return settled().then(function () {
      assert.ok(service.isIdle, 'isIdle is set to true after timeout');
    });
  });

  test('setIdle', function (assert) {
    let service = this.owner
      .factoryFor('service:ember-user-activity@user-idle')
      .create({
        trigger: sinon.stub(),
        resetTimeout: sinon.stub(),
      });

    service.setIdle();

    let stub = service.trigger;
    assert.ok(stub.calledOnce, 'triggers one event');
    let { args } = stub.firstCall;
    assert.equal(args[0], 'idleChanged', 'triggers idleChanged event');
    assert.equal(args[1], true, 'passes data');

    assert.ok(service.isIdle, 'isIdle is true');
  });
});
