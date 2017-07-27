var path = require('path');

// Legacy Ember-CLI (before 0.2.4) does not have a `nodeModulesPath` property
module.exports = function readNodeModulesPath(project) {
  if (project.nodeModulesPath) {
    return project.nodeModulesPath;
  } else {
    return path.join(project.root, 'node_modules');
  }
};
