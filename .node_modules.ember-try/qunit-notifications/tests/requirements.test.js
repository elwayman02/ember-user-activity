( function() {
  "use strict";

  var iframeGrant,
      iframeDeny,
      iframeGranted,
      iframeDenied;

  QUnit.module( "Requirements", {
    beforeEach: function( assert ) {
      iframeGrant = QUnit.addExampleSuite( assert, "stubs/empty.html?mocks=grant" );
      iframeDeny = QUnit.addExampleSuite( assert, "stubs/empty.html?mocks=deny" );
      iframeGranted = QUnit.addExampleSuite( assert, "stubs/empty.html?mocks=granted" );
      iframeDenied = QUnit.addExampleSuite( assert, "stubs/empty.html?mocks=denied" );
    }
  } );

  QUnit.test( "Browser should support HTML5 notifications", function( assert ) {
    assert.expect( 2 );
    assert.ok(
      "Notification" in iframeGrant.contentWindow,
      "window object should have a \"Notification\" member"
    );
    assert.strictEqual(
      typeof iframeGrant.contentWindow.Notification,
      "function",
      "window.Notification should be a function"
    );
  } );

  QUnit.test( "Notification mock 'grant' should grant permission", function( assert ) {
    assert.expect( 4 );

    assert.strictEqual(
      iframeGrant.contentWindow.Notification.permission,
      "default",
      "Notification.permission should be set to \"default\" by default"
    );

    var permissionUpdated = false,
        newPermission = null;

    iframeGrant.contentWindow.Notification.requestPermission( function( permission ) {
      permissionUpdated = true;
      newPermission = permission;
    } );
    assert.ok( permissionUpdated,
      "Permission should be granted synchronously"
    );
    assert.strictEqual(
      newPermission,
      "granted",
      "New permission should be \"granted\""
    );
    assert.strictEqual(
      iframeGrant.contentWindow.Notification.permission,
      "granted",
      "Notification.permission should be updated to \"granted\""
    );
  } );

  QUnit.test( "Notification mock 'deny' should deny permission", function( assert ) {
    assert.expect( 4 );

    assert.strictEqual(
      iframeDeny.contentWindow.Notification.permission,
      "default",
      "Notification.permission should be set to \"default\" by default"
    );

    var permissionUpdated = false,
        newPermission = null;

    iframeDeny.contentWindow.Notification.requestPermission( function( permission ) {
      permissionUpdated = true;
      newPermission = permission;
    } );
    assert.ok( permissionUpdated,
      "Permission should be denied synchronously"
    );
    assert.strictEqual(
      newPermission,
      "denied",
      "New permission should be \"denied\""
    );
    assert.strictEqual(
      iframeDeny.contentWindow.Notification.permission,
      "denied",
      "Notification.permission should be updated to \"denied\""
    );
  } );

  QUnit.test( "Notification mock 'granted' should have permission granted", function( assert ) {
    assert.expect( 1 );
    assert.strictEqual(
      iframeGranted.contentWindow.Notification.permission,
      "granted",
      "Notification.permission should be set to \"granted\" by default"
    );
  } );

  QUnit.test( "Notification mock 'denied' should have permission denied", function( assert ) {
    assert.expect( 1 );
    assert.strictEqual(
      iframeDenied.contentWindow.Notification.permission,
      "denied",
      "Notification.permission should be set to \"denied\" by default"
    );
  } );

  QUnit.test( "Notification mock should hold a Promise object", function( assert ) {
    assert.expect( 3 );

    var notification1 = new iframeGrant.contentWindow.Notification( "NOTIFICATION_TO_CLOSE_1" ),
        notification2 = new iframeGrant.contentWindow.Notification( "NOTIFICATION_TO_CLOSE_2" ),
        done = assert.async(),
        doneAll = assert.async();

    notification1.waitForClosed().then( function( result ) {
      assert.ok(
        true,
        "notification.waitForClosed promise should be resolved once the notification is closed"
      );
      assert.ok(
        new Date().getTime() - result  < 10,
        "notification.waitForClosed promise result should be the current time => +" +
          ( new Date().getTime() - result ) + "ms"
      );
      done();
    } );

    iframeGrant.contentWindow.Notification.waitForAllClosed().then( function() {
      assert.ok(
        true,
        "Notification.waitForAllClosed promise should be resolved one all notifications are closed"
      );
      iframeGrant.updateCodeCoverage();
      doneAll();
    } );

    setTimeout( notification1.close, 50 );
    setTimeout( notification2.close, 100 );
  } );

  /*jshint nonew: false */
  QUnit.test( "Sinon.JS should be able to spy notifications", function( assert ) {
    assert.expect( 7 );

    iframeGrant.contentWindow.Notification.requestPermission();
    assert.strictEqual( iframeGrant.contentWindow.Notification.requestPermission.callCount, 1,
      "Notification.requestPermission should have been called once"
    );

    iframeGrant.contentWindow.Notification( "NOTIFICATION_WITHOUT_NEW" );
    assert.ok(
      iframeGrant.contentWindow.Notification.calledOnce,
      "Notification should have been called once"
    );
    assert.ok(
      !iframeGrant.contentWindow.Notification.calledWithNew(),
      "Notification should not have been called with \"new\" keyword"
    );
    assert.ok(
      iframeGrant.contentWindow.Notification.calledWithExactly( "NOTIFICATION_WITHOUT_NEW" ),
      "Notification should have been called with \"NOTIFICATION_WITHOUT_NEW\" argument"
    );

    new iframeGrant.contentWindow.Notification( "NOTIFICATION_WITH_NEW" );
    assert.ok(
      iframeGrant.contentWindow.Notification.calledTwice,
      "Notification should have been called twice now"
    );
    assert.ok(
      iframeGrant.contentWindow.Notification.calledWithNew(),
      "Notification should have been called with \"new\" keyword"
    );
    assert.ok(
      iframeGrant.contentWindow.Notification.calledWithExactly( "NOTIFICATION_WITH_NEW" ),
      "Notification should have been called with \"NOTIFICATION_WITH_NEW\" argument"
    );
  } );

} )();
