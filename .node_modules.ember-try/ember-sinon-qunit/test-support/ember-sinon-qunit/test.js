// backwards compatibility
import test from 'ember-sinon-qunit/test-support/test';
export default function () {
  console.warn("Using deprecated import path for ember-sinon-qunit; use `import test from 'ember-sinon-qunit/test-support/test';` instead.");
  return test.apply(this, arguments);
}
