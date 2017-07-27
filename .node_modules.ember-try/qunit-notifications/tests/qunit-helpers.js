( function() {
  "use strict";

  // Insert QUnit UI
  var qUnitContainer = document.createElement( "div" ),
      fixtureContainer = document.createElement( "div" );
  qUnitContainer.id = "qunit";
  fixtureContainer.id = "qunit-fixture";
  document.body.appendChild( qUnitContainer );
  document.body.appendChild( fixtureContainer );

  QUnit.addCoverage = function addCoverage( coverage ) {

    // If no report exists, don't merge
    if ( !window.__coverage__ ) {
      window.__coverage__ = coverage;
      return;
    }

    // Otherwise, merge reports
    Object.keys( coverage ).forEach( function( filename ) {
      window.__coverage__[ filename ] = window.coverageUtils.mergeFileCoverage(
        window.__coverage__[ filename ],
        coverage[ filename ]
      );
    } );
  };

  QUnit.addExampleSuite = function addExampleSuite( assert, src ) {

    var iframe,
        fireIFrameLoaded,
        loadedOnce; // prevents calling fireIFrameLoaded multiple times if iframe reloads

    // Create element
    iframe = document.createElement( "iframe" );
    iframe.src = ( window.__karma__ ? "/base/tests/" : "" ) + src;

    // Once th iframe is loaded and
    // QUnit test suite
    fireIFrameLoaded = assert.async(),
    loadedOnce = false;

    iframe.updateCodeCoverage = function() {
      this.contentWindow.__coverage__ && QUnit.addCoverage( this.contentWindow.__coverage__ );
    };

    iframe.addEventListener( "load", function() {
      iframe.contentWindow.QUnit.done( function() {

        // Add coverage report, if any
        iframe.updateCodeCoverage();

        // Notify parent's QUnit that iframe hs been loaded
        if ( !loadedOnce ) {
          loadedOnce = true;
          fireIFrameLoaded();
        }
      } );
    }, true );

    // Load the iframe
    document.getElementById( "qunit-fixture" ).appendChild( iframe );

    return iframe;
  };

} )();
