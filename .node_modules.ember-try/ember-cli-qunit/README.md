## ember-cli-qunit

This addon that adds `QUnit` to the generated Ember CLI test output (in `test-support.js`).

### Installation / Usage

From within your Ember CLI application run the following:

```bash
ember install ember-cli-qunit
```

### Upgrading

To upgrade from `ember-cli-qunit@3` to `ember-cli-qunit@4` perform the following:

* `yarn upgrade ember-cli-qunit@^4` or `npm install --save-dev ember-cli-qunit@^4`
* Add the following snippet to your `tests/test-helper.js` file:

```js
import { start } from 'ember-cli-qunit';

start();
```

### References

* [qunit](https://github.com/jquery/qunit)
