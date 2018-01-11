import Mixin from '@ember/object/mixin';
import injectService from 'ember-service/inject';
import { on } from '@ember/object/evented';
import { bind } from '@ember/runloop';

export default Mixin.create({
  scrollActivity: injectService(),
  scrollElement: null,

  didScroll() {}, // no-op function

  scrollSubscribe: on('didInsertElement', function () {
    let element = this.get('scrollElement') || this.get('element'); // Fallback to the component's DOM element
    this.get('scrollActivity').subscribe(this, element, bind(this, this.didScroll));
  }),

  scrollUnsubscribe: on('willDestroyElement', function () {
    this.get('scrollActivity').unsubscribe(this);
  })
});
