import EventManagerService from '../-private/event-manager';

export default class FastBootAwareEventManagerService extends EventManagerService {
  get _isFastBoot() {
    return typeof FastBoot !== 'undefined';
  }
}
