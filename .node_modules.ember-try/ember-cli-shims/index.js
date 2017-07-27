/* eslint-env node */
'use strict';

var SilentError = require('silent-error');

module.exports = {
  name: 'ember-cli-shims',

  included: function(app) {
    this._super.included.apply(this, arguments);

    var VersionChecker = require('ember-cli-version-checker');
    var checker = new VersionChecker(this);

    // specifically *not* trying to use `checker.forEmber` because
    // we actually want to see if this is from npm for specific versions
    var emberSourceDep = checker.for('ember-source', 'npm');
    var emberCLIDep = checker.for('ember-cli', 'npm');

    var emberSourceIncludesLegacyShims = emberSourceDep.gt('2.11.0-alpha.0') && emberSourceDep.lt('2.11.0-beta.5');
    var emberCLISupportsOverridingShims = emberCLIDep.gt('2.11.0-alpha.0');

    if (!emberCLISupportsOverridingShims) {
      throw new SilentError('To consume ember-cli-shims from npm you must be using ember-cli@2.11.0-beta.1 or greater.  Please update ember-cli to a newer version or remove ember-cli-shims from `package.json`.');
    }

    var projectBowerDeps = this.project.bowerDependencies();
    if (projectBowerDeps['ember-cli-shims']) {
      throw new SilentError('Using ember-cli-shims as both a bower dependency and an npm dependency is not supported. Please remove `ember-cli-shims` from `bower.json`.');
    }

    // ember-source@2.11.0-alpha and 2.11.0-beta series releases included
    // their own legacy shims system, so this import is not needed with
    // those ember-source versions
    if (!emberSourceIncludesLegacyShims && emberCLISupportsOverridingShims) {
      var assetPath = 'vendor/ember-cli-shims/app-shims.js';
      if (this.import) {
        this.import(assetPath);
      } else {
        app.import(assetPath);
      }
    }

  }
};
