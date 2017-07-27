#!/usr/bin/env node

var fs = require('fs');
var array = require('lodash/array');
var fetchVersions = require('../lib/fetch-ember-versions-from-github');

console.log('Updating list of versions');
fetchVersions({ logErrors: true })
  .then(function(versions) {

    var uniqVersions = array.uniq(versions);
    console.log('versions found: ', uniqVersions.length);

    fs.writeFileSync('lib/known-ember-versions.json', JSON.stringify(uniqVersions, null, 2), { encoding: 'utf-8'});
  });
