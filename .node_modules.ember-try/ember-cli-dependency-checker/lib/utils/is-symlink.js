var fs = require('fs');

module.exports = function isSymlink(path) {
  if (fs.existsSync(path)) {
    var stats = fs.lstatSync(path);
    return stats.isSymbolicLink();
  } else {
    return false;
  }
};
