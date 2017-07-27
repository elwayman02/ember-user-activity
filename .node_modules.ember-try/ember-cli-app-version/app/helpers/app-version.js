import Ember from 'ember';
import config from '../config/environment';
import { shaRegExp, versionRegExp } from 'ember-cli-app-version/utils/regexp';

const {
  APP: {
    version
  }
} = config;

export function appVersion(_, hash = {}) {
  if (hash.hideSha) {
    return version.match(versionRegExp)[0];
  }

  if (hash.hideVersion) {
    return version.match(shaRegExp)[0];
  }

  return version;
}

export default Ember.Helper.helper(appVersion);
