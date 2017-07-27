'use strict';

const path = require('path');

const BowerDependencyVersionChecker = require('./bower-dependency-version-checker');
const NPMDependencyVersionChecker = require('./npm-dependency-version-checker');

class VersionChecker {
  constructor(addon) {
    this._addon = addon;
  }

  for(name, type) {
    if (type === 'bower') {
      return new BowerDependencyVersionChecker(this, name);
    } else {
      return new NPMDependencyVersionChecker(this, name);
    }
  }

  forEmber() {
    let emberVersionChecker = this.for('ember-source', 'npm');

    if (emberVersionChecker.version) {
      return emberVersionChecker;
    }

    return this.for('ember', 'bower');
  }
}

module.exports = VersionChecker;
