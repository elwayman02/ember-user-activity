'use strict';

function Package() {
  this.init.apply(this, arguments);
}

Package.prototype = Object.create({});
Package.prototype.constructor = Package;

Package.prototype.init = function(name, versionSpecified, versionInstalled, path) {
  this.name = name;
  this.path = path;
  this.versionSpecified = versionSpecified;
  this.versionInstalled = versionInstalled;
  this.needsUpdate = this.updateRequired();
  this.isSymlinked = this.symlinked();
};

Package.prototype.updateRequired = function() {
  var VersionChecker = require('./version-checker');
  return !VersionChecker.satisfies(this.versionSpecified, this.versionInstalled);
};

Package.prototype.symlinked = function() {
  var isSymlink = require('./utils/is-symlink');
  return isSymlink(this.path);
};

module.exports = Package;
