Ember CLI Shims
===============

[![Greenkeeper badge](https://badges.greenkeeper.io/ember-cli/ember-cli-shims.svg)](https://greenkeeper.io/)


NOTE: this repo is frozen until ember's public module interface has been finalized.

About
-----

Ember CLI Shims (ECS) contain all the shims used in Ember CLI.

Note: The `ember-data` shim has been removed as of v0.1.0. The latest 
[Ember-Data](https://github.com/emberjs/data) no longer has a bower dependency; 
`ember-cli-shims` >= v0.1.0 is only intended for use with Ember-Data v2.3.0 and up.

Usage
-----

Simply import any of the shims as an ES6 module:

```js
import Component from 'ember-component';
import run from 'ember-runloop';
import injectService from 'ember-service/inject';
```

Some of the shims have named exports (instead of/in addition to a `default` export):

```js
import { assert, copy } from 'ember-metal/utils';
import { debounce } from 'ember-runloop';
import { isEmpty } from 'ember-utils';
```

Shims
-----
The [app-shims](https://github.com/ember-cli/ember-cli-shims/blob/master/vendor/ember-cli-shims/app-shims.js) 
file provides a complete reference of all modules currently supported by this library. 

Why?
----

Historically, Ember has recommended that developers reference core classes 
& utilities (ie `Component`, `Route`, `isEmpty`) via the root `Ember` namespace. 
This leads to the entire `Ember` module being imported into nearly every file:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  foo: Ember.inject.service(),
  bar: Ember.computed.readOnly('foo.bar')
});
```

It would be preferable to have different parts of Ember available as separate modules, 
allowing developers to only import what they need. This is the direction the framework 
is moving in, but the modules are not yet available. This has led to a common pattern of 
ES6 destructuring assignment to enable writing future-proof code:

```js
import Ember from 'ember';

const { Component, computed, inject } = Ember;

export default Component.extend({
  foo: inject.service(),
  bar: computed.readOnly('foo.bar');
});
```

However, this library provides shims to mimic the future modules that Ember may provide, 
enabling developers to avoid destructuring and instead import the namespaces as modules *today*.

```js
import Component from 'ember-component';
import computed from 'ember-computed';
import injectService from 'ember-service/inject';

export default Component.extend({
  foo: injectService(),
  bar: computed.readOnly('foo.bar');
});
```

That way, as true modules become available in the Ember ecosystem, we can merely remove 
the shims from `ECS` upstream, requiring little to no refactoring on the part of 
developers who have opted-in to this pattern early. Ultimately, the goal of this 
library is to be replaced completely once Ember itself is an npm package/addon and exports its own modules.

License
-------

Ember CLI Shims is [MIT Licensed](https://github.com/stefanpenner/ember-cli-shims/blob/master/LICENSE.md).
