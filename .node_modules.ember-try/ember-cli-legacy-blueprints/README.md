# ember-cli-legacy-blueprints

[![Build Status](https://travis-ci.org/ember-cli/ember-cli-legacy-blueprints.svg?branch=master)](https://travis-ci.org/ember-cli/ember-cli-legacy-blueprints)
[![Build status](https://ci.appveyor.com/api/projects/status/rhhwbxkypyjrbvda/branch/master?svg=true)](https://ci.appveyor.com/project/embercli/ember-cli-legacy-blueprints/branch/master)



This addon provides blueprint support for ember-cli ^2.0.0 projects that are importing Ember and Ember Data through bower.js. Projects that are using Ember and Ember Data as addons (imported from npm as dependencies through package.json) do not need this addon to provide blueprints, as the related blueprints are provided by the respective addons.

## Why?

To provide tighter coupling of the blueprints with their respective libraries, it makes sense in the long run for ember-cli import such blueprints through the addons for those libraries. This will ensure that blueprints will keep up to date with changes to their libraries.

With the release of ember-cli 2.0.0, all blueprints that were not specific to ember-cli have been extracted to their respective libraries (ember, ember-data, ember-cli-qunit, and ember-cli-mocha). This addon simply provides backwards compatibility for projects not using those addons.

## Supported blueprints

If the ember, ember-data, ember-cli-qunit, or ember-cli-mocha addons are installed in your project, they take precedent and will override the blueprints provided by this addon.

### Blueprints provided by Ember addon

* component
* component-addon
* component-test
* controller
* controller-test
* helper
* helper-addon
* helper-test
* initializer
* initializer-addon
* initializer-test
* instance-initializer
* instance-initializer-addon
* instance-initializer-test
* mixin
* mixin-test
* resource
* route
* route-addon
* route-test
* service
* service-test
* template
* util
* util-test
* view
* view-test

### Blueprints provided by Ember Data addon

* adapter
* adapter-test
* model
* model-test
* serializer
* serializer-test
* transform
* transform-test

### Blueprints provided by ember-cli-qunit or ember-cli-mocha

* acceptance-test
* test-helper

### Blueprints provided by ember-cli (not in this addon)

* addon
* addon-import
* app
* blueprint
* http-mock
* http-proxy
* in-repo-addon
* lib
* server

## Installation

From your project root, run: `ember install ember-cli-legacy-blueprints`

## Developing

* `git clone` this repository
* `npm install`
* `bower install`
* `npm link`

Because the nature of this project, it needs to be consumed by an ember-cli project to properly develop it.
* Add `"ember-cli-legacy-blueprints": "*"` to your consuming project's `package.json`
* From your project root run `npm link ember-cli-legacy-blueprints`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
