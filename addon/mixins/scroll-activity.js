import Ember from 'ember';
import injectService from 'ember-service/inject';
import on from 'ember-evented/on';

export default Ember.Mixin.create({
  scrollActivity: injectService(),

  scrolled() {}, // no-op function

  scrollSubscribe: on('didInsertElement', function () {
    this.get('scrollActivity').subscribe(this.$(), this.scrolled.bind(this));
  })
});
