import { A as emberArray } from '@ember/array';
import { typeOf } from '@ember/utils';
import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

moduleFor('service:user-activity', 'Unit | Service | user activity', {
  needs: ['service:ember-user-activity@scroll-activity']
});

test('init', function (assert) {
  let service = this.subject({
    enableEvent: this.stub()
  });

  assert.equal(typeOf(service.get('_boundEventHandler')), 'function', 'bound event handler initialized');
  assert.equal(typeOf(service.get('enabledEvents')), 'array', 'enabledEvents set to empty array');
  assert.equal(service.enableEvent.callCount, service.get('defaultEvents.length'), 'Events enabled by default');
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
  assert.notOk(service._eventsListened.includes(event), 'event should not be listed as listened');
});

test('re-enabled events should fire', function (assert) {
  let event = 'foo';
  let service = this.subject({
    enabledEvents: emberArray(),
    _setupListeners: this.stub()
  });

  let addEventListenerStub = this.stub(window, 'addEventListener');

  assert.notOk(service.get('enabledEvents.length'), 'enabledEvents preserved on init');

  service.enableEvent(event);
  assert.ok(addEventListenerStub.called, 'event was not handled');
  assert.ok(service.get('enabledEvents').includes(event), 'enabledEvents should include added event');

  window.addEventListener.reset();
  service.disableEvent(event);
  assert.ok(!service.get('enabledEvents').includes(event), 'removed event from enabledEvents');

  service.enableEvent(event);
  assert.ok(window.addEventListener.called, 'event was not handled');
  assert.ok(service.get('enabledEvents').includes(event), 'enabledEvents should include added event');
  window.addEventListener.restore();
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

  service.on(event.type, this, function() {});

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

  service.on('userActive', this, function() {});

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
