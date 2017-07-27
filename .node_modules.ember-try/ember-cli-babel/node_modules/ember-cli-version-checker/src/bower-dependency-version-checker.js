'use strict';

const path = require('path');
const DependencyVersionChecker = require('./dependency-version-checker');

class BowerDependencyVersionChecker extends DependencyVersionChecker {
  constructor(parent, name) {
    super(parent, name);

    let addon = this._parent._addon;
    let project = addon.project;
    let bowerDependencyPath = path.join(project.root, project.bowerDirectory, this.name);

    this._jsonPath = path.join(bowerDependencyPath, '.bower.json');
    this._fallbackJsonPath = path.join(bowerDependencyPath, 'bower.json');
    this._type = 'bower';
  }
}

module.exports = BowerDependencyVersionChecker;
