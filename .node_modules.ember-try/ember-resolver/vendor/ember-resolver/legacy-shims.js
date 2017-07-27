/* globals define */

function createDeprecatedModule(moduleId) {
  define(moduleId, ['exports', 'ember-resolver/resolver', 'ember'], function(exports, Resolver, Ember) {
    Ember['default'].deprecate(
      'Usage of `' + moduleId + '` module is deprecated, please update to `ember-resolver`.',
      false,
      { id: 'ember-resolver.legacy-shims', until: '3.0.0' }
    );

    exports['default'] = Resolver['default'];
  });
}

createDeprecatedModule('ember/resolver');
createDeprecatedModule('resolver');
