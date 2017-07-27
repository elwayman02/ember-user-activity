broccoli-brocfile-loader
==============================================================================

The algorithm to find and load the `Brocfile.js` build specification file.


Installation
------------------------------------------------------------------------------

```bash
npm install broccoli-brocfile-loader
```


Usage
------------------------------------------------------------------------------

```js
var loadBrocfile = require('broccoli-brocfile-loader');

var tree = loadBrocfile();
```

Running this code will:

1. Find a file named `Brocfile.js` in the current folder or any of the parent
   folders. The search is case-independent and will throw an error if no
   matching file could be found.
   
2. `chdir()` into the folder containing the `Brocfile.js`.

3. Load the `Brocfile.js` code via `require()`.


License
------------------------------------------------------------------------------

Broccoli was originally written by [Jo Liss](http://www.solitr.com/) and is
licensed under the [MIT license](LICENSE).
