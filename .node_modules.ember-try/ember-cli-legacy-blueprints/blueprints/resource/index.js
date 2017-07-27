var Promise    = require('rsvp').Promise;
var merge      = require('ember-cli-lodash-subset').merge;
var inflection = require('inflection');

module.exports = {
  description: 'Generates a model and route.',

  install: function(options) {
    return this._process('install', options);
  },

  uninstall: function(options) {
    return this._process('uninstall', options);
  },

  _processBlueprint: function(type, name, options) {
    var mainBlueprint = this.lookupBlueprint(name);

    var that = this;
    return Promise.resolve()
      .then(function() {
        return mainBlueprint[type](options);
      })
      .then(function() {
        var testBlueprint = mainBlueprint.lookupBlueprint(name + '-test', {
          ui: this.ui,
          analytics: this.analytics,
          project: this.project,
          ignoreMissing: true
        });

        if (!testBlueprint) { return; }

        var Blueprint = that._findBlueprintBaseClass(testBlueprint);
        if (Blueprint && testBlueprint.locals === Blueprint.prototype.locals) {
          testBlueprint.locals = function(options) {
            return mainBlueprint.locals(options);
          };
        }

        return testBlueprint[type](options);
      });
  },

  _findBlueprintBaseClass: function(cls) {
    if (cls.constructor && cls.constructor.name === 'Blueprint') {
      return cls.constructor;
    }

    if (cls._super) {
      return this._findBlueprintBaseClass(cls._super);
    }

    return null;
  },

  _process: function(type, options) {
    this.ui = options.ui;
    this.project = options.project;
    var entityName = options.entity.name;

    var modelOptions = merge({}, options, {
      entity: {
        name: entityName ? inflection.singularize(entityName) : ''
      }
    });

    var routeOptions = merge({}, options);

    return this._processBlueprint(type, 'model', modelOptions)
              .then(function() {
                return this._processBlueprint(type, 'route', routeOptions);
              }.bind(this));
  }

};
