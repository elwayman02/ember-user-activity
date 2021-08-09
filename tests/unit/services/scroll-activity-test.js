import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let wait;
if (window.requestAnimationFrame) {
  wait = (cb) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(cb);
      });
    });
  };
} else {
  wait = (cb) => {
    window.setTimeout(function () {
      window.setTimeout(function () {
        window.setTimeout(cb, 16);
      }, 16);
    }, 16);
  };
}

module('Unit | Service | scroll activity', function (hooks) {
  setupTest(hooks);

  test('event triggered for window scroll', function (assert) {
    assert.expect(4);

    let done = assert.async();

    // Create some content to scroll into
    let fixture = document.getElementById('ember-testing');
    for (let i = 0; i < 300; i++) {
      fixture.appendChild(document.createElement('br'));
    }

    let service = this.owner.lookup(
      'service:ember-user-activity@scroll-activity'
    );

    let scrollEventCount = 0;
    service.on('scroll', () => scrollEventCount++);

    assert.equal(scrollEventCount, 0, 'precond - no scroll happens');
    wait(() => {
      assert.equal(scrollEventCount, 0, 'no scroll happens for nothing');
      window.pageYOffset = 1;
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
    assert.expect(2);

    let done = assert.async();
    let scrollTop = 1234;
    let scrollLeft = 1234;
    let elem = { scrollTop, scrollLeft };
    let target = { elem };

    let service = this.owner.lookup(
      'service:ember-user-activity@scroll-activity'
    );
    service.subscribe(target, elem);

    let scrollEventCount = 0;
    service.on('scroll', () => scrollEventCount++);

    wait(() => {
      assert.equal(scrollEventCount, 0, 'precond - no scroll happens');
      elem.scrollTop++;
      wait(() => {
        assert.equal(
          scrollEventCount,
          1,
          'scroll happened twice when scrollTop changes'
        );
        done();
      });
    });
  });

  test('subscribe w/ callback triggers callback and event', function (assert) {
    assert.expect(8);

    let done = assert.async();
    let scrollTop = 1234;
    let scrollLeft = 1234;
    let elem = { scrollTop, scrollLeft };
    let target = { elem };

    let service = this.owner.lookup(
      'service:ember-user-activity@scroll-activity'
    );

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
      assert.equal(
        subscribedEventCount,
        0,
        'precond - no subscription callback'
      );
      wait(() => {
        assert.equal(scrollEventCount, 0, 'no scroll when nothing happens');
        assert.equal(
          subscribedEventCount,
          0,
          'no subscription callback when nothing happens'
        );
        elem.scrollTop++;
        wait(() => {
          assert.equal(
            scrollEventCount,
            1,
            'scroll happened when scrollTop changes'
          );
          assert.equal(
            subscribedEventCount,
            1,
            'subscription callback fired once'
          );
          assert.equal(
            subscribedLastScrollTop,
            scrollTop,
            'lastScrollTop is previous value'
          );
          assert.equal(
            subscribedScrollTop,
            scrollTop + 1,
            'new scrollTop is new value'
          );
          done();
        });
      });
    });
  });

  test('unsubscribe', function (assert) {
    assert.expect(4);

    let done = assert.async();
    let scrollTop = 1234;
    let scrollLeft = 1234;
    let elem = { scrollTop, scrollLeft };
    let target = { elem };

    let service = this.owner.lookup(
      'service:ember-user-activity@scroll-activity'
    );

    let subscribedEventCount = 0;
    service.subscribe(target, elem, () => {
      subscribedEventCount++;
    });

    let scrollEventCount = 0;
    service.on('scroll', () => scrollEventCount++);

    wait(() => {
      assert.equal(scrollEventCount, 0, 'precond - no scroll event');
      assert.equal(
        subscribedEventCount,
        0,
        'precond - no subscription callback'
      );
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
    for (let i = 0; i < 300; i++) {
      fixture.appendChild(document.createElement('br'));
    }

    let service = this.owner.lookup(
      'service:ember-user-activity@scroll-activity'
    );

    let scrollEventCount = 0;
    service.on('scroll', () => scrollEventCount++);

    assert.equal(scrollEventCount, 0, 'precond - no scroll happens');
    wait(() => {
      assert.equal(scrollEventCount, 0, 'no scroll happens for nothing');
      window.pageXOffset = 1;
      wait(() => {
        assert.equal(scrollEventCount, 1, 'scroll fires for a body scroll');
        wait(() => {
          assert.equal(scrollEventCount, 1, 'no scroll happens for nothing');
          done();
        });
      });
    });
  });

  test('subscribe w/ no callback triggers horizontal scroll event', function (assert) {
    assert.expect(2);

    let done = assert.async();
    let scrollTop = 1234;
    let scrollLeft = 1234;
    let elem = { scrollTop, scrollLeft };
    let target = { elem };

    let service = this.owner.lookup(
      'service:ember-user-activity@scroll-activity'
    );
    service.subscribe(target, elem);

    let scrollEventCount = 0;
    service.on('scroll', () => scrollEventCount++);

    wait(() => {
      assert.equal(scrollEventCount, 0, 'precond - no scroll happens');
      elem.scrollLeft++;
      wait(() => {
        assert.equal(
          scrollEventCount,
          1,
          'scroll happened twice when scrollLeft changes'
        );
        done();
      });
    });
  });

  test('subscribe w/ callback triggers callback and horizontal scroll event', function (assert) {
    assert.expect(8);

    let done = assert.async();
    let scrollTop = 1234;
    let scrollLeft = 1234;
    let elem = { scrollTop, scrollLeft };
    let target = { elem };

    let service = this.owner.lookup(
      'service:ember-user-activity@scroll-activity'
    );

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
      assert.equal(
        subscribedEventCount,
        0,
        'precond - no subscription callback'
      );
      wait(() => {
        assert.equal(scrollEventCount, 0, 'no scroll when nothing happens');
        assert.equal(
          subscribedEventCount,
          0,
          'no subscription callback when nothing happens'
        );
        elem.scrollLeft++;
        wait(() => {
          assert.equal(
            scrollEventCount,
            1,
            'scroll happened when scrollLeft changes'
          );
          assert.equal(
            subscribedEventCount,
            1,
            'subscription callback fired once'
          );
          assert.equal(
            subscribedLastScrollLeft,
            scrollLeft,
            'lastScrollLeft is previous value'
          );
          assert.equal(
            subscribedScrollLeft,
            scrollLeft + 1,
            'new scrollLeft is new value'
          );
          done();
        });
      });
    });
  });

  test('subscribe w/ callback triggers callback along with a scrollType parameter', function (assert) {
    assert.expect(25);

    let done = assert.async();
    let scrollTop = 1234;
    let scrollLeft = 1234;
    let elem = { scrollTop, scrollLeft };
    let target = { elem };

    const SCROLL_EVENT_TYPE_VERTICAL = 'vertical';
    const SCROLL_EVENT_TYPE_HORIZONTAL = 'horizontal';
    const SCROLL_EVENT_TYPE_DIAGONAL = 'diagonal';

    let service = this.owner.lookup(
      'service:ember-user-activity@scroll-activity'
    );

    let subscribedEventCount = 0;
    let subscribedScrollTop = null;
    let subscribedLastScrollTop = null;
    let subscribedScrollLeft = null;
    let subscribedLastScrollLeft = null;
    let subscribedScrollType = null;
    service.subscribe(
      target,
      elem,
      (
        scroll,
        lastScroll,
        scrollType,
        scrollSecondary,
        lastScrollSecondary
      ) => {
        if (scrollType === SCROLL_EVENT_TYPE_VERTICAL) {
          subscribedScrollTop = scroll;
          subscribedLastScrollTop = lastScroll;
        } else if (scrollType === SCROLL_EVENT_TYPE_HORIZONTAL) {
          subscribedScrollLeft = scroll;
          subscribedLastScrollLeft = lastScroll;
        } else if (scrollType === SCROLL_EVENT_TYPE_DIAGONAL) {
          subscribedScrollTop = scroll;
          subscribedLastScrollTop = lastScroll;
          subscribedScrollLeft = scrollSecondary;
          subscribedLastScrollLeft = lastScrollSecondary;
        } else {
          throw new Error('Invalid scrollType was returned');
        }

        subscribedScrollType = scrollType;
        subscribedEventCount++;
      }
    );

    let scrollEventCount = 0;
    service.on('scroll', () => scrollEventCount++);

    wait(() => {
      assert.equal(scrollEventCount, 0, 'precond - no scroll event');
      assert.equal(
        subscribedEventCount,
        0,
        'precond - no subscription callback'
      );
      wait(() => {
        assert.equal(scrollEventCount, 0, 'no scroll when nothing happens');
        assert.equal(
          subscribedEventCount,
          0,
          'no subscription callback when nothing happens'
        );
        elem.scrollTop++;
        wait(() => {
          assert.equal(
            scrollEventCount,
            1,
            'scroll happened when scrollTop changes'
          );
          assert.equal(
            subscribedEventCount,
            1,
            'subscription callback fired once'
          );
          assert.equal(
            subscribedLastScrollTop,
            scrollTop,
            'lastScrollTop is previous value'
          );
          assert.equal(
            subscribedScrollTop,
            scrollTop + 1,
            'new scrollTop is new value'
          );
          assert.equal(
            subscribedLastScrollLeft,
            null,
            'lastScrollLeft is unchanged'
          );
          assert.equal(
            subscribedScrollLeft,
            null,
            'new scrollLeft is unchanged'
          );
          assert.equal(
            subscribedScrollType,
            SCROLL_EVENT_TYPE_VERTICAL,
            'scroll type is vertical for vertical scroll event'
          );
          elem.scrollLeft++;
          wait(() => {
            assert.equal(
              scrollEventCount,
              2,
              'scroll happened when scrollTop changes'
            );
            assert.equal(
              subscribedEventCount,
              2,
              'subscription callback fired once'
            );
            assert.equal(
              subscribedLastScrollTop,
              scrollTop,
              'lastScrollTop is previous value'
            );
            assert.equal(
              subscribedScrollTop,
              scrollTop + 1,
              'new scrollTop is unchanged'
            );
            assert.equal(
              subscribedLastScrollLeft,
              scrollLeft,
              'lastScrollLeft is previous value'
            );
            assert.equal(
              subscribedScrollLeft,
              scrollLeft + 1,
              'new scrollLeft is new value'
            );
            assert.equal(
              subscribedScrollType,
              SCROLL_EVENT_TYPE_HORIZONTAL,
              'scroll type is horizontal for horizontal scroll event'
            );
            elem.scrollTop++;
            elem.scrollLeft++;
            wait(() => {
              assert.equal(
                scrollEventCount,
                3,
                'scroll happened when scrollTop changes'
              );
              assert.equal(
                subscribedEventCount,
                3,
                'subscription callback fired once'
              );
              assert.equal(
                subscribedLastScrollTop,
                scrollTop + 1,
                'lastScrollTop is previous value'
              );
              assert.equal(
                subscribedScrollTop,
                scrollTop + 2,
                'new scrollTop is new value'
              );
              assert.equal(
                subscribedLastScrollLeft,
                scrollLeft + 1,
                'lastScrollLeft is previous value'
              );
              assert.equal(
                subscribedScrollLeft,
                scrollLeft + 2,
                'new scrollLeft unchanged'
              );
              assert.equal(
                subscribedScrollType,
                SCROLL_EVENT_TYPE_DIAGONAL,
                'scroll type is diagonal for diagonal scroll event'
              );
              done();
            });
          });
        });
      });
    });
  });
});
