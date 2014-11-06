module.exports = (function() {


  'use strict';


  var path = require( 'path' );
  var fs = require( 'fs-extra' );
  var heapdump = require( 'heapdump' );
  var Promise = require( 'wee-promise' );


  function MemLeakChecker( baseline ) {
    var that = this;
    that.baseline = baseline;
    that.tolerance = 500000;
    that.iterations = 300;
  }


  MemLeakChecker.getBaseline = function( callback ) {
    hdump( 'baseline-' , callback );
  };


  MemLeakChecker.prototype = {

    good: function( proc ) {
      return this._run( proc , true );
    },

    bad: function( proc ) {
      return this._run( proc , false );
    },

    _run: function( proc , bool ) {
      
      var that = this;
      var name = bool ? 'good-' : 'bad-';

      for (var i = 0; i < that.iterations; i++) {
        proc();
      }
      
      return new Promise(function( resolve ) {
        hdump( name , function( size ) {
          resolve(closeTo( that.baseline , size , that.tolerance ) === bool );
        });
      });
    }
  };


  function closeTo( test1 , test2 , tolerance ) {
    return Math.abs( test1 - test2 ) <= tolerance;
  }


  function hdump( name , callback ) {
    callback = callback || function() {};
    var dir = path.resolve( __dirname , './heap' );
    fs.ensureDir( dir , function() {
      var absolute = dir + '/' + (name || '') + Date.now() + '.heapsnapshot';
      heapdump.writeSnapshot( absolute , function() {
        fs.stat( absolute , function( err , stats ) {
          callback( stats.size );
        })
      });
    });
  }


  return MemLeakChecker;

}());



















