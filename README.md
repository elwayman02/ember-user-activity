# Ember User Activity

[![Build Status](https://travis-ci.org/elwayman02/ember-user-activity.svg?branch=master)](https://travis-ci.org/elwayman02/ember-user-activity)
[![Ember Observer Score](https://emberobserver.com/badges/ember-user-activity.svg)](https://emberobserver.com/addons/ember-user-activity)
[![Code Climate](https://codeclimate.com/github/elwayman02/ember-user-activity/badges/gpa.svg)](https://codeclimate.com/github/elwayman02/ember-user-activity)

This addon provides services for detecting user activity & idling across the entire application.

Check out the [Demo](http://github.jhawk.co/ember-user-activity/)!

## Installation

`ember install ember-user-activity`

## Usage

### User Activity Service

This service fires events from global window listeners. 
These listeners trigger on capture, meaning they are not affected by event cancellation. 

These `window` events are enabled by default:

* `keydown` - Fires when a key is pressed
* `mousedown` - Fires when a mouse is clicked
* `scroll` - Fires when the user scrolls
* `touchstart` - Fires when a touch point is placed on the touch surface [Mobile-Friendly]
* ~~`mousemove` - Fires when the user moves the mouse~~ [Removed as of v0.2.0](https://github.com/elwayman02/ember-user-activity/issues/16)

A custom event, `userActive` is fired for ALL enabled events.

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
  defaultEvents: ['keypress', 'mouseenter', 'mousemove']
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
this.get('userActivity').isEnabled('keydown'); // true
```

Each individual event is throttled by 100ms for performance reasons, 
to avoid clogging apps with a firehose of activity events. The length of 
the throttling can be configured by setting `EVENT_THROTTLE` on the activity service.

```javascript
// app/services/user-activity.js
import UserActivityService from 'ember-user-activity/services/user-activity';

export default UserActivityService.extend({
  EVENT_THROTTLE: 200 // 200 ms
});
```

Setting `EVENT_THROTTLE` to 0 will enable the full firehose of events. 
This may cause performance issues in your application if non-trivial 
amounts of code are being executed for each event being fired.

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
  activeEvents: ['mousedown', 'keydown']
});
```

Note that the `userActive` event is a superset of all events fired from `user-activity`, 
so in most cases you won't need to change this.

The idle service has a `idleChanged` event when `isIdle` gets changed.
```javascript
userIdle: injectService(),

init() {
  this.get('userIdle').on('idleChanged', (isIdle) => {
    // isIdle is true if idle. False otherwise.
  })
}
```

### Scroll Activity Service

This service tracks scrolling within the application by periodically checking 
(via [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)) 
for changes in scroll position for the various scrollable elements in the page. By default, it only 
checks `document`, but the [Scroll Activity Mixin](#scroll-activity-mixin) provides an easy 
way to register your components as well. The [User Activity Service](#user-activity-service) subscribes to these scrolling events by default, so you do not need to do anything to use this service for global scroll events if you are already injecting the user-activity service.

Any elements can be subscribed to this service:

```javascript
this.get('scrollActivity').subscribe(this, this.get('element'));
```

`subscribe` requires at least two parameters:

* `target` - Usually `this`, target just needs to be a unique identifier/object 
that can be used to unsubscribe from the service
* `element` - The scrollable element (can be a DOM or jQuery element - jQuery not required!)

Two optional parameters may follow:

* `callback` - A callback to execute when scrolling has been detected in the element
* `highPriority` - A boolean (default `true`) specifying this subscriber should eagerly check
  scroll positions on each animation frame. When `false`, it will instead
  use an approximation of idle checking on the UI thread to avoid performing
  measurements at sensitive times for other work (like rendering).

Conversely, elements can also be unsubscribed:

```javascript
this.get('scrollActivity').unsubscribe(this);
```

`unsubscribe` only requires the `target` parameter that was initially used to `subscribe`.

### Scroll Activity Mixin

This mixin automatically subscribes and unsubscribes a scrollable component to the `scrollActivity` service.

```javascript
// app/components/my-scroll.js
import Component from 'ember-component';
import ScrollActivityMixin from 'ember-user-activity/mixins/scroll-activity';

export default Component.extend(ScrollActivityMixin);
```

If the component's template itself is not scrollable, but it contains an element 
(such as a div) that can be scrolled, set the `scrollElement` attribute to the appropriate selector:

```handlebars
{{! app/templates/components/my-scroll.hbs }}
<span>Some stuff</span>
<div class='some-scroll'>...</div>
```

```javascript
//app/components/my-scroll.js
import Component from 'ember-component';
import ScrollActivityMixin from 'ember-user-activity/mixins/scroll-activity';

export default Component.extend(ScrollActivityMixin, {
  scrollElement: '.some-scroll'
});
```

Do not set `scrollElement` if the component itself (ie `this.$()`) is the scrollable element.

If the component implements a `didScroll` method, that will be used as a callback 
when scrolling has been detected within the component's DOM.

```javascript
//app/components/my-scroll.js
import Component from 'ember-component';
import ScrollActivityMixin from 'ember-user-activity/mixins/scroll-activity';

export default Component.extend(ScrollActivityMixin, {
  didScroll() {
    // do stuff because we scrolled
  }
});
```

### Cleanup

Please remember that subscribing to events can cause memory leaks if they are not properly cleaned up.
Make sure to remove any listeners before destroying their parent objects.

```javascript
// app/components/foo-bar.js
willDestroyElement() {
  this.get('userActivity').off('keydown', this, this.keydownHandler);
}
```

### Using in an Addon

Building your own addon to extend Ember User Activity? No problem! 
Depending on what you need to do, there are two paths forward:

If you'd like the base services from EUA to still be available in the 
consuming app, then import them into your own `addon/` service and 
export under a different name. Otherwise, make sure to export the 
modified service in your addon's `app/` directory:

```javascript
// app/services/user-idle.js
import UserIdleService from 'ember-user-activity/services/user-idle';

export default UserIdleService.extend({
  IDLE_TIMEOUT: 3000 // 3 minutes
});
```

Make sure that your addon gets loaded *after* EUA, to prevent conflicts when 
merging the `app/` directory trees. This can be accomplished by modifying your addon's `package.json`

```json
"ember-addon": {
  "configPath": "tests/dummy/config",
  "after": "ember-user-activity"
}
```

See the [Ember CLI docs](http://ember-cli.com/extending/#configuring-your-ember-addon-properties) 
for more information on configuring your addon properties.

## Contributing

This section outlines the details of collaborating on this Ember addon.

### Installation

* `git clone git@github.com:elwayman02/ember-user-activity.git`
* `cd ember-user-activity/`
* `npm install`

### Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
