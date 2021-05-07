import BaseUserIdleService from 'ember-user-activity/services/user-idle';

export default class UserIdleService extends BaseUserIdleService {
  IDLE_TIMEOUT = 10000;
}
