### Ember CLI Version Checker

[![npm version](https://badge.fury.io/js/ember-cli-version-checker.svg)](https://badge.fury.io/js/ember-cli-version-checker)
[![Build Status](https://travis-ci.org/ember-cli/ember-cli-version-checker.svg?branch=master)](https://travis-ci.org/ember-cli/ember-cli-version-checker)

Makes it easier to determine if a compatible version of a given NPM or Bower package is present.

### Usage

#### assertAbove

Throws an error with the given message if a minimum version isn't met.

```javascript
var VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: 'awesome-addon',
  init: function() {
    this._super && this._super.init.apply(this, arguments); 

    var checker = new VersionChecker(this);

    checker.for('ember-cli', 'npm').assertAbove('2.0.0');
  }
};
```

You can also provide a specific message as the third argument to `assertAbove` if you'd like to customize the output.

```javascript
var VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: 'awesome-addon',
  init: function() {
    var checker = new VersionChecker(this);

    checker.for('ember-cli', 'npm').assertAbove('2.0.0', 'To use awesome-addon you must have ember-cli 2.0.0');
  }
};
```

#### isAbove

Returns `true` if the packages version is above the specified comparison range.

```javascript
var VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: 'awesome-addon',
  init: function() {
    var checker = new VersionChecker(this);
    var dep = checker.for('ember-cli', 'npm');

    if (dep.isAbove('2.0.0')) {
      /* deal with 2.0.0 stuff */
    } else {
      /* provide backwards compat */
    };
  }
};
```

#### Real World Example

You want to provide two different sets of templates, based on the currently running Ember version.

```javascript
var path = require('path');
var VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: 'awesome-addon',
  treeForAddonTemplates: function(tree) {
    var checker = new VersionChecker(this);
    var dep = checker.for('ember', 'bower');

    var baseTemplatesPath = path.join(this.root, 'addon/templates');

    if (dep.satisfies('>= 1.13.0') {
      return this.treeGenerator(path.join(baseTemplatesPath, 'current'));
    } else {
      return this.treeGenerator(path.join(baseTemplatesPath, 'legacy'));
    }
  }
};
```

#### forEmber

Since ember introduced the `ember-source` from NPM, ember has two ways to be
shipped. One from bower `ember` and other from NPM `ember-source`. The
function `forEmber` will look for `ember-source` from NPM, if it doesn't
find it, it will look for `ember` in bower.

```javascript
var VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: 'awesome-addon',
  init: function() {
    var checker = new VersionChecker(this);
    var ember = checker.forEmber();

    if (ember.isAbove('2.10.0')) {
      /* deal with 2.10.0 stuff */
    };
  }
};
```
