export function initialize(/* application */) {
  self.fooInitializeWasCalled = true;
  // application.inject('route', 'foo', 'service:foo');
}

export default {
  name: 'foo',
  initialize
};
