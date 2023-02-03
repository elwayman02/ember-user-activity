/* eslint-env node */
/* eslint-disable no-undef */

self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember.built-in-components.import' },
    { handler: 'silence', matchId: 'ember-keyboard.first-responder-inputs' },
    { handler: 'silence', matchId: 'ember.built-in-components.reopen' },
  ],
};
