/**
 * Creates an index of values from two arrays to enable easy lookup.
 *
 * @private
 */
module.exports = function makeIndex(a, b) {
  var index = Object.create(null);

  ((a || []).concat(b ||[])).forEach(function(a) {
    index[a] = true;
  });

  return index;
};
