beforeBuild = require('./before-build')
afterBuild = require('./after-build')

/**
 * Returns a new tree that causes a callbacks to be called before and after
 *  every build of the passed inputTree
 *
 * @example
 *
 * var tree = find('zoo/animals/*.js');
 *
 * tree = stew.wrapBuild(
 *   tree,
 *   function() {
 *     // Whatever debugging you'd like to do before the build is run, maybe set
 *     // timer?
 *   },
 *   function(outputDir) {
 *     // Whatever debugging you'd like to do. Maybe mess with outputDir or maybe
 *     // debug other state your Brocfile contains.
 *   }
 * );
 *
 *
 * @param  {String|Object} tree    The desired input tree
 * @param  {Function} callback     The function to call before every time the tree is built
 * @param  {Function} callback     The function to call after every time the tree is built
 */
module.exports = function wrapBuild(tree, beforeCb, afterCb) {

  // Allow one of the callbacks to be undefined, but not both
  var hasBeforeCb = beforeCb && typeof beforeCb === 'function'
      hasAfterCb = afterCb && typeof afterCb === 'function';

  if (!hasBeforeCb || !hasAfterCb) {
    throw new Error('No callbacks passed to stew.wrapBuild');
  } else if (!hasBeforeCb) {
    beforeCb = function() {};
  } else if (!hasAfterCb) {
    afterCb = function() {};
  }

  return beforeBuild(afterBuild(tree, afterCb), beforeCb);
};
