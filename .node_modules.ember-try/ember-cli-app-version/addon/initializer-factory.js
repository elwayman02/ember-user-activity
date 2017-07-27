import Ember from 'ember';

const { 
  String: { classify },
  libraries
} = Ember;

export default function initializerFactory(name, version) {
  let registered = false;

  return function() {
    if (!registered && name && version) {
      var appName = classify(name);
      libraries.register(appName, version);
      registered = true;
    }
  };
}
