( function() {
  "use strict";

  var iframeDisabledGrant,
      iframeDisabledDeny,
      iframeDisabledGranted,
      iframeDisabledDenied,
      iframeEnabled;

  QUnit.module( "Toolbar", {
    beforeEach: function( assert ) {
      iframeDisabledGrant = QUnit.addExampleSuite( assert, "stubs/success.html?mocks=grant" );
      iframeDisabledDeny = QUnit.addExampleSuite( assert, "stubs/success.html?mocks=deny" );
      iframeDisabledGranted = QUnit.addExampleSuite( assert, "stubs/success.html?mocks=granted" );
      iframeDisabledDenied = QUnit.addExampleSuite( assert, "stubs/success.html?mocks=denied" );
      iframeEnabled = QUnit.addExampleSuite(
        assert,
        "stubs/success.html?mocks=granted&notifications"
      );
    }
  } );

  QUnit.test( "A \"Notifications\" checkbox should appear in the toolbar", function( assert ) {
    assert.expect( 2 );
    assert.strictEqual(
      iframeDisabledGrant.contentDocument.getElementById( "qunit-notifications" ).nodeName,
      "INPUT",
      "Checkbox #qunit-notifications should be inserted into the enabled page"
    );
    assert.strictEqual(
      iframeEnabled.contentDocument.getElementById( "qunit-notifications" ).nodeName,
      "INPUT",
      "Checkbox #qunit-notifications should be inserted into the disabled page"
    );
  } );

  QUnit.test( "Checking \"Notifications\" should enable QUnit Notifications", function( assert ) {
    assert.expect( 3 );
    iframeDisabledGrant.contentDocument.getElementById( "qunit-notifications" ).click();
    iframeDisabledGrant.updateCodeCoverage();

    var done = assert.async();
    iframeDisabledGrant.addEventListener( "load", function() {
      iframeDisabledGrant.contentWindow.QUnit.done( function() {
        assert.strictEqual(
          iframeDisabledGrant.contentWindow.location.search,
          "?mocks=grant&notifications",
          "URL query string should be ?mocks=grant&notifications"
        );
        assert.strictEqual(
          iframeDisabledGrant.contentWindow.QUnit.urlParams.notifications,
          true,
          "QUnit.urlParams.notifications should be true"
        );
        assert.ok(
          iframeDisabledGrant.contentWindow.Notification.calledOnce,
          "window.Notification should be called once"
        );
        iframeDisabledGrant.updateCodeCoverage();
        done();
      } );
    } );
  } );

  QUnit.test( "Checking \"Notifications\" should not enable QUnit Notifications" +
      " if user denies permission", function( assert ) {
    assert.expect( 4 );
    iframeDisabledDeny.contentDocument.getElementById( "qunit-notifications" ).click();
    iframeDisabledDeny.updateCodeCoverage();

    var done = assert.async(),
        reloaded = false;

    iframeDisabledDeny.addEventListener( "load", function() {
      reloaded = true;
    } );

    setTimeout( function() {
      assert.ok( !reloaded, "Window should not reload" );
      assert.strictEqual(
        iframeDisabledDeny.contentWindow.location.search,
        "?mocks=deny",
        "URL query string should remain ?mocks=deny"
      );
      assert.strictEqual(
        iframeDisabledDeny.contentWindow.QUnit.urlParams.notifications,
        undefined,
        "QUnit.urlParams.notifications should be undefined"
      );
      assert.ok(
        !iframeDisabledDeny.contentWindow.Notification.calledOnce,
        "window.Notification should not be called"
      );
      iframeDisabledDeny.updateCodeCoverage();
      done();
    }, 1000 ); // let time to reload if it does

  } );

  QUnit.test( "Checking \"Notifications\" should ask for permission" +
      " when Notification.permission does not exist", function( assert ) {
    assert.expect( 1 );
    delete iframeDisabledGrant.contentWindow.Notification.permission;
    iframeDisabledGrant.contentDocument.getElementById( "qunit-notifications" ).click();
    assert.ok(
      iframeDisabledGrant.contentWindow.Notification.requestPermission.calledOnce,
      "window.Notification.requestPermission should be called once"
    );
    iframeDisabledGrant.updateCodeCoverage();
  } );

  QUnit.test( "Checking \"Notifications\" should ask for permission" +
      " when Notification.permission is \"default\"", function( assert ) {
    assert.expect( 1 );
    iframeDisabledGrant.contentDocument.getElementById( "qunit-notifications" ).click();
    assert.ok(
      iframeDisabledGrant.contentWindow.Notification.requestPermission.calledOnce,
      "window.Notification.requestPermission should be called once"
    );
    iframeDisabledGrant.updateCodeCoverage();
  } );

  QUnit.test( "Checking \"Notifications\" should not ask for permission" +
      " when Notification.permission is \"granted\"", function( assert ) {
    assert.expect( 1 );
    iframeDisabledGranted.contentDocument.getElementById( "qunit-notifications" ).click();
    assert.ok(
      !iframeDisabledGranted.contentWindow.Notification.requestPermission.calledOnce,
      "window.Notification.requestPermission should not be called once"
    );
    iframeDisabledGranted.updateCodeCoverage();
  } );

  QUnit.test( "Checking \"Notifications\" should not ask for permission" +
      " when Notification.permission is \"denied\"", function( assert ) {
    assert.expect( 1 );
    iframeDisabledDenied.contentDocument.getElementById( "qunit-notifications" ).click();
    assert.ok(
      !iframeDisabledDenied.contentWindow.Notification.requestPermission.calledOnce,
      "window.Notification.requestPermission should not be called once"
    );
    iframeDisabledDenied.updateCodeCoverage();
  } );

  QUnit.test( "\"Notifications\" checkbox should be disabled" +
      " when Notification.permission is \"denied\"", function( assert ) {
    assert.expect( 1 );
    assert.ok(
      iframeDisabledDenied.contentDocument.getElementById( "qunit-notifications" ).disabled,
      "\"Notifications\" checkbox should be disabled"
    );
  } );

  QUnit.test( "Unchecking \"Notifications\" should disable notifications", function( assert ) {
    assert.expect( 4 );
    iframeEnabled.contentDocument.getElementById( "qunit-notifications" ).click();
    assert.ok(
      !iframeEnabled.contentWindow.Notification.requestPermission.called,
      "window.Notification.requestPermission should not be called"
    );
    iframeEnabled.updateCodeCoverage();

    var done = assert.async();
    iframeEnabled.addEventListener( "load", function() {
      iframeEnabled.contentWindow.QUnit.done( function() {
        assert.strictEqual(
          iframeEnabled.contentWindow.location.search,
          "?mocks=granted",
          "URL query string should be ?mocks=granted"
        );
        assert.strictEqual(
          iframeEnabled.contentWindow.QUnit.urlParams.notifications,
          undefined,
          "QUnit.urlParams.notifications should be undefined"
        );
        assert.ok(
          !iframeEnabled.contentWindow.Notification.neverCalled,
          "window.Notification should never be called"
        );
        iframeEnabled.updateCodeCoverage();
        done();
      } );
    } );
  } );

} )();
