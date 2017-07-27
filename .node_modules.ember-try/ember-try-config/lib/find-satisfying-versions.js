'use strict';

var semver = require('semver');

module.exports = function findSatisfyingVersions(possibleVersions, statement) {
  var versions = possibleVersions.filter(function(versionNumber) {
    var result = false;
    try {
      result = semver.satisfies(versionNumber, statement);
    } catch (e) {
      // Swallow any invalid versions
    }

    return result;
  });

  return findHighestPointVersionForEachMinorVersion(versions);
};

function findHighestPointVersionForEachMinorVersion(versions) {
  var highestPointVersions = { };
  versions.forEach(function(versionString) {
    var majorMinor = majorMinorVersion(versionString);
    var patch = patchVersion(versionString);

    if (!highestPointVersions[majorMinor] || highestPointVersions[majorMinor] < patch) {
      highestPointVersions[majorMinor] = patch;
    }
  });

  return versions.filter(function(versionString) {
    var majorMinor = majorMinorVersion(versionString);
    var patch = patchVersion(versionString);
    return patch === highestPointVersions[majorMinor];
  });
}

function majorMinorVersion(versionString) {
  return semver.major(versionString) + '.' + semver.minor(versionString);
}

function patchVersion(versionString) {
  return semver.patch(versionString);
}
