import EventManagerService from 'ember-user-activity/services/-private/event-manager';

export default class FastBootAwareEventManagerService extends EventManagerService {
  get _isFastBoot() {
    return typeof FastBoot !== 'undefined';
  }
}
