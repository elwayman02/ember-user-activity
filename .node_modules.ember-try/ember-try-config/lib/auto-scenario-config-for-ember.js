'use strict';
var semver = require('semver');
var RSVP = require('rsvp');
var getEmberVersions = require('./get-ember-versions');
var findSatisfyingVersions = require('./find-satisfying-versions');

module.exports = function generateConfig(options) {
  return generateScenariosFromSemver(options.versionCompatibility, options.availableVersions).then(function(scenarios) {
    return { scenarios:  [].concat(baseScenarios(), scenarios) };
  });
};

function generateScenariosFromSemver(semverStatements, availableVersions) {
  var statement = semverStatements.ember;
  var versionPromise;

  if (availableVersions) {
    versionPromise = RSVP.resolve(availableVersions);
  } else {
    versionPromise = getEmberVersions();
  }

  return versionPromise.then(function(possibleVersions) {
    var versions = findSatisfyingVersions(possibleVersions, statement);

    return versions.map(function(version) {
      var versionNum = semver.clean(version);
      return {
        name: 'ember-' + versionNum,
        bower: {
          dependencies: {
            ember: versionNum
          }
        }
      };
    });
  });
}

function baseScenarios() {
  return [
    {
      name: 'default',
      bower: {
        dependencies: {}
      }
    },
    {
      name: 'ember-beta',
      allowedToFail: true,
      bower: {
        dependencies: {
          ember: 'components/ember#beta'
        },
        resolutions: {
          ember: 'beta'
        }
      }
    },
    {
      name: 'ember-canary',
      allowedToFail: true,
      bower: {
        dependencies: {
          ember: 'components/ember#canary'
        },
        resolutions: {
          ember: 'canary'
        }
      }
    }
  ];
}
