var defaults = require('./default-options');
var Fingerprint = require('./fingerprint');
var UseRev = require('broccoli-asset-rewrite');

function AssetRev(inputTree, options) {
  if (!(this instanceof AssetRev)) {
    return new AssetRev(inputTree, options);
  }

  options = options || {};

  this.assetMap = {};
  this.inputTree = inputTree;
  this.customHash = options.customHash;
  this.extensions = options.extensions || defaults.extensions;
  this.replaceExtensions = options.replaceExtensions || defaults.replaceExtensions;
  this.exclude = options.exclude || defaults.exclude;
  this.fingerprintAssetMap = options.fingerprintAssetMap || defaults.fingerprintAssetMap;
  this.generateAssetMap = options.generateAssetMap;
  this.generateRailsManifest = options.generateRailsManifest;
  this.assetMapPath = options.assetMapPath || defaults.assetMapPath;
  this.railsManifestPath = options.railsManifestPath || defaults.railsManifestPath;
  this.prepend = options.prepend || defaults.prepend;
  this.ignore = options.ignore;
  this.description = options.description;

  var fingerprintTree = Fingerprint(inputTree, this);

  return UseRev(fingerprintTree, this);
}

module.exports = AssetRev;
