'use strict';

var path       = require('path');
var fs         = require('fs');
var readFile   = fs.readFileSync;
var readDir    = fs.readdirSync;
var fileExists = fs.existsSync;
var Package    = require('./package');
var readNodeModulesPath = require('./utils/read-node-modules-path');
var buildNodePackagePath = require('./utils/build-node-package-path');
var buildBowerPackagePath = require('./utils/build-bower-package-path');

var alreadyChecked = false;

function isUnsatisfied(pkg) {
  return !!pkg.needsUpdate;
}

function isSymlinked(pkg) {
  return !!pkg.isSymlinked;
}

function isNotSymlinked(pkg) {
  return !pkg.isSymlinked;
}

function isDisabled(project) {
  return project && project.cli && project.cli.disableDependencyChecker;
}

function EmberCLIDependencyChecker(project, reporter) {
  this.project = project;
  this.reporter = reporter;
}

EmberCLIDependencyChecker.prototype.checkDependencies = function() {
  if (alreadyChecked || process.env.SKIP_DEPENDENCY_CHECKER || isDisabled(this.project)) {
    return;
  }

  var bowerDeps = this.readBowerDependencies();
  this.reporter.unsatisifedPackages('bower', bowerDeps.filter(isUnsatisfied));

  var npmDeps = this.readNPMDependencies();
  var filteredDeps = npmDeps.filter(isUnsatisfied);
  var unsatisfiedDeps = filteredDeps.filter(isNotSymlinked);
  var symlinkedDeps = filteredDeps.filter(isSymlinked);

  var yarnPath = path.join(this.project.root, 'yarn.lock');

  var packageManagerName = 'npm';
  if (fileExists(yarnPath)) {
    packageManagerName = 'yarn';
  }

  this.reporter.reportUnsatisfiedSymlinkedPackages(packageManagerName, symlinkedDeps);
  this.reporter.unsatisifedPackages(packageManagerName, unsatisfiedDeps);

  if (unsatisfiedDeps.length === 0) {
    var shrinkWrapDeps = this.readShrinkwrapDeps();
    this.reporter.unsatisifedPackages('npm-shrinkwrap', shrinkWrapDeps.filter(isUnsatisfied));
  }

  EmberCLIDependencyChecker.setAlreadyChecked(true);

  this.reporter.report();
};

EmberCLIDependencyChecker.prototype.readShrinkwrapDeps = function() {
  var filePath = path.join(this.project.root, 'npm-shrinkwrap.json');
  if (fileExists(filePath)) {
    var ShrinkWrapChecker = require('./shrinkwrap-checker');
    var shrinkWrapBody = readFile(filePath);
    var shrinkWrapJSON = {};
    try {
      shrinkWrapJSON = JSON.parse(shrinkWrapBody);
    } catch(e) {
      // JSON parse error
    }
    return ShrinkWrapChecker.checkDependencies(this.project.root, readNodeModulesPath(this.project), shrinkWrapJSON);
  } else {
    return [];
  }
};

EmberCLIDependencyChecker.prototype.lookupNodeModuleVersion = function(name) {
  var nodePackage = path.join(readNodeModulesPath(this.project), name, 'package.json');
  return this.lookupPackageVersion(nodePackage);
};

EmberCLIDependencyChecker.prototype.lookupBowerPackageVersion = function(name) {
  var packageDirectory = path.resolve(this.project.root, this.project.bowerDirectory, name);
  var version = null;
  if (fileExists(packageDirectory) && readDir(packageDirectory).length > 0) {
    var dotBowerFile = path.join(packageDirectory, '.bower.json');
    version = this.lookupPackageVersion(dotBowerFile);
    if (!version) {
      var bowerFile = path.join(packageDirectory, 'bower.json');
      version = this.lookupPackageVersion(bowerFile) || '*';
    }
  }
  return version;
};

EmberCLIDependencyChecker.prototype.lookupPackageVersion = function(path) {
  if (fileExists(path)) {
    var pkg = readFile(path);
    var version = null;
    try {
      version = JSON.parse(pkg).version || null;
    } catch(e) {
      // JSON parse error
    }
    return version;
  } else {
    return null;
  }
};

EmberCLIDependencyChecker.prototype.readBowerDependencies = function() {
  return this.readDependencies(this.project.bowerDependencies(), 'bower');
};

EmberCLIDependencyChecker.prototype.readNPMDependencies = function() {
  return this.readDependencies(this.project.dependencies(), 'npm');
};

EmberCLIDependencyChecker.prototype.readDependencies = function(dependencies, type) {
  return Object.keys(dependencies).map(function(name) {
    var versionSpecified = dependencies[name];
    var versionInstalled = (type === 'npm') ? this.lookupNodeModuleVersion(name) : this.lookupBowerPackageVersion(name);
    var path = (type === 'npm') ?  buildNodePackagePath(this.project, name) : buildBowerPackagePath(this.project, name);
    return new Package(name, versionSpecified, versionInstalled, path);
  }, this);
};

EmberCLIDependencyChecker.setAlreadyChecked = function(value) {
  alreadyChecked = value;
};

module.exports = EmberCLIDependencyChecker;
