import { test, module } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

module('beforeAcceptance test');
test('initializers', function(assert) {
  assert.equal(self.fooInitializeWasCalled, undefined, 'initializer:foo should not yet be called');
  assert.equal(self.barInitializeWasCalled, undefined, 'instance-initializer:bar should not yet be called');
});

moduleForAcceptance('Acceptance | initializers');

test('visiting /', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(self.fooInitializeWasCalled, true, 'initializer:foo should have been called');
    assert.equal(self.barInitializeWasCalled, true, 'instance-initializer:boo should have been called');
    assert.equal(currentURL(), '/');
  });
});
