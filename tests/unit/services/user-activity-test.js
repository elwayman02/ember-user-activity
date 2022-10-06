import { A as emberArray } from '@ember/array';
import { typeOf } from '@ember/utils';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Service | user activity', function (hooks) {
  setupTest(hooks);

  test('init', function (assert) {
    let service = this.owner
      .factoryFor('service:ember-user-activity@user-activity')
      .create({
        enableEvent: sinon.stub(),
      });

    assert.strictEqual(
      typeOf(service._boundEventHandler),
      'function',
      'bound event handler initialized'
    );
    assert.strictEqual(
      typeOf(service.enabledEvents),
      'array',
      'enabledEvents set to empty array'
    );
    assert.strictEqual(
      service.enableEvent.callCount,
      service.defaultEvents.length,
      'Events enabled by default'
    );
  });

  test('enableEvent', function (assert) {
    let event = 'foo';
    let service = this.owner
      .factoryFor('service:ember-user-activity@user-activity')
      .create({
        _listen: sinon.stub(),
        _setupListeners: sinon.stub(),
      });

    service.enableEvent(event);

    assert.true(
      service.enabledEvents.includes(event),
      'adds event name to enabled events'
    );
    let stub = service._listen;
    assert.true(stub.calledOnce, 'sets up listener');
    assert.strictEqual(
      stub.firstCall.args[0],
      event,
      'passes event name to _listen'
    );
  });

  test('enableEvent - already enabled', function (assert) {
    let event = 'foo';
    let service = this.owner
      .factoryFor('service:ember-user-activity@user-activity')
      .create({
        enabledEvents: emberArray([event]),
        _listen: sinon.stub(),
        _setupListeners: sinon.stub(),
      });

    service.enableEvent(event);

    assert.false(service._listen.called, 'does nothing if already enabled');
  });

  test('disableEvent', function (assert) {
    let event = 'foo';
    let service = this.owner
      .factoryFor('service:ember-user-activity@user-activity')
      .create({
        enabledEvents: emberArray([event]),
        _setupListeners: sinon.stub(),
      });

    assert.true(
      service.enabledEvents.includes(event),
      'enabledEvents preserved on init'
    );

    service.disableEvent(event);

    assert.false(
      service.enabledEvents.includes(event),
      'removed event from enabledEvents'
    );
    assert.false(
      service._eventsListened.includes(event),
      'event should not be listed as listened'
    );
  });

  test('re-enabled events should fire', function (assert) {
    let event = 'foo';
    let service = this.owner
      .factoryFor('service:ember-user-activity@user-activity')
      .create({
        enabledEvents: emberArray(),
        _setupListeners: sinon.stub(),
      });

    let addEventListenerStub = sinon.stub(window, 'addEventListener');

    assert.notOk(
      service.enabledEvents.length,
      'enabledEvents preserved on init'
    );

    service.enableEvent(event);
    assert.true(addEventListenerStub.called, 'event was not handled');
    assert.true(
      service.enabledEvents.includes(event),
      'enabledEvents should include added event'
    );

    window.addEventListener.reset();
    service.disableEvent(event);
    assert.false(
      service.enabledEvents.includes(event),
      'removed event from enabledEvents'
    );

    service.enableEvent(event);
    assert.true(window.addEventListener.called, 'event was not handled');
    assert.true(
      service.enabledEvents.includes(event),
      'enabledEvents should include added event'
    );
    window.addEventListener.restore();
  });

  test('fireEvent - no subscribers', function (assert) {
    let event = { type: 'foo' };
    let service = this.owner
      .factoryFor('service:ember-user-activity@user-activity')
      .create({
        trigger: sinon.stub(),
        _setupListeners: sinon.stub(),
      });

    service.fireEvent(event);

    assert.false(service.trigger.called, 'no events triggered');
  });

  test('fireEvent - subscribed to event', function (assert) {
    let event = { type: 'foo' };
    let service = this.owner
      .factoryFor('service:ember-user-activity@user-activity')
      .create({
        trigger: sinon.stub(),
        _setupListeners: sinon.stub(),
      });

    service.on(event.type, this, function () {});

    service.fireEvent(event);

    let stub = service.trigger;
    assert.true(stub.calledOnce, 'triggers one event');
    let { args } = stub.firstCall;
    assert.strictEqual(args[0], event.type, 'triggers event by type');
    assert.strictEqual(args[1], event, 'passes event');
  });

  test('fireEvent - subscribed to userActive', function (assert) {
    let event = { type: 'foo' };
    let service = this.owner
      .factoryFor('service:ember-user-activity@user-activity')
      .create({
        trigger: sinon.stub(),
        _setupListeners: sinon.stub(),
      });

    service.on('userActive', this, function () {});

    service.fireEvent(event);

    let stub = service.trigger;
    assert.true(stub.calledOnce, 'triggers one event');
    let { args } = stub.firstCall;
    assert.strictEqual(args[0], 'userActive', 'triggers userActive event');
    assert.strictEqual(args[1], event, 'passes event');
  });

  test('isEnabled', function (assert) {
    let event = 'foo';
    let service = this.owner
      .factoryFor('service:ember-user-activity@user-activity')
      .create({
        enabledEvents: emberArray([event]),
        _setupListeners: sinon.stub(),
      });

    assert.true(service.isEnabled(event), 'event is enabled');
    assert.false(service.isEnabled('bar'), 'other events are not enabled');
  });

  test('unsubscribe from events', function (assert) {
    sinon.spy(window, 'addEventListener');
    sinon.spy(window, 'removeEventListener');

    const service = this.owner
      .factoryFor('service:ember-user-activity@user-activity')
      .create();

    assert.strictEqual(
      window.addEventListener.callCount,
      4,
      'Subscribed to 4 window events'
    );

    service.willDestroy();
    assert.strictEqual(
      window.removeEventListener.callCount,
      4,
      'Unsubscribed from 4 window events'
    );

    window.addEventListener.restore();
    window.removeEventListener.restore();
  });

  test('localStorage is updated when subscribed to storage event and other registered event is fired', function (assert) {
    let event = { type: 'foo' };
    let service = this.owner
      .factoryFor('service:ember-user-activity@user-activity')
      .create({
        defaultEvents: ['foo', 'storage'],
      });

    localStorage.removeItem(service.localStorageKey);

    service.fireEvent(event);

    assert.true(!!localStorage.getItem(service.localStorageKey), '');
  });

  test('localStorage is not updated when not subscribed to storage event and other registered event is fired', function (assert) {
    let event = { type: 'foo' };
    let service = this.owner
      .factoryFor('service:ember-user-activity@user-activity')
      .create({
        defaultEvents: ['foo'],
      });

    localStorage.removeItem(service.localStorageKey);

    service.fireEvent(event);

    assert.false(!!localStorage.getItem(service.localStorageKey), '');
  });
});
