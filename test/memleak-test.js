(function() {


  'use strict';


  var MLChecker = require( './memleakChecker' );
  var chai = require( 'chai' );
  var assert = chai.assert;


  function Dummy() {};

  function good() {
    var dummy = new Dummy();
    return function() {};
  }

  function probs() {
    var dummy = new Dummy();
    function unreachable() { return dummy; }
    return function() {};
  }

  function bad() {
    var dummy = new Dummy();
    global.____dummies = global.____dummies || [];
    global.____dummies.push(function() { dummy; });
  }


  describe( 'Memory Leak Test' , function() {

    var checker;
    
    it( 'getting a baseline' , function( done ) {
      MLChecker.getBaseline(function( baseline ) {
        checker = new MLChecker( baseline );
        done();
      });
    });

    it( 'should not cause a memory leak' , function( done ) {
      checker.good( good ).then(function( success ) {
        assert.ok( success );
        done();
      })
      .catch( done );
    });
    
    it( 'should probably cause a memory leak on non-V8 interpreters' , function( done ) {
      checker.good( probs ).then(function( success ) {
        assert.ok( success );
        done();
      })
      .catch( done );
    });

    it( 'should definitely cause a memory leak' , function( done ) {
      checker.bad( bad ).then(function( success ) {
        assert.ok( success );
        done();
      })
      .catch( done );
    });
  });

}());



















