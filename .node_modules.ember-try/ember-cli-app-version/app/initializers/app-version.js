import initializerFactory from 'ember-cli-app-version/initializer-factory';
import config from '../config/environment';

const {
  APP: {
    name,
    version
  }
} = config;

export default {
  name: 'App Version',
  initialize: initializerFactory(name, version)
};
