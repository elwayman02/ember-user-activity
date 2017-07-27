( function( QUnit ) {
  "use strict";

  var iframe;

  QUnit.module( "Unsupported browsers", {
    beforeEach: function( assert ) {
      iframe = QUnit.addExampleSuite( assert, "stubs/not-supported.html" );
    }
  } );

  QUnit.test( "Should run from a browser not supporting desktop notifications", function( assert ) {
    assert.expect( 1 );
    assert.ok(
      !( iframe.contentWindow in window ),
      "window object should not have a \"Notification\" member"
    );
  } );

  QUnit.test( "Notifications option should not appear in the toolbar", function( assert ) {
    assert.expect( 1 );
    assert.strictEqual(
      iframe.contentDocument.getElementById( "qunit-notifications" ),
      null,
      "Checkbox #qunit-notifications should not be inserted into the page"
    );
  } );

} )( window.QUnit );
