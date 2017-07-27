/* jshint node: true */
'use strict';

const path = require('path');
const fs = require('fs');
const hashForDep = require('hash-for-dep');
const HTMLBarsInlinePrecompilePlugin = require('babel-plugin-htmlbars-inline-precompile');
const VersionChecker = require('ember-cli-version-checker');
const SilentError = require('silent-error');

module.exports = {
  name: 'ember-cli-htmlbars-inline-precompile',

  init() {
    this._super.init && this._super.init.apply(this, arguments);

    let checker = new VersionChecker(this);
    let hasIncorrectBabelVersion = checker.for('ember-cli-babel', 'npm').lt('6.0.0-alpha.1');

    if (hasIncorrectBabelVersion) {
      throw new SilentError(`ember-cli-htmlbars-inline-precompile@0.4 requires the host to use ember-cli-babel@6. To use ember-cli-babel@5 please downgrade ember-cli-htmlbars-inline-precompile to 0.3.`);
    }
  },

  setupPreprocessorRegistry(type, registry) {
    if (type === 'parent') {
      this.parentRegistry = registry;
    }
  },

  included() {
    this._super.included.apply(this, arguments);

    let emberCLIHtmlBars = this.project.findAddonByName('ember-cli-htmlbars');

    if(emberCLIHtmlBars && emberCLIHtmlBars.inlinePrecompilerRegistered) {
      return;
    }

    let checker = new VersionChecker(this);

    let emberCLIUsesSharedBabelPlugins = checker.for('ember-cli', 'npm').lt('2.13.0-alpha.1');
    let addonOptions = this._getAddonOptions();
    let isProjectDependency = this.parent === this.project;
    let babelPlugins;

    if (emberCLIUsesSharedBabelPlugins && isProjectDependency) {
      addonOptions.babel6 = addonOptions.babel6 || {};
      babelPlugins = addonOptions.babel6.plugins = addonOptions.babel6.plugins || [];
    } else {
      addonOptions.babel = addonOptions.babel || {};
      babelPlugins = addonOptions.babel.plugins = addonOptions.babel.plugins || [];
    }

    // borrowed from ember-cli-htmlbars http://git.io/vJDrW
    let projectConfig = this.projectConfig() || {};
    let EmberENV = projectConfig.EmberENV || {};
    let templateCompilerPath = this.templateCompilerPath();

    // ensure we get a fresh templateCompilerModuleInstance per ember-addon
    // instance NOTE: this is a quick hack, and will only work as long as
    // templateCompilerPath is a single file bundle
    //
    // (╯°□°）╯︵ ɹǝqɯǝ
    //
    // we will also fix this in ember for future releases
    delete require.cache[templateCompilerPath];

    global.EmberENV = EmberENV;

    let pluginInfo = this.astPlugins();
    let Compiler = require(templateCompilerPath);
    let templateCompilerFullPath = require.resolve(templateCompilerPath);
    let templateCompilerCacheKey = fs.readFileSync(templateCompilerFullPath, { encoding: 'utf-8' });

    pluginInfo.plugins.forEach(function(plugin) {
      Compiler.registerPlugin('ast', plugin);
    });

    let precompile = Compiler.precompile;

    precompile.baseDir = () => __dirname;
    precompile.cacheKey = () => [templateCompilerCacheKey].concat(pluginInfo.cacheKeys).join('|');

    delete require.cache[templateCompilerPath];
    delete global.Ember;
    delete global.EmberENV;

    // add the HTMLBarsInlinePrecompilePlugin to the list of plugins used by
    // the `ember-cli-babel` addon
    if (!this._registeredWithBabel) {
      babelPlugins.push([HTMLBarsInlinePrecompilePlugin, { precompile  }]);
      this._registeredWithBabel = true;
    }
  },

  _getAddonOptions() {
    return (this.parent && this.parent.options) || (this.app && this.app.options) || {};
  },

  // from ember-cli-htmlbars :(
  astPlugins() {
    let pluginWrappers = this.parentRegistry.load('htmlbars-ast-plugin');
    let plugins = [];
    let cacheKeys = [];

    for (let i = 0; i < pluginWrappers.length; i++) {
      let wrapper = pluginWrappers[i];

      plugins.push(wrapper.plugin);

      if (typeof wrapper.baseDir === 'function') {
        let pluginHashForDep = hashForDep(wrapper.baseDir());
        cacheKeys.push(pluginHashForDep);
      } else {
        // support for ember-cli < 2.2.0
        let log = this.ui.writeDeprecateLine || this.ui.writeLine;

        log.call(this.ui, 'ember-cli-htmlbars-inline-precompile is opting out of caching due to an AST plugin that does not provide a caching strategy: `' + wrapper.name + '`.');
        cacheKeys.push((new Date()).getTime() + '|' + Math.random());
      }
    }

    return {
      plugins: plugins,
      cacheKeys: cacheKeys
    };
  },

  // borrowed from ember-cli-htmlbars http://git.io/vJDrW
  projectConfig() {
    return this.project.config(process.env.EMBER_ENV);
  },

  // borrowed from ember-cli-htmlbars http://git.io/vJDrw
  templateCompilerPath() {
    let config = this.projectConfig();
    let templateCompilerPath = config['ember-cli-htmlbars'] && config['ember-cli-htmlbars'].templateCompilerPath;

    let ember = this.project.findAddonByName('ember-source');
    if (ember) {
      return ember.absolutePaths.templateCompiler;
    } else if (!templateCompilerPath) {
      templateCompilerPath = this.project.bowerDirectory + '/ember/ember-template-compiler';
    }

    return path.resolve(this.project.root, templateCompilerPath);
  }
};
