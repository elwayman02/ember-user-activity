import { registerDeprecationHandler } from '@ember/debug';
import config from './config/environment';

const SHOULD_THROW = config.environment !== 'production';
const SILENCED_DEPRECATIONS = [
  'ember.built-in-components.import',
  'ember-keyboard.first-responder-inputs',
  'ember.built-in-components.reopen',
];

registerDeprecationHandler((message, options, next) => {
  if (SILENCED_DEPRECATIONS.includes(options.id)) {
    return;
  } else if (SHOULD_THROW) {
    throw new Error(message);
  }

  next(message, options);
});
