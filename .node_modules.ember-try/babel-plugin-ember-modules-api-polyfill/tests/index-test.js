'use strict';
/* globals QUnit */

const describe = QUnit.module;
const it = QUnit.test;
const babel = require('babel-core');
const Plugin = require('../src');
const mapping = require('ember-rfc176-data');

function transform(source, _plugins) {
  let plugins = _plugins || [
    [Plugin],
  ];
  let result = babel.transform(source, {
    plugins,
  });

  return result.code;
}

function matches(source, expected) {
  it(`${source}`, assert => {
    let actual = transform(source);

    assert.equal(actual, expected);
  });
}

// Ensure each of the config mappings is mapped correctly
Object.keys(mapping).forEach(global => {
  const imported = mapping[global];
  const importRoot = imported[0];

  let importName = imported[1];
  if (!importName) {
    importName = 'default';
  }
  const varName = importName === 'default' ? 'defaultModule' : importName;
  const localName = varName === 'defaultModule' ? varName : `{ ${varName} }`;

  describe(`ember-modules-api-polyfill-${importRoot}-with-${importName}`, () => {
    matches(
      `import ${localName} from '${importRoot}';`,
      `var ${varName} = Ember.${global};`
    );
  });
});

// Ensure mapping multiple imports makes multiple variables
describe(`ember-modules-api-polyfill-import-multiple`, () => {
  matches(
    `import { empty, notEmpty } from '@ember/object/computed';`,
    `var empty = Ember.computed.empty;
var notEmpty = Ember.computed.notEmpty;`
  );
});

// Ensure jQuery and RSVP imports work
describe(`ember-modules-api-polyfill-named-as-alias`, () => {
  matches(
    `import jQuery from 'jquery'; import RSVP from 'rsvp';`,
    `var jQuery = Ember.$;\nvar RSVP = Ember.RSVP;`
  );
});

// Ensure mapping a named aliased import
describe(`ember-modules-api-polyfill-named-as-alias`, () => {
  matches(
    `import { empty as isEmpty } from '@ember/object/computed';`,
    `var isEmpty = Ember.computed.empty;`
  );
});

// Ensure mapping a named and aliased import makes multiple named variables
describe(`ember-modules-api-polyfill-import-named-multiple`, () => {
  matches(
    `import { empty, notEmpty as foo } from '@ember/object/computed';`,
    `var empty = Ember.computed.empty;
var foo = Ember.computed.notEmpty;`
  );
});

// Ensure mapping the default as an alias works
describe(`ember-modules-api-polyfill-default-as-alias`, () => {
  matches(
    `import { default as foo } from '@ember/component';`,
    `var foo = Ember.Component;`
  );
});

// Ensure unknown exports are not removed
describe(`unknown imports from known module`, () => {
  it(`allows blacklisting import paths`, assert => {
    let input = `import { derp } from '@ember/object/computed';`;

    assert.throws(() => {
      transform(input, [
        [Plugin],
      ]);
    }, /@ember\/object\/computed does not have a derp import/);
  });
});

describe('options', () => {
  it(`allows blacklisting import paths`, assert => {
    let input = `import { assert } from '@ember/debug';`;
    let actual = transform(input, [
      [Plugin, { blacklist: ['@ember/debug'] }],
    ]);

    assert.equal(actual, input);
  });

  it(`allows blacklisting specific named imports`, assert => {
    let input = `import { assert, inspect } from '@ember/debug';`;
    let actual = transform(input, [
      [Plugin, { blacklist: { '@ember/debug': ['assert', 'warn', 'deprecate'] } }],
    ]);

    assert.equal(actual, `import { assert } from '@ember/debug';\nvar inspect = Ember.inspect;`);
  });

  it('does not error when a blacklist is not present', assert => {
    let input = `import { assert, inspect } from '@ember/debug';`;
    let actual = transform(input, [
      [Plugin, { blacklist: { } }],
    ]);

    assert.equal(actual, `var assert = Ember.assert;\nvar inspect = Ember.inspect;`);
  });
});
