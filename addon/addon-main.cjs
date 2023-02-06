'use strict';

/**
 * ember-cli does not support ESM...
 * https://github.com/ember-cli/ember-cli/issues/9682
 *
 * Because of this,
 *  - this file is renamed to *.cjs
 *  - config in package.json must also be renamed to *.cjs
 *    - about 3 places
 */

// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

// import { addonV1Shim } from  '@embroider/addon-shim';

// const __dirname = dirname(fileURLToPath(import.meta.url));
// export default addonV1Shim(__dirname);

const { addonV1Shim } = require('@embroider/addon-shim');

module.exports = addonV1Shim(__dirname);
