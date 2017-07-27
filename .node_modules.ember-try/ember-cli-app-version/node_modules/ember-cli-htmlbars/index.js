'use strict';

var fs = require('fs');
var utils = require('./utils');
var Filter = require('broccoli-persistent-filter');
var crypto = require('crypto');
var stringify = require('json-stable-stringify');
var stripBom = require('strip-bom');

function TemplateCompiler (inputTree, _options) {
  if (!(this instanceof TemplateCompiler)) {
    return new TemplateCompiler(inputTree, _options);
  }

  var options = _options || {};
  if (!options.hasOwnProperty('persist')) {
    options.persist = true;
  }

  Filter.call(this, inputTree, options); // this._super()

  this.options = options || {};
  this.inputTree = inputTree;

  this.precompile = this.options.templateCompiler.precompile;
  this.registerPlugin = this.options.templateCompiler.registerPlugin;

  this.registerPlugins();
  this.initializeFeatures();
}

TemplateCompiler.prototype = Object.create(Filter.prototype);
TemplateCompiler.prototype.constructor = TemplateCompiler;
TemplateCompiler.prototype.extensions = ['hbs', 'handlebars'];
TemplateCompiler.prototype.targetExtension = 'js';

TemplateCompiler.prototype.baseDir = function() {
  return __dirname;
};

TemplateCompiler.prototype.registerPlugins = function registerPlugins() {
  var plugins = this.options.plugins;

  if (plugins) {
    for (var type in plugins) {
      for (var i = 0, l = plugins[type].length; i < l; i++) {
        this.registerPlugin(type, plugins[type][i]);
      }
    }
  }
};

TemplateCompiler.prototype.initializeFeatures = function initializeFeatures() {
  var EmberENV = this.options.EmberENV;
  var FEATURES = this.options.FEATURES;
  var templateCompiler = this.options.templateCompiler;

  if (FEATURES) {
    console.warn('Using `options.FEATURES` with ember-cli-htmlbars is deprecated.  Please provide the full EmberENV as options.EmberENV instead.');
    EmberENV = EmberENV || {};
    EmberENV.FEATURES = FEATURES;
  }

  utils.initializeEmberENV(templateCompiler, EmberENV);
};

TemplateCompiler.prototype.processString = function (string, relativePath) {
  return 'export default ' + utils.template(this.options.templateCompiler, stripBom(string), {
    contents: string,
    moduleName: relativePath
  }) + ';';
};

TemplateCompiler.prototype._buildOptionsForHash = function() {
  var strippedOptions = {};

  for (var key in this.options) {
    if (key !== 'templateCompiler') {
      strippedOptions[key] = this.options[key];
    }
  }

  return strippedOptions;
};

TemplateCompiler.prototype._templateCompilerContents = function() {
  if (this.options.templateCompilerPath) {
    return fs.readFileSync(this.options.templateCompilerPath, { encoding: 'utf8' });
  } else {
    return '';
  }
};

TemplateCompiler.prototype.optionsHash  = function() {
  if (!this._optionsHash) {
    this._optionsHash = crypto.createHash('md5')
      .update(stringify(this._buildOptionsForHash()), 'utf8')
      .update(stringify(this._templateCompilerContents()), 'utf8')
      .digest('hex');
  }

  return this._optionsHash;
};

TemplateCompiler.prototype.cacheKeyProcessString = function(string, relativePath) {
  return this.optionsHash() + Filter.prototype.cacheKeyProcessString.call(this, string, relativePath);
};

module.exports = TemplateCompiler;
