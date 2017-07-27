var throwOnRootAccess = true;
var ensurePosix = require('ensure-posix-path');

function resolveModules(options) {
  options = options || {};

  if (options.throwOnRootAccess === false) {
    throwOnRootAccess = false;
  }

  return moduleResolve;
}

function moduleResolve(_child, _name) {
  var child = ensurePosix(_child);
  var name = ensurePosix(_name);
  if (child.charAt(0) !== '.') { return child; }

  var parts = child.split('/');
  var nameParts = name.split('/');
  var parentBase = nameParts.slice(0, -1);

  for (var i = 0, l = parts.length; i < l; i++) {
    var part = parts[i];

    if (part === '..') {
      if (parentBase.length === 0) {
        if (throwOnRootAccess) {
          throw new Error('Cannot access parent module of root');
        } else {
          continue;
        }
      }
      parentBase.pop();
    } else if (part === '.') {
      continue;
    } else { parentBase.push(part); }
  }

  return parentBase.join('/');
}

module.exports = {
  moduleResolve: moduleResolve,
  resolveModules: resolveModules
};