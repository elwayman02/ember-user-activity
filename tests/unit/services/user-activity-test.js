import Ember from 'ember';
import { moduleFor } from 'ember-qunit';
import test from 'dummy/tests/ember-sinon-qunit/test';

const { A: emberArray, K: noOp, typeOf } = Ember;

moduleFor('service:user-activity', 'Unit | Service | user activity', {});

test('init', function (assert) {
  let service = this.subject({
    enableEvent: this.stub()
  });

  assert.equal(typeOf(service.get('_boundEventHandler')), 'function', 'bound event handler initialized');
  assert.equal(typeOf(service.get('enabledEvents')), 'array', 'enabledEvents set to empty array');
  assert.equal(service.enableEvent.callCount, 3, '3 events enabled by default');
});

test('enableEvent', function (assert) {
  let event = 'foo';
  let service = this.subject({
    _listen: this.stub(),
    _setupListeners: this.stub()
  });

  service.enableEvent(event);

  assert.ok(service.get('enabledEvents').includes(event), 'adds event name to enabled events');
  let stub = service._listen;
  assert.ok(stub.calledOnce, 'sets up listener');
  assert.equal(stub.firstCall.args[0], event, 'passes event name to _listen');
});

test('enableEvent - already enabled', function (assert) {
  let event = 'foo';
  let service = this.subject({
    enabledEvents: emberArray([event]),
    _listen: this.stub(),
    _setupListeners: this.stub()
  });

  service.enableEvent(event);

  assert.ok(!service._listen.called, 'does nothing if already enabled');
});

test('disableEvent', function (assert) {
  let event = 'foo';
  let service = this.subject({
    enabledEvents: emberArray([event]),
    _setupListeners: this.stub()
  });

  assert.ok(service.get('enabledEvents').includes(event), 'enabledEvents preserved on init');

  service.disableEvent(event);

  assert.ok(!service.get('enabledEvents').includes(event), 'removed event from enabledEvents');
});

test('fireEvent - no subscribers', function (assert) {
  let event = { type: 'foo' };
  let service = this.subject({
    trigger: this.stub(),
    _setupListeners: this.stub()
  });

  service.fireEvent(event);

  assert.ok(!service.trigger.called, 'no events triggered');
});

test('fireEvent - subscribed to event', function (assert) {
  let event = { type: 'foo' };
  let service = this.subject({
    trigger: this.stub(),
    _setupListeners: this.stub()
  });

  service.on(event.type, this, noOp);

  service.fireEvent(event);

  let stub = service.trigger;
  assert.ok(stub.calledOnce, 'triggers one event');
  let { args } = stub.firstCall;
  assert.equal(args[0], event.type, 'triggers event by type');
  assert.equal(args[1], event, 'passes event');
});

test('fireEvent - subscribed to userActive', function (assert) {
  let event = { type: 'foo' };
  let service = this.subject({
    trigger: this.stub(),
    _setupListeners: this.stub()
  });

  service.on('userActive', this, noOp);

  service.fireEvent(event);

  let stub = service.trigger;
  assert.ok(stub.calledOnce, 'triggers one event');
  let { args } = stub.firstCall;
  assert.equal(args[0], 'userActive', 'triggers userActive event');
  assert.equal(args[1], event, 'passes event');
});

test('isEnabled', function (assert) {
  let event = 'foo';
  let service = this.subject({
    enabledEvents: emberArray([event]),
    _setupListeners: this.stub()
  });

  assert.ok(service.isEnabled(event), 'event is enabled');
  assert.ok(!service.isEnabled('bar'), 'other events are not enabled');
});
