/* jshint node:true, eqnull:true */

'use strict';

var path       = require('path');
var getGitInfo = require('git-repo-info');

module.exports = function version(shaLength, root) {
  var projectPath = root || process.cwd();
  var packageVersion  = require(path.join(projectPath, 'package.json')).version;
  var info = getGitInfo(projectPath);

  if (info.tag) {
    if (packageVersion && info.tag.indexOf(packageVersion) !== -1) {
      return packageVersion;
    } else {
      return info.tag;
    }
  }

  var sha = info.sha || '';
  var prefix;

  if (packageVersion != null) {
    prefix = packageVersion;
  } else if (info.branch) {
    prefix = info.branch;
  } else {
    prefix = 'DETACHED_HEAD';
  }

  return prefix + '+' + sha.slice(0, shaLength || 8);
};
