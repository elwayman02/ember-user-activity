loader.js [![Build Status](https://travis-ci.org/ember-cli/loader.js.png?branch=master)](https://travis-ci.org/ember-cli/loader.js)
=========

Minimal AMD loader mostly stolen from [@wycats](https://github.com/wycats).

## No Conflict

To prevent the loader from overriding `require`, `define`, or `requirejs` you can instruct the loader
to use no conflict mode by providing it an alternative name for the various globals that are normally used.

Example:

```js
loader.noConflict({
  define: 'newDefine',
  require: 'newRequire'
});
```

Note: To be able to take advantage of alternate `define` method name, you will also need to ensure that your
build tooling generates using the alternate.  An example of this is done in the [emberjs-build](https://github.com/emberjs/emberjs-build)
project in the [babel-enifed-module-formatter plugin](https://github.com/emberjs/emberjs-build/blob/v0.4.2/lib/utils/babel-enifed-module-formatter.js).

## wrapModules

It is possible to hook loader to augment or transform the loaded code.  `wrapModules` is an optional method on the loader that is called as each module is originally loaded.  `wrapModules` must be a function of the form `wrapModules(name, callback)`. The `callback` is the original AMD callback.  The return value of `wrapModules` is then used in subsequent requests for `name`

This functionality is useful for instrumenting code, for instance in code coverage libraries.

```js
loader.wrapModules = function(name, callback) {
            if (shouldTransform(name) {
                    return myTransformer(name, callback);
                }
            }
            return callback;
    };
```

## Tests

We use [testem](https://github.com/airportyh/testem) for running our test suite.

You may run them with:
```sh
npm test
```

You can also launch testem development mode with:
```sh
npm run test:dev
```

## License

loader.js is [MIT Licensed](https://github.com/ember-cli/loader.js/blob/master/LICENSE.md).
