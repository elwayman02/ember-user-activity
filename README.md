# Ember User Activity

[![Build Status](https://travis-ci.org/elwayman02/ember-user-activity.svg?branch=master)](https://travis-ci.org/elwayman02/ember-user-activity)
[![Code Climate](https://codeclimate.com/github/elwayman02/ember-user-activity/badges/gpa.svg)](https://codeclimate.com/github/elwayman02/ember-user-activity)

This addon provides services for detecting user activity & idling across the entire application.

Check out the [Demo](http://github.jhawk.co/ember-user-activity/)!

## Installation

`ember install ember-user-activity`

## Usage

Two services are included:

### User Activity Service

This service fires events from global window listeners. 
These listeners trigger on capture, meaning they are not affected by event cancellation. 

Four `window` events are enabled by default:

* `keydown` - Fires when a key is pressed
* `mousedown` - Fires when a mouse is clicked
* `mousemove` - Fires when the user moves the mouse
* `scroll` - Fires when the user scrolls

A fifth custom event, `userActive` is fired for ALL events.

To catch these events, simply inject the service and subscribe to the events you care about:

```javascript
// any file where services can be injected
userActivity: Ember.inject.service(),
setupListeners() {
  this.get('userActivity').on('userActive', this, this.activeHandler);
},
activeHandler(event) {
  // do stuff
}
```

Each event handler will receive the standard DOM `event` object 
(ex: [mousemove](https://developer.mozilla.org/en-US/docs/Web/Events/mousemove)).

If you would like to listen to a different set of events, extend the service in your app:

```javascript
// app/services/user-activity.js
import UserActivityService from 'ember-user-activity/services/user-activity';

export default UserActivityService.extend({
  defaultEvents: ['keypress', 'mouseenter']
});
```

Additionally, you can enable/disable events after the service has been initialized.

```javascript
this.get('userActivity').enableEvent('keyup');
this.get('userActivity').disableEvent('mousedown');
```

Event names must be from the [DOM Event](https://developer.mozilla.org/en-US/docs/Web/Events) list. 
Custom events are not currently supported. If you enable an event name 
that was not set up by default, a new listener will be created automatically.

You can find out if an event is currently enabled:

```javascript
this.get('userActivity').isEnabled('foo'); // false
this.get('userActivity').isEnabled('mousemove'); // true
```

### User Idle Service

This service tracks user activity to decide when a user has gone idle by 
not interacting with the page for a set amount of time.

```javascript
userIdle: Ember.inject.service(),
isIdle: Ember.computed.readOnly('userIdle.isIdle')
```

The default timeout is set for 10 minutes but can be overridden by extending the service:
 
```javascript
// app/services/user-idle.js
import UserIdleService from 'ember-user-activity/services/user-idle';

export default UserIdleService.extend({
  IDLE_TIMEOUT: 300000 // 5 minutes
});
```

By default, the idle service listens to the `userActive` event, but it can be 
configured to listen to a custom set of events from the `user-activity` service:

```javascript
// app/services/user-idle.js
import UserIdleService from 'ember-user-activity/services/user-idle';

export default UserIdleService.extend({
  activeEvents: ['mousedown', 'mousemove']
});
```

Note that the `userActive` event is a superset of all events fired from `user-activity`, 
so in most cases you won't need to change this.

### Cleanup

Please remember that subscribing to events can cause memory leaks if they are not properly cleaned up.
Make sure to remove any listeners before destroying their parent objects.

```javascript
// app/components/foo-bar.js
willDestroyElement() {
  this.get('userActivity').off('keydown', this, this.keydownHandler);
}
```

### Using in Addons

Building your own addon to extend Ember User Activity? No problem! Depending on what you need to do, there are two paths forward:

If you'd like the base services from EUA to still be available in the consuming app, then import them into your own `addon/` service and export under a different name. Otherwise, make sure to export the modified service in your addon's `app/` directory:

```javascript
// app/services/user-idle.js
import UserIdleService from 'ember-user-activity/services/user-idle';

export default UserIdleService.extend({
  IDLE_TIMEOUT: 3000
});
```

Additionally, make sure that your addon gets loaded *after* EUA, to prevent conflicts when merging the `app/` directory trees. This can be accomplished by modifying your addon's `package.json`

```json
"ember-addon": {
  "configPath": "tests/dummy/config",
  "after": "ember-user-activity"
}
```

See the [Ember CLI docs](http://ember-cli.com/extending/#configuring-your-ember-addon-properties) for more information on configuring your addon properties.

## Contributing

This section outlines the details of collaborating on this Ember addon.

### Installation

* `git clone` this repository
* `npm install`
* `bower install`

### Running

* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
