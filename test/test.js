(function() {

    'use strict';
    

    var util = require( 'util' );
    var path = require( 'path' );
    var fs = require( 'fs-extra' );
    var chai = require( 'chai' );
    var assert = chai.assert;
    var expect = chai.expect;

    var pkg = fs.readJsonSync(
        path.resolve( __dirname , '../package.json' )
    );

    var MOJO = require(
        path.resolve( __dirname , ( '../' + pkg.main ))
    );

    MOJO.log = function() {
        var args = Array.prototype.map.call( arguments , function( arg ) {
            return util.inspect( arg , { depth: null , colors: true });
        });
        console.log.apply( null , args );
    };


    var mojo = new MOJO();
    function Test(){}
    function Test2(){}
    function Test3(){}

    function GNARLY() {
        MOJO.construct( this );
    }

    GNARLY.prototype = MOJO.create({
        tubes: function() {},
        handleMOJO: function() {}
    });
    
    describe( '#constructor' , function() {
        it( 'should create a new MOJO instance' , function( done ) {
            assert.instanceOf( mojo , MOJO );
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
        it( 'should return a clone if snapshot is true' , function( done ) {
            mojo.__add( 'gnarly' , Test , null );
            var handlers = mojo.__get( null , true );
            var handlerArray = mojo.__get( 'gnarly' , true );
            assert.notStrictEqual( handlers , mojo.handlers , 'object notStrictEqual' );
            assert.notStrictEqual( handlerArray , mojo.handlers.gnarly , 'array notStrictEqual' );
            assert.deepEqual( handlers , mojo.handlers , 'object deepEqual' );
            assert.deepEqual( handlerArray , mojo.handlers.gnarly , 'array deepEqual' );
            mojo.__remove( 'gnarly' );
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

    describe( '#when' , function() {
        it( 'should add an event handler' , function( done ) {
            mojo.$when( 'gnarly' , Test );
            expect( mojo.handlers ).to.have.property( 'gnarly' );
            expect( mojo.handlers.gnarly.length ).to.equal( 1 );
            done();
        });
    });

    describe( '#dispel' , function() {
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
                Object.keys( MOJO.shared.EVENTS ).length
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

    describe( '#once' , function() {
        it( 'should remove an event handler after it is executed' , function( done ) {
            mojo.$once( 'gnarly' , function(){
                expect( mojo.handlers ).to.have.property( 'gnarly' );
            });
            mojo.$emit( 'gnarly' );
            expect( mojo.handlers ).to.not.have.property( 'gnarly' );
            done();
        });
    });

    describe( 'MOJO.create' , function() {
        it( 'should create a new object that extends the MOJO prototype' , function( done ) {
            for (var key in MOJO.prototype) {
                expect( GNARLY.prototype[key] ).to.equal( MOJO.prototype[key] );
            }
            expect( GNARLY.prototype ).to.include.keys( 'tubes' );
            expect( GNARLY.prototype ).to.include.keys( 'handleMOJO' );
            done();
        });
    });

    describe( 'MOJO.construct' , function() {
        it( 'should define required properties for an instance created with MOJO' , function( done ) {
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

    describe( 'Event' , function() {
        
        var Event = MOJO.Event;
        
        describe( '.isPrivate' , function() {
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
    });

    describe( 'EventHandler' , function() {
        it( 'args should be unique to each event occurrence' , function( done ) {

            function handlerFunc( e ) {
                assert.equal( arguments.length , 1 , 'arguments.length should equal 1' );
            }

            var evt = new MOJO.Event( mojo , 'rad' );
            var evtHandler = new MOJO.EventHandler( handlerFunc , mojo );

            for (var i = 0; i < 10; i++) {
                evtHandler.invoke( evt );
            }
            done();
        });
    });

    describe( 'Private Events' , function() {

        it( 'should not be removed when dispel is called' , function( done ) {
            mojo.$dispel();
            Object.keys( MOJO.shared.EVENTS ).forEach(function( key ) {
                var type = MOJO.shared.EVENTS[key];
                expect( mojo.handlers ).to.have.property( type );
            });
            done();
        });
        
        describe( '$$listener' , function() {
            
            var events = [ 'gnarly' , 'rad' ];

            describe( '.added' , function() {
                it( 'should be triggered when an event listener is added' , function( done ) {
                    mojo.$once( '$$listener.added' , function( e , type ) {
                        expect( events ).to.include( type );
                        expect( mojo.handlers ).to.have.property( type );
                    });
                    mojo.$when( events , Test );
                    done();
                });
            });

            describe( '.removed' , function() {
                it( 'should be triggered when an event listener is removed' , function( done ) {
                    mojo.$once( '$$listener.removed' , function( e , type ) {
                        expect( events ).to.include( type );
                        expect( mojo.handlers ).to.not.have.property( type );
                    });
                    mojo.$dispel( events , Test );
                    done();
                });
            });
        });

        describe( '$$set' , function() {
            it( 'should be triggered when .set is called' , function( done ) {
                mojo.$once( '$$set' , function( e , key ) {
                    expect( key ).to.equal( 'gnarly' );
                    expect( mojo ).to.have.property( 'gnarly' );
                    expect( mojo.gnarly ).to.equal( 'rad' );
                });
                mojo.set( 'gnarly' , 'rad' );
                done();
            });
        });

        describe( '$$unset' , function() {
            it( 'should be triggered when .unset is called' , function( done ) {
                mojo.$once( '$$unset' , function( e , key ) {
                    expect( key ).to.equal( 'gnarly' );
                    expect( mojo ).to.not.have.property( 'gnarly' );
                });
                mojo.unset( 'gnarly' );
                done();
            });
        });
    });

    function async( callback ) {
        setTimeout( callback , 1 );
    }

}());



















