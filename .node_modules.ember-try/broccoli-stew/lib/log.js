var walkSync   = require('walk-sync');
var Promise    = require('rsvp').Promise;
var chalk      = require('chalk');
var DIR_REGEX  = /\/$/;

/**
 * Logs out files in the passed tree.
 *
 * @example
 *
 * var tree = find('zoo/animals/*.js');
 *
 * tree = log(tree);
 * // [cat.js, dog.js]
 *
 * tree = log(tree, {output: 'tree'});
 * // /Users/chietala/workspace/broccoli-stew/tmp/funnel-dest_Q1EeTD.tmp
 * // ├── cat.js
 * // └── dog.js
 *
 * module.exports = tree;
 *
 * @param  {String|Object} tree    The input tree to debug
 * @param  {Object|String} [options]
 * @property {String} [options.output] Print to stdout as a tree
 * @property {String} [options.label] Will label the the tree in stdout
 */
module.exports = function log(tree, _options) {
  var options = parseOptions(arguments.length, _options);

  return {
    read: function(readTree) {
      return readTree(tree).then(function(dir) {
        var debugEnv = process.env.DEBUG;
        var label = options.label;
        var debugOnly = options.debugOnly;
        var tree = options.output === 'tree';
        var files = walkSync(dir);
        var debuggr = options.debugger || require('debug');
        var printTree = treeOutput(dir);
        var debug;

        if(typeof debugEnv === 'string') {
          debugEnv = debugEnv.replace(/\*/g, '.*?');
        }

        if (debugOnly) {
          if (new RegExp(debugEnv).test(label)) {
            debug = debuggr(label);
            if (tree) {
              debug(printTree.stdout);
            } else {
              debug(files);
            }
          }
        } else {

          if (label && tree) {
            console.log(label);
            console.log(printTree.stdout);
          } else if (tree && !label) {
            console.log(printTree.stdout);
          } else if (label && !tree) {
            console.log(label);
            console.log(files);
          } else {
            console.log(files);
          }
        }
        return dir;
      }).catch(function(err) {
        console.log(err);
        throw err;
      });
    },
    cleanup: function() {}
  };
};

function treeOutput(dir) {
  var end = '└── ',
      ls = '├── ',
      newLine = '\n',
      stdout = '';

  function tab(size) {
    var _tab = '   ';
    return new Array(size).join(_tab);
  }

  var files = walkSync(dir).map(function(path, i, arr) {
    var depth = path.split('/').length;
    if (DIR_REGEX.test(path)) {
      stdout += (newLine + tab(depth - 1) + end + path);
    } else {
      stdout += (newLine + tab(depth));
      if (DIR_REGEX.test(arr[i + 1]) || i === (arr.length - 1)) {
        stdout += (end + path);
      } else {
        stdout += (ls + path);
      }
    }
    return path;
  }).filter(function(path) { return !DIR_REGEX.test(path); });

  return {
    stdout: stdout,
    files: files
  };
}

function parseOptions(arity, options) {
  if (arity === 1) {
    return { };
  } if (typeof options === 'string') {
    return {
      label: options
    };
  } else if (options && typeof options === 'object') {
    return options;
  } else if (arity > 1) {
    throw new TypeError('log(tree, options), `options` is invalid, expected label or configuration, but got: ' + options);
  }
}
