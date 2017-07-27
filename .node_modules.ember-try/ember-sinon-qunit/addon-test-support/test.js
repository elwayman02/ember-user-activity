import Ember from 'ember';
import sinon from 'sinon';
import QUnit from 'qunit';
import { test as emberQUnitTest } from 'ember-qunit';
import { isBlank } from 'ember-utils';

sinon.expectation.fail = sinon.assert.fail = function (msg) {
  QUnit.assert.ok(false, msg);
};

sinon.assert.pass = function (assertion) {
  QUnit.assert.ok(true, assertion);
};

sinon.config = {
  injectIntoThis: false,
  injectInto: null,
  properties: ['spy', 'stub', 'mock', 'sandbox'],
  useFakeTimers: false,
  useFakeServer: false
};

let ALREADY_FAILED = {};

export default function test(testName, callback) {
  let sandbox;
  let wrapper = function () {
    let context = this;
    if (isBlank(context)) {
      context = {};
    }

    let config = sinon.getConfig(sinon.config);
    config.injectInto = context;
    sandbox = sinon.sandbox.create(config);

    // There are two ways to have an async test:
    // 1. return a thenable
    // 2. call `assert.async()`

    let result = callback.apply(context, arguments);
    let currentTest = QUnit.config.current;

    // Normalize into a promise, even if the test was originally
    // synchronous. And wait for a thenable `result` to finish first
    // (otherwise an asynchronously invoked `assert.async()` will be
    // ignored).
    let promise = Ember.RSVP.resolve(result).then(data => {
      // When `assert.async()` is called, the best way found to
      // detect completion (so far) is to poll the semaphore. :(
      // (Esp. for cases where the test timed out.)
      let poll = (resolve, reject) => {
        // Afford for the fact that we are returning a promise, which
        // bumps the semaphore to at least 1. So when it drops to 1
        // then everything else is complete.
        // (0 means it already failed, e.g. by timing out. - handled below)
        if (currentTest.semaphore === 1) {
          clearTimeout(testTimeoutPollerId);
          testTimeoutDeferred.resolve();
          resolve(data);
        } else {
          setTimeout(poll, 10, resolve, reject);
        }
      };

      return new Ember.RSVP.Promise(poll);
    });


    // Watch for cases where either the `result` thenable
    // or `assert.async()` times out and ensure cleanup.
    let testTimeoutPollerId = 0;
    let testTimeoutPoll = () => {
      // 0 means it already failed, e.g. by timing out.
      if (!currentTest.semaphore) {
        testTimeoutDeferred.reject(ALREADY_FAILED);
      } else {
        testTimeoutPollerId = setTimeout(testTimeoutPoll, 10);
      }
    };
    let testTimeoutDeferred = Ember.RSVP.defer();
    // delay first check so that the returned promise can bump the semaphore
    setTimeout(testTimeoutPoll);


    return Ember.RSVP.all([promise, testTimeoutDeferred.promise]).then(([data]) => {
      sandbox.verifyAndRestore();
      return data;
    }, error => {
      sandbox.restore();
      if (error === ALREADY_FAILED) return;
      return Ember.RSVP.reject(error);
    });
  };

  try {
    return emberQUnitTest(testName, wrapper);
  } catch (exception) {
    sandbox.restore();
    throw exception;
  }
}
