/**
 * Returns a new tree that causes a callback to be called after every build of
 * the passed inputTree
 *
 * @example
 *
 * var tree = find('zoo/animals/*.js');
 *
 * tree = stew.afterBuild(tree, function(outputDir) {
 *   // Whatever debugging you'd like to do. Maybe mess with outputDir or maybe
 *   // debug other state your Brocfile contains.
 * });
 *
 *
 * @param  {String|Object} tree    The desired input tree
 * @param  {Function} callback     The function to call after every time the tree is built
 */
module.exports = function afterBuild(tree, cb) {
  if (typeof cb !== 'function') {
    throw new Error('No callback passed to stew.afterBuild');
  }

  return {
    read: function(readTree) {
      return readTree(tree).then(function(dir) {
        cb(dir);
        return dir;
      }).catch(function(err) {
        console.log(err);
        throw err;
      });
    },

    cleanup: function() {}
  };
};
