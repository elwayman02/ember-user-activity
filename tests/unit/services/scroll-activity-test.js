import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

let wait;
if (window.requestAnimationFrame) {
  wait = (cb) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(cb);
      });
    });
  }
} else {
  wait = (cb) => {
    window.setTimeout(function() {
      window.setTimeout(function() {
        window.setTimeout(cb, 16);
      }, 16);
    }, 16);
  }
}

moduleFor('service:scroll-activity', 'Unit | Service | scroll activity', {});

test('event triggered for window scroll', function (assert) {
  assert.expect(4);

  let done = assert.async();

  // Create some content to scroll into
  let fixture = document.getElementById('ember-testing');
  for (let i=0;i<300;i++) {
    fixture.appendChild(document.createElement('br'));
  }

  let service = this.subject();

  let scrollEventCount = 0;
  service.on('scroll', () => scrollEventCount++);

  assert.equal(scrollEventCount, 0, 'precond - no scroll happens');
  wait(() => {
    assert.equal(scrollEventCount, 0, 'no scroll happens for nothing');
    if (!window.navigator.userAgent.includes('PhantomJS')) { // Scrolling doesn't work in phantom :feelsBadMan:
      window.pageYOffset = 1;
      wait(() => {
        assert.equal(scrollEventCount, 1, 'scroll fires for a body scroll');
        wait(() => {
          assert.equal(scrollEventCount, 1, 'no scroll happens for nothing');
          done();
        });
      });
    } else { // Fire two dummy assertions so that `assert.expect` passes
      assert.ok(true);
      assert.ok(true);
      done();
    }
  });
});

test('subscribe w/ no callback triggers event', function (assert) {
  let done = assert.async();
  let scrollTop = 1234;
  let elem = { scrollTop };
  let target = { elem };

  let service = this.subject();
  service.subscribe(target, elem);

  let scrollEventCount = 0;
  service.on('scroll', () => scrollEventCount++);

  wait(() => {
    assert.equal(scrollEventCount, 0, 'precond - no scroll happens');
    elem.scrollTop++;
    wait(() => {
      assert.equal(scrollEventCount, 1, 'scroll happened twice when scrollTop changes');
      done();
    });
  });
});

test('subscribe w/ callback triggers callback and event', function (assert) {
  let done = assert.async();
  let scrollTop = 1234;
  let elem = { scrollTop };
  let target = { elem };

  let service = this.subject();

  let subscribedEventCount = 0;
  let subscribedScrollTop = null;
  let subscribedLastScrollTop = null;
  service.subscribe(target, elem, (scrollTop, lastScrollTop) => {
    subscribedScrollTop = scrollTop;
    subscribedLastScrollTop = lastScrollTop;
    subscribedEventCount++;
  });

  let scrollEventCount = 0;
  service.on('scroll', () => scrollEventCount++);

  wait(() => {
    assert.equal(scrollEventCount, 0, 'precond - no scroll event');
    assert.equal(subscribedEventCount, 0, 'precond - no subscription callback');
    wait(() => {
      assert.equal(scrollEventCount, 0, 'no scroll when nothing happens');
      assert.equal(subscribedEventCount, 0, 'no subscription callback when nothing happens');
      elem.scrollTop++;
      wait(() => {
        assert.equal(scrollEventCount, 1, 'scroll happened when scrollTop changes');
        assert.equal(subscribedEventCount, 1, 'subscription callback fired once');
        assert.equal(subscribedLastScrollTop, scrollTop, 'lastScrollTop is previous value');
        assert.equal(subscribedScrollTop, scrollTop + 1, 'new scrolltop is new value');
        done();
      });
    });
  });
});

test('unsubscribe', function (assert) {
  let done = assert.async();
  let scrollTop = 1234;
  let elem = { scrollTop };
  let target = { elem };

  let service = this.subject();

  let subscribedEventCount = 0;
  service.subscribe(target, elem, () => {
    subscribedEventCount++;
  });

  let scrollEventCount = 0;
  service.on('scroll', () => scrollEventCount++);

  wait(() => {
    assert.equal(scrollEventCount, 0, 'precond - no scroll event');
    assert.equal(subscribedEventCount, 0, 'precond - no subscription callback');
    elem.scrollTop++;
    elem.scrollLeft++;
    service.unsubscribe(target);
    wait(() => {
      assert.equal(scrollEventCount, 0, 'no scroll event');
      assert.equal(subscribedEventCount, 0, 'no subscription callback');
      done();
    });
  });
});

test('event triggered for horizontal window scroll', function (assert) {
  assert.expect(4);

  let done = assert.async();

  // Create some content to scroll into
  let fixture = document.getElementById('ember-testing');
  for (let i=0;i<300;i++) {
    fixture.appendChild(document.createElement('br'));
  }

  let service = this.subject();

  let scrollEventCount = 0;
  service.on('scroll', () => scrollEventCount++);

  assert.equal(scrollEventCount, 0, 'precond - no scroll happens');
  wait(() => {
    assert.equal(scrollEventCount, 0, 'no scroll happens for nothing');
    if (!window.navigator.userAgent.includes('PhantomJS')) { // Scrolling doesn't work in phantom :feelsBadMan:
      window.pageXOffset = 1;
      wait(() => {
        assert.equal(scrollEventCount, 1, 'scroll fires for a body scroll');
        wait(() => {
          assert.equal(scrollEventCount, 1, 'no scroll happens for nothing');
          done();
        });
      });
    } else { // Fire two dummy assertions so that `assert.expect` passes
      assert.ok(true);
      assert.ok(true);
      done();
    }
  });
});

test('subscribe w/ no callback triggers horizontal scroll event', function (assert) {
  let done = assert.async();
  let scrollLeft = 1234;
  let elem = { scrollLeft };
  let target = { elem };

  let service = this.subject();
  service.subscribe(target, elem);

  let scrollEventCount = 0;
  service.on('scroll', () => scrollEventCount++);

  wait(() => {
    assert.equal(scrollEventCount, 0, 'precond - no scroll happens');
    elem.scrollLeft++;
    wait(() => {
      assert.equal(scrollEventCount, 1, 'scroll happened twice when scrollLeft changes');
      done();
    });
  });
});

test('subscribe w/ callback triggers callback and horizontal scroll event', function (assert) {
  let done = assert.async();
  let scrollLeft = 1234;
  let elem = { scrollLeft };
  let target = { elem };

  let service = this.subject();

  let subscribedEventCount = 0;
  let subscribedScrollLeft = null;
  let subscribedLastScrollLeft = null;
  service.subscribe(target, elem, (scrollLeft, lastScrollLeft) => {
    subscribedScrollLeft = scrollLeft;
    subscribedLastScrollLeft = lastScrollLeft;
    subscribedEventCount++;
  });

  let scrollEventCount = 0;
  service.on('scroll', () => scrollEventCount++);

  wait(() => {
    assert.equal(scrollEventCount, 0, 'precond - no scroll event');
    assert.equal(subscribedEventCount, 0, 'precond - no subscription callback');
    wait(() => {
      assert.equal(scrollEventCount, 0, 'no scroll when nothing happens');
      assert.equal(subscribedEventCount, 0, 'no subscription callback when nothing happens');
      elem.scrollLeft++;
      wait(() => {
        assert.equal(scrollEventCount, 1, 'scroll happened when scrollLeft changes');
        assert.equal(subscribedEventCount, 1, 'subscription callback fired once');
        assert.equal(subscribedLastScrollLeft, scrollLeft, 'lastScrollLeft is previous value');
        assert.equal(subscribedScrollLeft, scrollLeft + 1, 'new scrollLeft is new value');
        done();
      });
    });
  });
});