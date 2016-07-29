import RSVP from 'rsvp';
import { module } from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

const { Promise } = RSVP;

export default function (name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();

      if (options.beforeEach) {
        return options.beforeEach.call(this, ...arguments);
      }
    },

    afterEach() {
      let afterEach = options.afterEach && options.afterEach.call(this, ...arguments);
      return Promise.resolve(afterEach).then(() => destroyApp(this.application));
    }
  });
}
