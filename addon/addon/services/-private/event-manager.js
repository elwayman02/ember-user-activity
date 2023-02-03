import Service from '@ember/service';
import { addListener, removeListener, sendEvent } from '@ember/object/events';

export default class EventManagerService extends Service {
  // Partial Evented Implementation: https://github.com/emberjs/ember.js/blob/v3.16.1/packages/%40ember/-internals/runtime/lib/mixins/evented.js#L13
  // one() was omitted from this implementation due to the way the user-activity service would need a lot of special behavior added
  on(name, target, method) {
    addListener(this, name, target, method);
    return this;
  }

  off(name, target, method) {
    removeListener(this, name, target, method);
    return this;
  }

  trigger(name, ...args) {
    sendEvent(this, name, args);
  }
}
