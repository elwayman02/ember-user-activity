'use strict';

var Reporter = require('./lib/reporter');
var DependencyChecker = require('./lib/dependency-checker');

module.exports = {
  name: 'ember-cli-dependency-checker',
  init: function() {
    this._super.init && this._super.init.apply(this, arguments);
    
    var reporter = new Reporter();
    var dependencyChecker = new DependencyChecker(this.project, reporter);
    dependencyChecker.checkDependencies();
  }
};
