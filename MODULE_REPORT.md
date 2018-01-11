## Module Report
### Unknown Global

**Global**: `Ember.testing`

**Location**: `addon/services/user-activity.js` at line 49

```js
    this._super(...arguments);

    if (Ember.testing) { // Do not throttle in testing mode
      this.set('EVENT_THROTTLE', 0);
    }
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `addon/services/user-idle.js` at line 26

```js
    this._super(...arguments);

    if (Ember.testing) { // Shorter debounce in testing mode
      this.set('IDLE_TIMEOUT', 10);
    }
```
