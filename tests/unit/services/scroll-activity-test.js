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

  assert.equal(scrollEventCount, 0, 'scroll never happened');
  wait(() => {
    assert.equal(scrollEventCount, 1, 'scroll happened for initial state');
    $(window).scrollTop(1);
    wait(() => {
      assert.equal(scrollEventCount, 2, 'scroll happened');
      wait(() => {
        assert.equal(scrollEventCount, 2, 'scroll did not just happen again');
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
    assert.equal(scrollEventCount, 1, 'scroll happened once');
    wait(() => {
      assert.equal(scrollEventCount, 1, 'scroll happened once when scrollTop stable');
      scrollTop++;
      wait(() => {
        assert.equal(scrollEventCount, 2, 'scroll happened twice when scrollTop changes');
        done();
      });
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
    assert.equal(scrollEventCount, 1, 'scroll happened once');
    assert.equal(subscribedEventCount, 1, 'subscription callback fired once');
    assert.equal(subscribedLastScrollTop, null, 'initial scrollTop is null');
    assert.equal(subscribedScrollTop, scrollTop, 'new scrolltop is new value');
    wait(() => {
      assert.equal(scrollEventCount, 1, 'scroll happened once when scrollTop stable');
      assert.equal(subscribedEventCount, 1, 'subscription callback fired once');
      scrollTop++;
      wait(() => {
        assert.equal(scrollEventCount, 2, 'scroll happened twice when scrollTop changes');
        assert.equal(subscribedEventCount, 2, 'subscription callback fired once');
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
    assert.equal(scrollEventCount, 1, 'scroll happened once');
    assert.equal(subscribedEventCount, 1, 'subscription callback fired once');
    assert.equal(subscribedLastScrollTop, null, 'initial scrollTop is null');
    assert.equal(subscribedScrollTop, scrollTop, 'new scrolltop is new value');
    wait(() => {
      assert.equal(scrollEventCount, 1, 'scroll happened once when scrollTop stable');
      assert.equal(subscribedEventCount, 1, 'subscription callback fired once');
      scrollTop++;
      service.unsubscribe(target);
      wait(() => {
        assert.equal(scrollEventCount, 1, 'scroll happened twice when scrollTop changes');
        assert.equal(subscribedEventCount, 1, 'subscription callback fired once');
        done();
      });
    });
  });
});
