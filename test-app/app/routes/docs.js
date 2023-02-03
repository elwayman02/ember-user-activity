import Route from '@ember/routing/route';

export default class DocsRoute extends Route {
  redirect() {
    window.location.replace(
      'https://github.com/elwayman02/ember-user-activity/blob/master/README.md'
    );
  }
}
