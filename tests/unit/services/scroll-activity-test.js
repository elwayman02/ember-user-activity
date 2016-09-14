import { moduleFor } from 'ember-qunit';
import test from 'dummy/tests/ember-sinon-qunit/test';
import $ from 'jquery';

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
  let done = assert.async();

  // Create some content to scroll into
  let fixture = $('#ember-testing');
  for (let i=0;i<300;i++) {
    fixture.append('<br>');
  }

  let service = this.subject();

  let scrollEventCount = 0;
  service.on('scroll', () => scrollEventCount++);

  assert.equal(scrollEventCount, 0, 'precond - no scroll happens');
  wait(() => {
    assert.equal(scrollEventCount, 0, 'no scroll happens for nothing');
    $(window).scrollTop(1);
    wait(() => {
      assert.equal(scrollEventCount, 1, 'scroll fires for a body scroll');
      wait(() => {
        assert.equal(scrollEventCount, 1, 'no scroll happens for nothing');
        done();
      });
    });
  });
});

test('subscribe w/ no callback triggers event', function (assert) {
  let done = assert.async();
  let scrollTop = 1234;
  let elem = {
    scrollTop: () => scrollTop
  };
  let target = { elem };

  let service = this.subject();
  service.subscribe(target, elem);

  let scrollEventCount = 0;
  service.on('scroll', () => scrollEventCount++);

  wait(() => {
    assert.equal(scrollEventCount, 0, 'precond - no scroll happens');
    scrollTop++;
    wait(() => {
      assert.equal(scrollEventCount, 1, 'scroll happened twice when scrollTop changes');
      done();
    });
  });
});

test('subscribe w/ callback triggers callback and evet', function (assert) {
  let done = assert.async();
  let scrollTop = 1234;
  let elem = {
    scrollTop: () => scrollTop
  };
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
      scrollTop++;
      wait(() => {
        assert.equal(scrollEventCount, 1, 'scroll happened when scrollTop changes');
        assert.equal(subscribedEventCount, 1, 'subscription callback fired once');
        assert.equal(subscribedLastScrollTop, scrollTop-1, 'lastScrollTop is previous value');
        assert.equal(subscribedScrollTop, scrollTop, 'new scrolltop is new value');
        done();
      });
    });
  });
});

test('unsubscribe', function (assert) {
  let done = assert.async();
  let scrollTop = 1234;
  let elem = {
    scrollTop: () => scrollTop
  };
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
    scrollTop++;
    service.unsubscribe(target);
    wait(() => {
      assert.equal(scrollEventCount, 0, 'no scroll event');
      assert.equal(subscribedEventCount, 0, 'no subscription callback');
      done();
    });
  });
});
