/* jshint node:true */
var RSVP = require('rsvp');
var publisher = require('publish');

// Create promise friendly versions of the methods we want to use
var start = RSVP.denodeify(publisher.start);
var publish = RSVP.denodeify(publisher.publish);

module.exports = {
  manifest: ['package.json', 'bower.json'],

  // Publish the new release to NPM after a successful push
  // If run from travis, this will look for the NPM_USERNAME, NPM_PASSWORD and
  // NPM_EMAIL environment variables to publish the package as
  afterPush: function() {
    return start().then(function() {
      return publish({});
    });
  }
};
