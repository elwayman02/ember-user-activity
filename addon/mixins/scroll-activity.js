import Mixin from 'ember-metal/mixin';
import injectService from 'ember-service/inject';
import on from 'ember-evented/on';
import { bind } from 'ember-runloop';

export default Mixin.create({
  scrollActivity: injectService(),
  scrollElement: null,

  didScroll() {}, // no-op function

  scrollSubscribe: on('didInsertElement', function () {
    this.get('scrollActivity').subscribe(this, this.$(this.get('scrollElement')), bind(this, this.didScroll));
  }),

  scrollUnsubscribe: on('willDestroyElement', function () {
    this.get('scrollActivity').unsubscribe(this);
  })
});
