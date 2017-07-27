/* eslint-env node */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-sinon',

  included: function (app) {
    this._super.included.apply(this, arguments);

    var importContext;
    if (this.import) {
      // support for ember-cli >= 2.7
      importContext = this;
    } else {
      // addon support for ember-cli < 2.7
      importContext = this._findHostForLegacyEmberCLI();
    }

    importContext.import('vendor/sinon/sinon.js', { type: 'test' });
    importContext.import('vendor/shims/sinon.js', { type: 'test' });
  },

  treeForVendor: function (tree) {
    var sinonPath = path.dirname(require.resolve('sinon/pkg/sinon'));
    var sinonTree = new Funnel(sinonPath, {
      files: ['sinon.js'],
      destDir: '/sinon',
    });

    var trees = [tree, sinonTree];

    return new MergeTrees(trees, {
      annotation: 'ember-sinon: treeForVendor'
    });
  },

  // included from https://git.io/v6F7n
  // not needed for ember-cli > 2.7
  _findHostForLegacyEmberCLI: function() {
    var current = this;
    var app;

    // Keep iterating upward until we don't have a grandparent.
    // Has to do this grandparent check because at some point we hit the project.
    do {
      app = current.app || app;
    } while (current.parent.parent && (current = current.parent));

    return app;
  }
};
