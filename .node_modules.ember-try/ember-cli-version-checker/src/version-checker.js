'use strict';

var path = require('path');

var BowerDependencyVersionChecker = require('./bower-dependency-version-checker');
var NPMDependencyVersionChecker = require('./npm-dependency-version-checker');
var EmberCLIDependencyVersionChecker = require('./ember-cli-dependency-version-checker');

function VersionChecker(addon) {
  this._addon = addon;
}

VersionChecker.prototype.for = function(name, type) {
  if (type === 'bower') {
    return new BowerDependencyVersionChecker(this, name);
  } else if (type === 'npm') {
    return new NPMDependencyVersionChecker(this, name);
  }
};

VersionChecker.prototype.forEmber = function() {
  var emberVersionChecker = this.for('ember-source', 'npm');

  if (emberVersionChecker.version) {
    return emberVersionChecker;
  }

  return this.for('ember', 'bower');
};

/**
 * Backwards compatibility class methods
 *
 * They compare the version of ember-cli only.
 */
VersionChecker.isAbove = function deprecatedIsAbove(addon, comparisonVersion) {
  var dependencyChecker = new EmberCLIDependencyVersionChecker(addon);

  return dependencyChecker.satisfies('>=' + comparisonVersion);
};

VersionChecker.satisfies = function deprecatedSatisfies(addon, comparison) {
  var dependencyChecker = new EmberCLIDependencyVersionChecker(addon);

  return dependencyChecker.satisfies(comparison);
};

VersionChecker.assertAbove = function deprecatedAssertAbove(addon, comparisonVersion, _message) {
  var dependencyChecker = new EmberCLIDependencyVersionChecker(addon);
  var comparison = '>= ' + comparisonVersion;
  var message = _message;

  if (!message) {
    message = 'The addon `' + addon.name + '` requires an Ember CLI version of ' + comparisonVersion +
      ' or above, but you are running ' + dependencyChecker.version + '.';
  }

  if (!dependencyChecker.satisfies(comparison)) {
    var error  = new Error(message);

    error.suppressStacktrace = true;
    throw error;
  }
};

module.exports = VersionChecker;
