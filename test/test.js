(function() {

  'use strict';  

  var path = require( 'path' );
  var fs = require( 'fs-extra' );
  var util = require( 'util' );
  var chai = require( 'chai' );
  var assert = chai.assert;
  var expect = chai.expect;


  var $MOJO = require( './mojo.js' );
  var TestModules = require( './testModules.transpiled.js' );
  var MLChecker = require( './memleakChecker' );


  $MOJO.log = function() {
    var args = Array.prototype.map.call( arguments , function( arg ) {
      return util.inspect( arg , { depth: null , colors: true });
    });
    console.log.apply( null , args );
  };


  var SEED = { name: 'mojo' };
  function Test(){}
  function Test2(){}
  function Test3(){}

  function GNARLY() {
    $MOJO.construct( this );
  }

  GNARLY.prototype = $MOJO.create({
    tubes: function() {},
    handleMOJO: function() {}
  });

  var mojo = new $MOJO( SEED );


  describe( 'constructor' , function() {
    it( 'should create a new $MOJO instance' , function( done ) {
      assert.instanceOf( mojo , $MOJO );
      done();
    });
  });

  describe( 'prototype' , function() {
    it( 'should have no enumerable properties when mojo is created with constructor' , function( done ) {
      var keys = [];
      for (var key in mojo) {
        keys.push( key );
      }
      expect( keys.length ).to.equal(
        Object.keys( SEED ).length
      );
      done();
    });
    it( 'should inherit no enumerable properties when mojo is created with $MOJO.create / $MOJO.construct' , function( done ) {
      var mojoIsh = new GNARLY();
      var keys = [];
      for (var key in mojoIsh) {
        keys.push( key );
      }
      expect( keys.length ).to.equal(
        Object.keys( GNARLY.prototype ).length
      );
      done();
    });
  });

  describe( '#__add' , function() {
    it( 'should push to the handlers[type] array' , function( done ) {
      mojo.__add( 'gnarly' , Test , null );
      expect( mojo.handlers.gnarly.length ).to.equal( 1 );
      done();
    });
  });

  describe( '#__get' , function() {
    it( 'should return all handlers if type is undefined' , function( done ) {
      var handlers = mojo.__get();
      assert.instanceOf( handlers , Object );
      done();
    });
    it( 'should return handlers[type] if type is defined' , function( done ) {
      var handlerArray = mojo.__get( 'gnarly' );
      assert.instanceOf( handlerArray , Array );
      done();
    });
    it( 'should return an empty array if type does not exist' , function( done ) {
      var handlerArray = mojo.__get( 'rad' );
      assert.instanceOf( handlerArray , Array );
      expect( handlerArray.length ).to.equal( 0 );
      expect( mojo.handlers ).to.not.have.property( 'rad' );
      done();
    });
  });

  describe( '#__remove' , function() {
    it( 'should delete the handlers[type] array if length is 0' , function( done ) {
      mojo.__remove( 'gnarly' , Test );
      expect( mojo.handlers ).to.not.have.property( 'gnarly' );
      done();
    });
    it( 'should delete the handlers[type] array if func is falsy' , function( done ) {
      mojo.__add( 'gnarly' , Test , null );
      expect( mojo.handlers.gnarly.length ).to.equal( 1 );
      mojo.__remove( 'gnarly' );
      expect( mojo.handlers ).to.not.have.property( 'gnarly' );
      done();
    });
    it( 'should remove all matched handlers' , function( done ) {
      mojo.__add( 'gnarly' , Test , null );
      mojo.__add( 'gnarly' , Test , null );
      expect( mojo.handlers.gnarly.length ).to.equal( 2 );
      mojo.__remove( 'gnarly' , Test );
      expect( mojo.handlers ).to.not.have.property( 'gnarly' );
      done();
    });
    it( 'should remove only handlers matched by event type and handler function' , function( done ) {
      mojo.__add( 'gnarly' , Test , null );
      mojo.__add( 'gnarly' , Test2 , null );
      mojo.__add( 'rad' , Test , null );
      mojo.__add( 'rad' , Test2 , null );
      expect( mojo.handlers.gnarly.length ).to.equal( 2 );
      expect( mojo.handlers.rad.length ).to.equal( 2 );
      mojo.__remove( 'gnarly' , Test );
      mojo.__remove( 'rad' , Test );
      expect( mojo.handlers.gnarly.length ).to.equal( 1 );
      expect( mojo.handlers.rad.length ).to.equal( 1 );
      mojo.$dispel();
      done();
    });
  });

  describe( '#maxWatchers' , function() {
    var initial = mojo.__maxWatchers;
    it( 'should set __maxWatchers if value is a number >= 0' , function( done ) {
      mojo.maxWatchers( 0 );
      expect( mojo.__maxWatchers ).to.equal( 0 );
      mojo.maxWatchers( 20 );
      expect( mojo.__maxWatchers ).to.equal( 20 );
      mojo.maxWatchers( -1 );
      expect( mojo.__maxWatchers ).to.equal( 20 );
      mojo.maxWatchers( null );
      expect( mojo.__maxWatchers ).to.equal( 20 );
      mojo.maxWatchers( undefined );
      expect( mojo.__maxWatchers ).to.equal( 20 );
      mojo.maxWatchers( '5' );
      expect( mojo.__maxWatchers ).to.equal( 20 );
      done();
    });
    it( 'should return __maxWatchers' , function( done ) {
      var max = mojo.maxWatchers();
      expect( max ).to.equal( 20 );
      var max = mojo.maxWatchers( initial );
      expect( max ).to.equal( initial );
      done();
    });
  });

  describe( '$set' , function() {
    it( 'should emit the ' + TestModules.$_EVT.$set + ' event' , function( done ) {
      mojo.$once( '$$set' , function( e , path ) {
        expect( path ).to.equal( 'foo.bar.gnarly' );
        done();
      });
      mojo.$set( 'foo.bar.gnarly' , true );
    });
    it( 'should traverse a route and set the value of the destination' , function( done ) {
      expect( mojo ).to.have.property( 'foo' );
      expect( mojo.foo ).to.have.property( 'bar' );
      expect( mojo.foo.bar ).to.have.property( 'gnarly' );
      expect( mojo.foo.bar.gnarly ).to.equal( true );
      done();
    });
  });

  describe( '$get' , function() {
    it( 'should traverse a route and return the value of the destination' , function( done ) {
      expect(
        mojo.$get( 'foo.bar.gnarly' )
      )
      .to.equal( true );
      done();
    });
  });

  describe( '$unset' , function() {
    it( 'should traverse a route and remove the destination' , function( done ) {
      mojo.$unset( 'foo.bar.gnarly' );
      expect( mojo.foo.bar ).to.not.have.property( 'gnarly' );
      done();
    });
    it( 'should emit the ' + TestModules.$_EVT.$unset + ' event' , function( done ) {
      mojo.$once( '$$unset' , function( e , path ) {
        expect( path ).to.equal( 'foo' );
        expect( mojo ).to.not.have.property( 'foo' );
        done();
      });
      mojo.$unset( 'foo' );
    });
  });

  describe( '$when' , function() {
    it( 'should add an event handler' , function( done ) {
      mojo.$when( 'gnarly' , Test );
      expect( mojo.handlers ).to.have.property( 'gnarly' );
      expect( mojo.handlers.gnarly.length ).to.equal( 1 );
      done();
    });
    it( 'should use subject.handleMOJO when handler is falsy' , function( done ) {
      mojo.$when( 'rad' );
      expect( mojo.handlers.rad[0].func ).to.equal( mojo.handleMOJO );
      mojo.$dispel( 'rad' );
      done();
    });
  });

  describe( '$dispel' , function() {
    it( 'should remove an event handler' , function( done ) {
      mojo.$dispel( 'gnarly' , Test );
      expect( mojo.handlers ).to.not.have.property( 'gnarly' );
      done();
    });
    it( 'should remove all event handlers if no arguments are passed' , function( done ) {
      mojo.$when( 'gnarly' , Test );
      mojo.$when( 'rad' , Test );
      expect( mojo.handlers.gnarly.length ).to.equal( 1 );
      expect( mojo.handlers.rad.length ).to.equal( 1 );
      mojo.$dispel();
      expect( mojo.handlers ).to.not.have.property( 'gnarly' );
      expect( mojo.handlers ).to.not.have.property( 'rad' );
      expect(
        Object.keys( mojo.handlers ).length
      )
      .to
      .equal(
        Object.keys( TestModules.$_EVT ).length
      );
      Object.keys( mojo.handlers ).forEach(function( key ) {
        expect( mojo.handlers[key].length ).to.equal( 1 );
      });
      done();
    });
    it( 'should remove all handlers matched by func when event type is falsy' , function( done ) {
      mojo
        .$when([ 'gnarly' , 'rad' ] , Test )
        .$when([ 'gnarly' , 'rad' ] , Test2 );
      expect( mojo.handlers.gnarly.length ).to.equal( 2 );
      expect( mojo.handlers.rad.length ).to.equal( 2 );
      mojo.$dispel( null , Test );
      expect( mojo.handlers.gnarly.length ).to.equal( 1 );
      expect( mojo.handlers.rad.length ).to.equal( 1 );
      mojo.$dispel();
      done();
    });
  });

  describe( '$once' , function() {
    it( 'should remove an event handler after it is executed' , function( done ) {
      mojo.$once( 'gnarly' , function(){
        expect( mojo.handlers ).to.have.property( 'gnarly' );
      });
      mojo.$emit( 'gnarly' );
      expect( mojo.handlers ).to.not.have.property( 'gnarly' );
      done();
    });
  });

  describe( '$watch' , function() {

    var child1 = new $MOJO({ name: 'child-1' });
    var child2 = new $MOJO({ name: 'child-2' });
    var child3 = new $MOJO({ name: 'child-3' });

    it( 'should throw an error if child is not an instance of $MOJO' , function( done ) {
      expect(function() {
        mojo.$watch( {} );
      })
      .to
      .throw( Error , ( /child must be a \$mojo/i ));
      done();
    });

    it( 'should watch a child for triggered events' , function( done ) {

      child1.$once( 'gnarly' , function( e , data1 , data2 ) {
        expect( e.type ).to.deep.equal( 'gnarly' );
        expect( e.target ).to.deep.equal( child1 );
        expect( e.currentTarget ).to.deep.equal( child1 );
        expect( data1 ).to.deep.equal( 'data1' );
        expect( data2 ).to.deep.equal( 'data2' );
        done();
      });

      mojo.$once( 'gnarly' , function( e , data1 , data2 ) {
        expect( e.type ).to.deep.equal( 'gnarly' );
        expect( e.target ).to.deep.equal( child1 );
        expect( e.currentTarget ).to.deep.equal( mojo );
        expect( data1 ).to.deep.equal( 'data1' );
        expect( data2 ).to.deep.equal( 'data2' );
      });

      mojo.$watch( child1 );
      expect( child1.watchers ).to.include( mojo );
      child1.$emit( 'gnarly' , [ 'data1' , 'data2' ]);
    });

    it( 'should allow events to bubble up the watchers tree' , function( done ) {

      mojo.$once( 'gnarly' , function( e , data1 , data2 ) {
        expect( e.type ).to.deep.equal( 'gnarly' );
        expect( e.target ).to.deep.equal( child2 );
        expect( e.currentTarget ).to.deep.equal( mojo );
        expect( data1 ).to.deep.equal( 'data1' );
        expect( data2 ).to.deep.equal( 'data2' );
        done();
      });

      child1.$watch( child2 );
      expect( child2.watchers ).to.include( child1 );
      expect( child2.watchers.length ).to.equal( 1 );
      child2.$emit( 'gnarly' , [ 'data1' , 'data2' ]);
    });

    it( 'should not allow events to bubble if propagation is stopped' , function( done ) {

      mojo.$when( 'gnarly' , function( e ) {
        assert.ok( false , 'propagation was not stopped' );
      });

      child1.$once( 'gnarly' , function( e ) {
        e.stopPropagation();
      });

      child2.$watch( child3 );
      expect( child3.watchers ).to.include( child2 );
      expect( child3.watchers.length ).to.equal( 1 );
      child3.$emit( 'gnarly' );

      async(function() {
        mojo.$dispel( 'gnarly' );
        done();
      });
    });

    it( 'should integrate seamlessly with $MOJO.aggregate' , function( done ) {

      var agg = $MOJO.aggregate([
        mojo,
        child1,
        child2
      ])
      .$when( 'gnarly' , function( e ) {
        expect( e.currentTarget ).to.deep.equal( child2 );
      });

      child2.$once( 'gnarly' , function( e ) {
        e.stopPropagation();
      });

      child3.$emit( 'gnarly' );

      async(function() {
        agg.$dispel();
        done();
      });
    });

    it( 'should only allow unique watchers' , function( done ) {
      mojo.$watch( child1 );
      expect( child1.watchers.length ).to.equal( 1 );
      mojo.$deref();
      done();
    });
  });

  describe( '$spawn' , function() {

    var level1, level2, level3;

    it( 'should spawn a child mojo' , function( done ) {
      level1 = mojo.$spawn( 'level1' , { name: 'level1' });
      level2 = level1.$spawn( 'level2' , { name: 'level2' });
      level3 = level2.$spawn( 'level3' , { name: 'level3' });
      expect( mojo ).to.have.property( 'level1' );
      expect( level1 ).to.have.property( 'level2' );
      expect( level2 ).to.have.property( 'level3' );
      done();
    });

    it( 'should not allow private events to bubble' , function( done ) {

      var targets = [ mojo , level1 , level2 ];
      var instigator = level3;

      targets.forEach(function( m ) {
        m.$once( '$$rad' , function( e ) {
          done();
        });
      });

      instigator.$emit( '$$rad' );

      async(function() {
        targets.forEach(function( m ) {
          m.$dispel( '$$rad' , null , true );
        });
        done();
      });
    });

    it( 'should allow public events to bubble from child -> parent' , function( done ) {

      var targets = [ mojo , level1 , level2 , level3 ];
      var instigator = level3;

      targets.forEach(function( m ) {
        m.$once( 'rad' , function( e ) {
          var ct = targets.pop();
          expect( e.target ).to.equal( instigator );
          expect( e.currentTarget ).to.equal( ct );
          if (!targets.length) {
            done();
          }
        });
      });

      instigator.$emit( 'rad' );
    });

    it( 'should $deref children when a parent is $deref\'d' , function( done ) {

      var targets = [ level2 , level3 ];
      var instigator = level2;

      targets.forEach(function( m ) {
        m.$once( '$$deref' , function( e ) {
          var target = targets.pop();
          var len = targets.length;
          expect( target.watchers.length ).to.equal( 0 );
          expect( e.target ).to.equal( target );
          expect( e.currentTarget ).to.equal( target );
          async(function() {
            expect(
              Object.keys( target.handlers ).length
            )
            .to.equal(
              Object.keys( TestModules.$_EVT ).length
            );
            Object.keys( TestModules.$_EVT ).forEach(function( key ) {
              var evt = TestModules.$_EVT[key];
              expect( target.handlers[evt].length ).to.equal( 1 );
            });
            if (!len) {
              done();
            }
          });
        });
      });

      instigator.$deref();
    });

    it( 'should $deref children when $unset is called on a $MOJO instance' , function( done ) {
      mojo.$unset( 'level1' );
      expect( level1.watchers.length ).to.equal( 0 );
      expect( mojo.watchers.length ).to.equal( 0 );
      expect( mojo.handlers[ TestModules.$_EVT.$deref ].length ).to.equal( 1 );
      done();
    });
  });

  describe( '$watch (memory leak)' , function() {

    var checker;

    it( 'getting a baseline' , function( done ) {
      MLChecker.getBaseline(function( baseline ) {
        checker = new MLChecker( baseline );
        done();
      });
    });

    it( 'should not cause a memory leak when __maxWatchers is default' , function( done ) {
      checker.good(function() {
        var randoMojo = new $MOJO();
        randoMojo.$watch( mojo );
      })
      .then(function( success ) {
        assert.equal( mojo.watchers.length , mojo.maxWatchers() );
        assert.ok( success );
        done();
      })
      .catch( done );
    });
    
    it( 'should cause a memory leak when __maxWatchers is unlimited' , function( done ) {
      mojo.maxWatchers( 0 );
      checker.bad(function() {
        var randoMojo = new $MOJO();
        randoMojo.$watch( mojo );
      })
      .then(function( success ) {
        assert.ok( success );
        done();
      })
      .catch( done );
    });
    
    it( 'should allow for garbage collection when $deref is called' , function( done ) {
      mojo.maxWatchers( 10 );
      mojo.$deref();
      checker.good(function(){}).then(function( success ) {
        assert.equal( mojo.watchers.length , 0 );
        assert.ok( success );
        done();
      })
      .catch( done );
    });
  });

  describe( '$MOJO.create' , function() {
    it( 'should create a new object that extends the $MOJO prototype' , function( done ) {
      for (var key in $MOJO.prototype) {
        if (key === 'handleMOJO') {
          expect( GNARLY.prototype[key] ).to.not.equal( $MOJO.prototype[key] );
        }
        else {
          expect( GNARLY.prototype[key] ).to.equal( $MOJO.prototype[key] );
        }
      }
      expect( GNARLY.prototype ).to.include.keys( 'tubes' );
      expect( GNARLY.prototype ).to.include.keys( 'handleMOJO' );
      done();
    });
  });

  describe( '$MOJO.construct' , function() {
    it( 'should define required properties for an instance created with $MOJO' , function( done ) {
      var gnarly = new GNARLY();
      expect( gnarly.tubes ).to.be.a( 'function' );
      expect( gnarly.handleMOJO ).to.be.a( 'function' );
      expect( gnarly.handlers ).to.be.an( 'object' );
      expect( gnarly.handleMOJO ).to.not.equal( GNARLY.prototype.handleMOJO );
      done();
    });
    it( 'should define unique handlers objects' , function( done ) {
      var gnarly1 = new GNARLY();
      var gnarly2 = new GNARLY();
      gnarly1.$when( 'rad' , function(){
        assert.ok( false );
      });
      expect( gnarly2.handlers.rad ).to.be.undefined;
      gnarly2.$emit( 'rad' );
      done();
    });
  });

  describe( '$MOJO.aggregate' , function() {

    var mojos = [ 0 , 1 , 2 , 3 ].map(function( i ) {
      return new $MOJO({ name: 'mojo-' + i });
    });

    var aggregator = $MOJO.aggregate( mojos );

    it( 'should aggregate mojos[i].$when' , function( done ) {
      var n = -1;
      aggregator.$when( 'gnarly' , function( e ) {
        expect( e.type ).to.equal( 'gnarly' );
        expect( e.currentTarget ).to.equal( n < 0 ? aggregator : mojos[n] );
        n++;
      });
      mojos.forEach(function( mojo ) {
        expect( mojo.handlers ).to.have.property( 'gnarly' );
        expect( mojo.handlers.gnarly.length ).to.equal( 1 );
      });
      aggregator.$emit( 'gnarly' );
      done();
    });

    it( 'should aggregate mojos[i].$dispel' , function( done ) {
      aggregator.$dispel( 'gnarly' );
      expect( aggregator.handlers ).to.not.have.property( 'gnarly' );
      mojos.forEach(function( mojo ) {
        expect( mojo.handlers ).to.not.have.property( 'gnarly' );
      });
      done();
    });

    it( 'should aggregate mojos[i].$once' , function( done ) {
      var n = -1;
      aggregator.$once( 'gnarly' , function( e ) {
        expect( e.type ).to.equal( 'gnarly' );
        expect( e.currentTarget ).to.equal( n < 0 ? aggregator : mojos[n] );
        n++;
      });
      mojos.forEach(function( mojo ) {
        expect( mojo.handlers ).to.have.property( 'gnarly' );
        expect( mojo.handlers.gnarly.length ).to.equal( 1 );
      });
      aggregator.$emit( 'gnarly' );
      expect( aggregator.handlers ).to.not.have.property( 'gnarly' );
      mojos.forEach(function( mojo ) {
        expect( mojo.handlers ).to.not.have.property( 'gnarly' );
      });
      done();
    });

    it( 'should not aggregate private events' , function( done ) {
      expect(function() {
        aggregator.$when( '$$gnarly' );
      })
      .to
      .throw( Error , ( /private events cannot be aggregated/i ));
      done();
    });
  });

  describe( 'Event' , function() {
    
    var Event = TestModules.Event;
    
    describe( '#isPrivate' , function() {
      it( 'should determine whether an event string is designated as private' , function( done ) {
        assert.ok(
          Event.isPrivate( '$$listener' )
        );
        assert.ok(
          Event.isPrivate( '$$listener.added' )
        );
        assert.ok(
          Event.isPrivate( '$$listener.removed' )
        );
        assert.ok(
          Event.isPrivate( '$$listener.triggered' )
        );
        assert.ok(
          Event.isPrivate( '$$set' )
        );
        assert.ok(
          Event.isPrivate( '$$unset' )
        );
        assert.notOk(
          Event.isPrivate( 'l$$istener' )
        );
        done();
      });
    });
    describe( '#getPublic' , function() {
      it( 'should publicize a private event string' , function( done ) {
        [
          '$$listener',
          '$$listener.added',
          '$$listener.removed',
          '$$listener.triggered',
          '$$set',
          '$$unset'
        ]
        .forEach(function( str ) {
          var pub = Event.getPublic( str );
          var test = Array.prototype.slice.call( str , 2 ).join( '' );
          expect( pub ).to.equal( test );
        });
        done();
      });
    });
  });

  describe( 'EventHandler' , function() {
    it( 'args should be unique to each event occurrence' , function( done ) {

      function handlerFunc( e ) {
        assert.equal( arguments.length , 1 , 'arguments.length should equal 1' );
      }

      var evt = new TestModules.Event.constructor( mojo , 'rad' );
      var evtHandler = new TestModules.EventHandler( handlerFunc , mojo );

      for (var i = 0; i < 10; i++) {
        evtHandler.invoke( evt );
      }
      done();
    });
  });

  describe( 'Private Events' , function() {

    it( 'should not be removed when dispel is called' , function( done ) {
      mojo.$when( '$$gnarly' , Test );
      mojo.$dispel();
      expect( mojo.handlers ).to.have.property( '$$gnarly' );
      done();
    });

    it( 'should be removed when force is true' , function( done ) {
      mojo.$dispel( null , null , true );
      expect( mojo.handlers ).to.not.have.property( '$$gnarly' );
      done();
    });

    it( 'should also emit public events' , function( done ) {
      mojo.$when( 'gnarly' , function( e , data1 , data2 ) {
        expect( e.type ).to.equal( 'gnarly' );
        expect( data1 ).to.equal( 'data1' );
        expect( data2 ).to.equal( 'data2' );
        done();
      });
      mojo.$emit( '$$gnarly' , [ 'data1' , 'data2' ]);
      mojo.$dispel( 'gnarly' );
    });
  });

  describe( 'Locked Events' , function() {

    var events = [ 'gnarly' , 'rad' ];
    var lastEvent = events.slice( 0 ).pop();

    it( 'should never be removed' , function( done ) {
      mojo.$dispel( null , null , true );
      Object.keys( TestModules.$_EVT ).forEach(function( key ) {
        var type = TestModules.$_EVT[key];
        expect( mojo.handlers ).to.have.property( type );
      });
      done();
    });

    describe( TestModules.$_EVT.$when , function() {
      it( 'should be triggered when .$when is called' , function( done ) {
        mojo.$when( TestModules.$_EVT.$when , function( e , type , args ) {
          expect( events ).to.include( type );
          expect( mojo.handlers ).to.have.property( type );
          if (type === lastEvent) {
            mojo.$dispel( TestModules.$_EVT.$when , null , true );
            done();
          }
        });
        mojo.$when( events , Test );
      });
    });

    describe( TestModules.$_EVT.$emit , function() {
      it( 'should be triggered when .$emit is called' , function( done ) {
        mojo.$when( TestModules.$_EVT.$emit , function( e , type , args ) {
          expect( events ).to.include( type );
          if (type === lastEvent) {
            mojo.$dispel( TestModules.$_EVT.$emit , null , true );
            done();
          }
        });
        mojo.$emit( events );
      });
    });

    describe( TestModules.$_EVT.$dispel , function() {
      it( 'should be triggered when .$dispel is called' , function( done ) {
        mojo.$when( TestModules.$_EVT.$dispel , function( e , type ) {
          expect( events ).to.include( type );
          expect( mojo.handlers ).to.not.have.property( type );
          if (type === lastEvent) {
            mojo.$dispel( TestModules.$_EVT.$dispel , null , true );
            done();
          }
        });
        mojo.$dispel( events , Test );
      });
    });

    describe( '$$set' , function() {
      it( 'should be triggered when .$set is called' , function( done ) {
        mojo.$once( '$$set' , function( e , path , args ) {
          expect( path ).to.equal( 'gnarly' );
          expect( args ).to.include( 'gnarly' );
          expect( mojo ).to.have.property( 'gnarly' );
          expect( mojo.gnarly ).to.equal( 'rad' );
        });
        mojo.$once( 'set' , function( e , path ) {
          expect( path ).to.equal( 'gnarly' );
          done();
        });
        mojo.$set( 'gnarly' , 'rad' );
      });
    });

    describe( '$$unset' , function() {
      it( 'should be triggered when .$unset is called' , function( done ) {
        mojo.$once( '$$unset' , function( e , path , args ) {
          expect( path ).to.equal( 'gnarly' );
          expect( args ).to.include( 'gnarly' );
          expect( mojo ).to.not.have.property( 'gnarly' );
        });
        mojo.$once( 'unset' , function( e , path ) {
          expect( path ).to.equal( 'gnarly' );
          done();
        });
        mojo.$unset( 'gnarly' );
      });
    });
  });

  function async( callback ) {
    setTimeout( callback , 1 );
  }

}());



















