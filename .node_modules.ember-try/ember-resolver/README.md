# Ember Resolver [![Build Status](https://travis-ci.org/ember-cli/ember-resolver.svg?branch=master)](https://travis-ci.org/ember-cli/ember-resolver)


This project provides the Ember resolver used by the following projects:

* [ember-cli](https://github.com/ember-cli/ember-cli)
* [ember-app-kit](https://github.com/stefanpenner/ember-app-kit)
* [ember-appkit-rails](https://github.com/DavyJonesLocker/ember-appkit-rails)

## Installation

`ember-resolver` is an ember-cli addon, and should be installed with `ember install`:

```
ember install ember-resolver
```

## Feature flags

This resolver package supports feature flags for experimental changes. Feature
flag settings change how `ember-resolver` compiles into an ember-cli's
`vendor.js`, so you should think of them as an application build-time option.

Feature flags are set in an application's `config/environment.js`:

```js
/* eslint-env node */

module.exports = function(environment) {
  var ENV = {
    'ember-resolver': {
      features: {
        EMBER_RESOLVER_MODULE_UNIFICATION: true
      }
    },
    /* ... */
```

Note that you must restart your ember-cli server for changes to the `flags` to
register.

In the `ember-resolver` codebase, you can import these flags:

```js
import { EMBER_RESOLVER_MODULE_UNIFICATION } from 'ember-resolver/features';
```

### Current feature flags

#### `EMBER_RESOLVER_MODULE_UNIFICATION`

Ember [RFC #154](https://github.com/emberjs/rfcs/blob/master/text/0143-module-unification.md)
describes an improved resolution strategy and filename-on-disk
layout for Ember applications. To experiment with this feature
it must be enabled as described above, then use the `src/`
directory on disk. You can generate a new app that uses
this layout by using the following commands:

```
# Install Ember-CLI canary globally:
npm install -g ember-cli/ember-cli
# Create a new app with the module unification blueprint
ember new my-app -b ember-module-unification-blueprint
```

This will create an app running a module unification layout from
the
[ember-module-unification-blueprint](https://github.com/emberjs/ember-module-unification-blueprint)
package. By default, this app will be correctly configured.

  * It uses the `glimmer-wrapper` resolver.
  * It builds an glimmer resolver config and passes it to the resolver.
  * It starts with a `src/` based layout on disk.

## Upgrading

`ember-resolver` is normally bumped with ember-cli releases. To install a newer
version use `yarn` or `npm`. For example:

```
yarn upgrade ember-resolver
```

### Migrating from bower

Before v1.0.1 `ember-resolver` was primarially consumed bia bower. To migrate
install the addon version via `yarn` or `npm`. If you're currently using
`ember-resolver` v0.1.x in your project, you should uninstall it:

```
bower uninstall ember-resolver --save
```

_You can continue to use ember-resolver v0.1.x as a bower package, but be
careful not to update it to versions greater than v1.0._

## Addon Development

### Installation

* `git clone` this repository
* `npm install`
* `bower install`

### Running

* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Troubleshooting

As mentioned above, `ember-resolver` is no longer a bower package.  If you're seeing a message like this:

```
Unable to find a suitable version for ember-resolver, please choose one:
    1) ember-resolver#~0.1.20 which resolved to 0.1.21 and is required by ember-resolver#2.0.3
    2) ember-resolver#~2.0.3 which resolved to 2.0.3 and is required by [APP_NAME]
```

... you probably need to update your application accordingly.  See [aptible/dashboard.aptible.com#423](https://github.com/aptible/dashboard.aptible.com/pull/423/files) as an example of how to update.
