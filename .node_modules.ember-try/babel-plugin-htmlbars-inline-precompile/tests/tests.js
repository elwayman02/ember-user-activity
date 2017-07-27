'use strict';

const assert = require('assert');
const path = require('path');

const babel = require('babel-core');
const HTMLBarsInlinePrecompile = require('../index');
const TransformTemplateLiterals = require('babel-plugin-transform-es2015-template-literals');
const TransformModules = require('babel-plugin-transform-es2015-modules-amd');

describe("htmlbars-inline-precompile", function() {
  let precompile, plugins;

  function transform(code) {
    return babel.transform(code, {
      plugins
    }).code.trim();
  }

  beforeEach(function() {
    precompile = (template) => template.toUpperCase();

    plugins = [
      [HTMLBarsInlinePrecompile, {
        precompile: function() {
          return precompile.apply(this, arguments);
        }
      }],
    ];
  });

  it("strips import statement for 'htmlbars-inline-precompile' module", function() {
    let transformed = transform("import hbs from 'htmlbars-inline-precompile';\nimport Ember from 'ember';");

    assert.equal(transformed, "import Ember from 'ember';", "strips import statement");
  });

  it("throws error when import statement is not using default specifier", function() {
    try {
      transform("import { hbs } from 'htmlbars-inline-precompile'");

      assert.fail("error should have been thrown");
    } catch (e) {
      assert.ok(e.message.match(/Only `import hbs from 'htmlbars-inline-precompile'` is supported/), "needed import syntax is present");
      assert.ok(e.message.match(/You used: `import { hbs } from 'htmlbars-inline-precompile'`/), "used import syntax is present");
    }
  });

  it("replaces tagged template expressions with precompiled version", function() {
    precompile = template => `precompiled(${template})`;

    let transformed = transform("import hbs from 'htmlbars-inline-precompile';\nvar compiled = hbs`hello`;");

    assert.equal(transformed, "var compiled = Ember.HTMLBars.template(precompiled(hello));", "tagged template is replaced");
  });

  it("does not cause an error when no import is found", function() {
    transform('something("whatever")');
    transform('something`whatever`');
  });

  it("works with multiple imports", function() {
    let transformed = transform(`
      import hbs from 'htmlbars-inline-precompile';
      import otherHbs from 'htmlbars-inline-precompile';
      let a = hbs\`hello\`;
      let b = otherHbs\`hello\`;
    `);

    let expected = `let a = Ember.HTMLBars.template(HELLO);\nlet b = Ember.HTMLBars.template(HELLO);`;

    assert.equal(transformed, expected, "tagged template is replaced");
  });

  it("works properly when used along with modules transform", function() {
    plugins.push([TransformModules]);
    let transformed = transform("import hbs from 'htmlbars-inline-precompile';\nvar compiled = hbs`hello`;");

    assert.equal(transformed, `define([], function () {\n  'use strict';\n\n  var compiled = Ember.HTMLBars.template(HELLO);\n});`, "tagged template is replaced");
  });

  it("works properly when used after modules transform", function() {
    plugins.unshift([TransformModules]);
    let transformed = transform("import hbs from 'htmlbars-inline-precompile';\nvar compiled = hbs`hello`;");

    assert.equal(transformed, `define([], function () {\n  'use strict';\n\n  var compiled = Ember.HTMLBars.template(HELLO);\n});`, "tagged template is replaced");
  });

  it("replaces tagged template expressions when before babel-plugin-transform-es2015-template-literals", function() {
    plugins.push([TransformTemplateLiterals]);
    let transformed = transform("import hbs from 'htmlbars-inline-precompile';\nvar compiled = hbs`hello`;");

    assert.equal(transformed, "var compiled = Ember.HTMLBars.template(HELLO);", "tagged template is replaced");
  });

  it("doesn't replace unrelated tagged template strings", function() {
    precompile = template => `precompiled(${template})`;

    let transformed = transform('import hbs from "htmlbars-inline-precompile";\nvar compiled = anotherTag`hello`;');

    assert.equal(transformed, "var compiled = anotherTag`hello`;", "other tagged template strings are not touched");
  });

  it("warns when the tagged template string contains placeholders", function() {
    assert.throws(function() {
      transform("import hbs from 'htmlbars-inline-precompile';\nvar compiled = hbs`string ${value}`");
    }, /placeholders inside a tagged template string are not supported/);
  });

  describe('caching', function() {
    it('include `baseDir` function for caching', function() {
      assert.equal(HTMLBarsInlinePrecompile.baseDir(), path.resolve(__dirname, '..'));
    });
  });

  describe('single string argument', function() {
    it("works with a plain string as parameter hbs('string')", function() {
      precompile = template => `precompiled(${template})`;

      let transformed = transform("import hbs from 'htmlbars-inline-precompile';\nvar compiled = hbs('hello');");

      assert.equal(transformed, "var compiled = Ember.HTMLBars.template(precompiled(hello));", "tagged template is replaced");
    });

    it("warns when more than one argument is passed", function() {
      assert.throws(function() {
        transform("import hbs from 'htmlbars-inline-precompile';\nvar compiled = hbs('first', 'second');");
      }, /hbs should be invoked with a single argument: the template string/);
    });

    it("warns when argument is not a string", function() {
      assert.throws(function() {
        transform("import hbs from 'htmlbars-inline-precompile';\nvar compiled = hbs(123);");
      }, /hbs should be invoked with a single argument: the template string/);
    });

    it("warns when no argument is passed", function() {
      assert.throws(function() {
        transform("import hbs from 'htmlbars-inline-precompile';\nvar compiled = hbs();");
      }, /hbs should be invoked with a single argument: the template string/);
    });
  });
});
