'use strict';

var DependencyVersionChecker = require('./dependency-version-checker');

function getEmberCLIVersion(addon) {
  if (!addon.project || !addon.project.emberCLIVersion) {
    return null;
  }

  var version = addon.project.emberCLIVersion();

  // remove any meta-data, for dealing with `npm link`'ed ember-cli
  return version.split('-')[0];
}

function EmberCLIDependencyVersionChecker(addon) {
  // intentionally not calling _super here
  this._version = getEmberCLIVersion(addon);
  this._type = 'npm';
}

EmberCLIDependencyVersionChecker.prototype = Object.create(DependencyVersionChecker.prototype);

module.exports = EmberCLIDependencyVersionChecker;
