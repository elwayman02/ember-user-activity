import RequireJSRegistry from 'ember-resolver/module-registries/requirejs';
import { module, test} from 'qunit';

export let config = {
  app: {
    name: 'example-app',
    rootName: 'example-app'
  },
  types: {
    component: { definitiveCollection: 'components' },
    partial: { definiteCollection: 'partials' },
    service: { definitiveCollection: 'services' },
    route: { definitiveCollection: 'routes' },
    router: { definitiveCollection: 'main' },
    template: {
      definitiveCollection: 'routes',
      fallbackCollectionPrefixes: {
        'components': 'components'
      }
    }
  },
  collections: {
    'main': {
      types: ['router']
    },
    components: {
      group: 'ui',
      types: ['component', 'helper', 'template']
    },
    partials: {
      group: 'ui',
      types: [ 'template' ]
    },
    routes: {
      group: 'ui',
      privateCollections: ['components'],
      types: ['route', 'controller', 'template']
    },
    services: {
      types: ['service']
    }
  }
};

module('RequireJS Registry', {
  beforeEach() {

    this.config = config;
    this.registry = new RequireJSRegistry(this.config, 'src');
  }
});

test('Normalize', function(assert) {
  assert.expect(10);

  [
    [ 'router:/my-app/main/main', 'my-app/src/router' ],
    [ 'route:/my-app/routes/application', 'my-app/src/ui/routes/application/route' ],
    [ 'template:/my-app/routes/application', 'my-app/src/ui/routes/application/template' ],
    [ 'component:/my-app/components/my-input', 'my-app/src/ui/components/my-input/component' ],
    [ 'template:/my-app/routes/components/my-input', 'my-app/src/ui/components/my-input/template' ],
    [ 'template:/my-app/components/my-input', 'my-app/src/ui/components/my-input/template' ],
    [ 'component:/my-app/components/my-input/my-button', 'my-app/src/ui/components/my-input/my-button/component' ],
    [ 'template:/my-app/components/my-input/my-button', 'my-app/src/ui/components/my-input/my-button/template' ],
    [ 'template:/my-app/routes/-author', 'my-app/src/ui/partials/author' ],
    [ 'service:/my-app/services/auth', 'my-app/src/services/auth/service' ]
  ]
  .forEach(([ lookupString, expected ]) => {
    assert.equal(this.registry.normalize(lookupString), expected, `normalize ${lookupString} -> ${expected}`);
  });
});
