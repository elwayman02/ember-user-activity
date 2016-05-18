import { moduleFor } from 'ember-qunit';
import test from 'dummy/tests/ember-sinon-qunit/test';
import { A, isEmberArray } from 'ember-array/utils';
import { isEmpty } from 'ember-utils';

moduleFor('service:scroll-activity', 'Unit | Service | scroll activity', {});

test('init', function (assert) {
  let service = this.subject({
    subscribe: this.stub(),
    _pollScroll: this.stub()
  });

  assert.ok(isEmberArray(service.get('subscribers')), 'sets subscribers to new Ember.A');
  assert.ok(service.subscribe.calledOnce, 'subscribe was called');
  assert.ok(service._pollScroll.calledOnce, '_pollScroll was called');
});

test('subscribe - no callback', function (assert) {
  let service = this.subject({
    init: this.stub(),
    subscribers: A()
  });
  let scrollTop = 1234;
  let elem = {
    scrollTop() {
      return scrollTop;
    }
  };
  let target = { elem };

  service.subscribe(target, elem);

  assert.equal(service.get('subscribers.length'), 1, '1 subscriber added');

  let sub = service.get('subscribers.firstObject');
  assert.equal(sub.get('target'), target, 'target added to subscriber object');
  assert.equal(sub.get('element'), elem, 'element added to subscriber object');
  assert.equal(typeof(sub.get('callback')), 'function', 'no-op function added when callback not provided');
  assert.equal(sub.get('scrollTop'), scrollTop, 'scrollTop added to subscriber object');
});

test('subscribe - with callback', function (assert) {
  let service = this.subject({
    init: this.stub(),
    subscribers: A()
  });
  let scrollTop = 1234;
  let elem = {
    scrollTop() {
      return scrollTop;
    }
  };
  let target = { elem };
  let callback = 'foo';

  service.subscribe(target, elem, callback);

  assert.equal(service.get('subscribers.length'), 1, '1 subscriber added');

  let sub = service.get('subscribers.firstObject');
  assert.equal(sub.get('target'), target, 'target added to subscriber object');
  assert.equal(sub.get('element'), elem, 'element added to subscriber object');
  assert.equal(sub.get('callback'), callback, 'callback added to subscriber object');
  assert.equal(sub.get('scrollTop'), scrollTop, 'scrollTop added to subscriber object');
});

test('unsubscribe', function (assert) {
  let service = this.subject({
    init: this.stub(),
    subscribers: A()
  });
  let scrollTop = 1234;
  let elem = {
    scrollTop() {
      return scrollTop;
    }
  };
  let target = { elem };

  service.subscribe(target, elem);

  target.foo = 'foo'; // simulate a change to the target object over time

  service.unsubscribe(target);

  assert.ok(isEmpty(service.get('subscribers')), 'subscriber removed');
});

test('_checkScroll - no change', function (assert) {
  let service = this.subject({
    init: this.stub(),
    _pollScroll: this.stub(),
    trigger: this.stub(),
    subscribers: A()
  });
  let scrollTop = 1234;
  let elem = {
    scrollTop() {
      return scrollTop;
    }
  };
  let target = { elem };
  let callback = this.stub();
  service.subscribe(target, elem, callback);

  service._checkScroll();

  assert.notOk(callback.called, 'callback not called when scrollTop has not changed');
  assert.notOk(service.trigger.called, 'no scroll event triggered');
  assert.ok(service._pollScroll.calledOnce, '_pollScroll called to schedule polling');
});

test('_checkScroll - scroll changed', function (assert) {
  let service = this.subject({
    init: this.stub(),
    _pollScroll: this.stub(),
    trigger: this.stub(),
    subscribers: A()
  });
  let scrollTop = 1234;
  let elem = {
    scrollTop() {
      return scrollTop;
    }
  };
  let target = { elem };
  let callback = this.stub();
  service.subscribe(target, elem, callback);
  scrollTop = 4321;

  service._checkScroll();

  assert.ok(callback.calledOnce, 'callback called when scrollTop has changed');
  assert.ok(service.trigger.calledOnce, 'trigger called');
  assert.equal(service.trigger.firstCall.args[0], 'scroll', 'scroll event triggered');
  assert.ok(service._pollScroll.calledOnce, '_pollScroll called to schedule polling');
});
