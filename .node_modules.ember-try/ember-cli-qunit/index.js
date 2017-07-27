'use strict';

const path = require('path');
const fs   = require('fs');
const resolve = require('resolve');

module.exports = {
  name: 'ember-cli-qunit',

  _getDependencyTrees: function() {
    if (this._dependencyTrees) {
      return this._dependencyTrees;
    }

    let emberQUnitPath = path.dirname(resolve.sync('ember-qunit'));
    let emberTestHelpersPath = path.dirname(resolve.sync('ember-test-helpers', { basedir: emberQUnitPath }));

    this._dependencyTrees = [
      this.treeGenerator(emberQUnitPath),
      this.treeGenerator(emberTestHelpersPath),
    ];

    return this._dependencyTrees;
  },

  init: function() {
    this._super.init && this._super.init.apply(this, arguments);

    const VersionChecker = require('ember-cli-version-checker');
    let checker = new VersionChecker(this);
    let dep = checker.for('ember-cli', 'npm');

    if (!dep.gt('2.2.0-beta.2')) {
      const SilentError = require('silent-error');
      throw new SilentError('ember-cli-qunit@3.0.0 and higher requires at least ember-cli@2.2.0. Please downgrade to ember-cli-qunit@2 for older ember-cli version support.');
    }

    this._shouldPreprocessAddonTestSupport = !!this.options && !!this.options.babel;

    this.setTestGenerator();
  },

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },

  // intentionally not calling _super here
  // to avoid these trees being namespaced into
  // `ember-cli-qunit/test-support/`
  treeForAddonTestSupport: function(onDiskAddonTestSupportTree) {
    const MergeTrees = require('broccoli-merge-trees');
    let trees = [].concat(
      this._getDependencyTrees(),
      onDiskAddonTestSupportTree
    );
    let tree = new MergeTrees(trees);

    if (this._shouldPreprocessAddonTestSupport) {
      return this.preprocessJs(tree, {
        registry: this.registry
      });
    } else {
      return tree;
    }
  },

  treeForVendor: function(tree) {
    const MergeTrees = require('broccoli-merge-trees');
    let qunitPath = path.join(path.dirname(resolve.sync('qunitjs')), '..');

    let trees = [
      tree,
      this._notificationsTree(),
      this.treeGenerator(qunitPath)
    ];

    return new MergeTrees(trees, {
      annotation: 'ember-cli-qunit: treeForVendor'
    });
  },

  included: function included(app, parentAddon) {
    let target = (parentAddon || app);
    this._super.included.call(this, target);

    this.targetOptions = target.options;

    let testSupportPath = target.options.outputPaths.testSupport.js;
    testSupportPath = testSupportPath.testSupport || testSupportPath;
    testSupportPath = path.dirname(testSupportPath) || 'assets';

    if (app.tests) {
      let fileAssets = [
        'vendor/qunit/qunit.js',
        'vendor/qunit/qunit.css',
        'vendor/qunit-notifications/index.js',
        'vendor/ember-cli-qunit/qunit-configuration.js',
      ];

      let addonOptions = target.options['ember-cli-qunit'];
      let hasAddonOptions = !!addonOptions;
      let explicitlyDisabledContainerStyles = hasAddonOptions && addonOptions.disableContainerStyles === true;
      if (!explicitlyDisabledContainerStyles) {
        fileAssets.push('vendor/ember-cli-qunit/test-container-styles.css');
      }

      fileAssets.forEach(function(file){
        app.import(file, {
          type: 'test'
        });
      });

      let imgAssets = [
        'vendor/ember-cli-qunit/images/passed.png',
        'vendor/ember-cli-qunit/images/failed.png'
      ];

      imgAssets.forEach(function(img) {
        app.import(img, {
          type: 'test',
          destDir: testSupportPath
        });
      });
    }
  },

  _notificationsTree: function() {
    const Funnel = require('broccoli-funnel');
    let notificationsPath = path.dirname(resolve.sync('qunit-notifications'));
    return new Funnel(notificationsPath, {
      include: [ 'index.js' ],
      destDir: 'qunit-notifications',
      annotation: 'qunit-notifications'
    });
  },

  contentFor: function(type) {
    // Skip if insertContentForTestBody === false.
    if (type === 'test-body' && !(this.targetOptions['ember-cli-qunit'] && this.targetOptions['ember-cli-qunit'].insertContentForTestBody === false)) {
      return this._readTemplate('test-body');
    }
  },

  _readTemplate: function(name) {
    return fs.readFileSync(path.join(__dirname, 'templates', name + '.html'));
  },

  setTestGenerator: function() {
    this.project.generateTestFile = function(moduleName, tests) {
      let output = "QUnit.module('" + moduleName + "');\n";

      tests.forEach(function(test) {
        output += "QUnit.test('" + test.name + "', function(assert) {\n";
        output += "  assert.expect(1);\n";
        output += "  assert.ok(" + test.passed + ", '" + test.errorMessage + "');\n";
        output += "});\n";
      });

      return output;
    };
  }
};
