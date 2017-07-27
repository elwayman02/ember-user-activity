/* jshint node: true */
'use strict';

var VersionChecker = require('ember-cli-version-checker');
var path = require('path');

module.exports = {
  name: 'ember-resolver',

  emberResolverFeatureFlags() {
    var config = this.project.config();
    var resolverConfig = config['ember-resolver'] || {};

    return Object.assign({
      /* Add default feature flags here */
      EMBER_RESOLVER_MODULE_UNIFICATION: false
    }, resolverConfig.features);
  },

  init: function() {
    this._super.init.apply(this, arguments);
    this.options = this.options || {};

    this._emberResolverFeatureFlags = this.emberResolverFeatureFlags();

    this.options.babel = {
      loose: true,
      plugins: [
        [require('babel-plugin-debug-macros').default, {
          debugTools: {
            source: '@ember/debug'
          },
          envFlags: {
            source: 'ember-resolver-env-flags',
            flags: { DEBUG: process.env.EMBER_ENV != 'production' }
          },
          features: {
            name: 'ember-resolver',
            source: 'ember-resolver/features',
            flags: this._emberResolverFeatureFlags
          }
        }]
      ]
    };
  },

  treeForAddon: function() {
    var MergeTrees = require('broccoli-merge-trees');
    let addonTrees = [].concat(
      this._super.treeForAddon.apply(this, arguments),
      this._emberResolverFeatureFlags.EMBER_RESOLVER_MODULE_UNIFICATION && this._moduleUnificationTrees()
    ).filter(Boolean);

    return new MergeTrees(addonTrees);
  },

  _moduleUnificationTrees() {
    var resolve = require('resolve');
    var Funnel = require('broccoli-funnel');

    let featureTreePath = path.join(this.root, 'mu-trees/addon');
    var featureTree = new Funnel(featureTreePath, {
      destDir: 'ember-resolver'
    });

    var glimmerResolverSrc = require.resolve('@glimmer/resolver/package');
    var glimmerResolverPath = path.dirname(glimmerResolverSrc);
    var glimmerResolverTree = new Funnel(glimmerResolverPath, {
      srcDir: 'dist/modules/es2017',
      destDir: '@glimmer/resolver'
    });

    var glimmerDISrc = resolve.sync('@glimmer/di', { basedir: glimmerResolverPath });
    var glimmerDITree = new Funnel(path.join(glimmerDISrc, '../../../..'), {
      srcDir: 'dist/modules/es2017',
      destDir: '@glimmer/di'
    });

    return [
      this.preprocessJs(featureTree, { registry: this.registry }),
      this.preprocessJs(glimmerResolverTree, { registry: this.registry }),
      this.preprocessJs(glimmerDITree, { registry: this.registry }),
    ];
  },

  included: function() {
    this._super.included.apply(this, arguments);

    var checker = new VersionChecker(this);
    var dep = checker.for('ember-cli', 'npm');

    if (dep.lt('2.0.0')) {
      this.monkeyPatchVendorFiles();
    }

    this.app.import('vendor/ember-resolver/legacy-shims.js');
  },

  monkeyPatchVendorFiles: function() {
    var filesToAppend = this.app.legacyFilesToAppend;
    var legacyResolverIndex = filesToAppend.indexOf(this.app.bowerDirectory + '/ember-resolver/dist/modules/ember-resolver.js');

    if (legacyResolverIndex > -1) {
      filesToAppend.splice(legacyResolverIndex, 1);
    }
  }
};
