import Route from '@ember/routing/route';

export default Route.extend({
  redirect() {
    window.location.replace('https://github.com/elwayman02/ember-user-activity/blob/master/README.md');
  }
});
