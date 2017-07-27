'use strict';

module.exports = {
  initializeEmberENV: function(templateCompiler, EmberENV) {
    if (!templateCompiler || !EmberENV) { return; }

    var props;

    if (EmberENV.FEATURES) {
      props = Object.keys(EmberENV.FEATURES);

      props.forEach(function(prop) {
        templateCompiler._Ember.FEATURES[prop] = EmberENV.FEATURES[prop];
      });
    }

    if (EmberENV) {
      props = Object.keys(EmberENV);

      props.forEach(function(prop) {
        if (prop === 'FEATURES') { return; }

        templateCompiler._Ember.ENV[prop] = EmberENV[prop];
      });
    }
  },

  template: function(templateCompiler, string, options) {
    var precompiled = templateCompiler.precompile(string, options);
    return 'Ember.HTMLBars.template(' + precompiled + ')';
  }
};
