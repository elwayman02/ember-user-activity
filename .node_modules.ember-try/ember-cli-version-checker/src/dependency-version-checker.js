'use strict';

var fs = require('fs');
var semver = require('semver');

function getVersionFromJSONFile(filePath) {
  if (fs.existsSync(filePath)) {
    var content = fs.readFileSync(filePath);

    try {
      return JSON.parse(content).version;
    } catch (exception) {
      return null;
    }
  }
}

/**
 * DependencyVersionChecker
 */
function DependencyVersionChecker(parent, name) {
  this._parent = parent;
  this.name = name;
}
Object.defineProperty(DependencyVersionChecker.prototype, 'version', {
  get: function() {

    if (this._version === undefined) {
      this._version = getVersionFromJSONFile(this._jsonPath);
    }

    if (this._version === undefined && this._fallbackJsonPath) {
      this._version = getVersionFromJSONFile(this._fallbackJsonPath);
    }

    return this._version;
  }
});

DependencyVersionChecker.prototype.isAbove = function isAbove(compareVersion) {
  if (!this.version) {
    return false;
  }
  return semver.gt(this.version, compareVersion);
};

var semverMethods = ['gt', 'lt', 'gte', 'lte', 'eq', 'neq', 'satisfies'];
semverMethods.forEach(function(method) {
  DependencyVersionChecker.prototype[method] = function(range) {
    if (!this.version) {
      return method === 'neq';
    }
    return semver[method](this.version, range);
  };
});

DependencyVersionChecker.prototype.assertAbove = function assertAbove(compareVersion, _message) {
  var message = _message;

  if (!message) {
    message = 'The addon `' + this._parent._addon.name + '` requires the ' + this._type + ' package ' +
      '`' + this.name + '` to be above ' + compareVersion + ', but you have ' + this.version + '.';
  }

  if (!this.isAbove(compareVersion)) {
    var error  = new Error(message);

    error.suppressStacktrace = true;

    throw error;
  }
};

DependencyVersionChecker.prototype._super$constructor = DependencyVersionChecker;

module.exports = DependencyVersionChecker;
