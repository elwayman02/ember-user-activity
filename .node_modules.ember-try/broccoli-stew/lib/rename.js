var Funnel = require('broccoli-funnel');
var debug = require('debug')('broccoli-stew:rename');

/**
 * Renames files in a tree.
 *
 * @example
 * var rename = require('broccoli-stew').rename;
 * var uglify = require('broccoli-uglify-js');
 * var dist = 'lib';
 *
 * dist = rename(uglify(dist), '.js', '.min.js');
 * // or
 * dist = rename(uglify(dist), function(relativePath) {
 *   return relativePath.replace('.js', '.min.js');
 * });
 *
 *
 * module.exports = dist;
 *
 * @param  {String|Object} tree The input tree
 * @param  {String|Function} from This is either the starting replacement pattern or a custom replacement function.
 * @param  {String} [to]   Pattern to replace to
 * @return {Tree}      Tree containing the renamed files.
 */
module.exports = function rename(tree, from, to) {
  var replacer;

  if (arguments.length === 2 && typeof from === 'function') {
    replacer = from;
  } else {
    replacer = function defaultReplace(relativePath) {
      return relativePath.replace(from, to);
    };
  }

  debug('%s from: %s to: %s', tree, from, to);

  return new Funnel(tree, {
    getDestinationPath: replacer
  });
};
