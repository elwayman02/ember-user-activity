( function() {
  "use strict";

  var iframeSuccess,
      iframeFailure,
      startTime;

  QUnit.module( "Notifications", {
    beforeEach: function( assert ) {
      iframeSuccess = QUnit.addExampleSuite( assert, "stubs/success.html?mocks&notifications" );
      iframeSuccess.addEventListener( "load", function() {
        iframeSuccess.contentWindow.QUnit.done( function() {
          startTime = new Date().getTime();
        } );
      }, true );
      iframeFailure = QUnit.addExampleSuite( assert, "stubs/failure.html?mocks&notifications" );
    }
  } );

  QUnit.test( "A Notification should be displayed on successful tests", function( assert ) {
    assert.expect( 1 );
    var Notification = iframeSuccess.contentWindow.Notification;
    assert.ok( Notification.calledOnce, "window.Notification should be called once" );
  } );

  QUnit.test( "A Notification should be displayed on failed tests", function( assert ) {
    assert.expect( 1 );
    var Notification = iframeFailure.contentWindow.Notification;
    assert.ok( Notification.calledOnce, "window.Notification should be called once" );
  } );

  QUnit.test( "Notification should close automatically after 4s by default", function( assert ) {
    assert.expect( 2 );
    var Notification = iframeSuccess.contentWindow.Notification,
        done = assert.async();

    Notification.waitForAllClosed()
      .then( function( closedTime ) {
        assert.ok( true, "Notification should be closed" );
        assert.ok(
          closedTime[ 0 ].value - startTime - 4000 < 10,
          "Notification should be closed after 4000ms => " +
            ( closedTime[ 0 ].value - startTime ) + "ms"
        );
        iframeSuccess.updateCodeCoverage();
      } )
      .catch( function( e ) {
        assert.ok( false, e.message + "\n" + e.stack );
      } )
      .finally( done );
  } );

} )();
