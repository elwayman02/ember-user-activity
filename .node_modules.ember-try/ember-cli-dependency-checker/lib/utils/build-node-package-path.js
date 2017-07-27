var path = require('path');
var readNodeModulesPath = require('./read-node-modules-path');

module.exports = function buildNodePackagePath(project, name) {
  return path.join(readNodeModulesPath(project), name);
};
