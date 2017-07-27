export function initialize(/* appInstance */) {
  self.barInitializeWasCalled = true;
  // appInstance.inject('route', 'foo', 'service:foo');
}

export default {
  name: 'bar',
  initialize
};
