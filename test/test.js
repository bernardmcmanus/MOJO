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
        MOJO.Construct( this );
    }

    GNARLY.prototype = MOJO.Create({
        tubes: function() {},
        handleMOJO: function() {}
    });
    
    describe( '#constructor' , function() {
        it( 'should create a new MOJO instance' , function( done ) {
            assert.instanceOf( mojo , MOJO );
            done();
        });
    });

    describe( '#when' , function() {
        it( 'should add an event handler when a string is passed' , function( done ) {
            mojo.when( 'gnarly' , Test );
            expect( mojo.handlers ).to.have.property( 'gnarly' );
            expect( mojo.handlers.gnarly.length ).to.equal( 1 );
            mojo.handlers.gnarly = [];
            done();
        });
        it( 'should add multiple handlers when an array is passed' , function( done ) {
            mojo.when([ 'gnarly' , 'rad' ], Test );
            expect( mojo.handlers ).to.have.property( 'gnarly' );
            expect( mojo.handlers.gnarly.length ).to.equal( 1 );
            expect( mojo.handlers.rad.length ).to.equal( 1 );
            mojo.handlers.gnarly = [];
            mojo.handlers.rad = [];
            done();
        });
    });

    describe( '#dispel' , function() {
        it( 'should remove an event handler' , function( done ) {
            mojo.dispel( 'gnarly' , Test );
            expect( mojo.handlers.gnarly.length ).to.equal( 0 );
            done();
        });
        it( 'should remove all event handlers if no arguments are passed' , function( done ) {
            mojo.when( 'gnarly' , Test );
            mojo.when( 'rad' , Test );
            expect( mojo.handlers.gnarly.length ).to.equal( 1 );
            expect( mojo.handlers.rad.length ).to.equal( 1 );
            mojo.dispel();
            expect( mojo.handlers ).to.not.have.property( 'gnarly' );
            expect( mojo.handlers ).to.not.have.property( 'rad' );
            expect(
                Object.keys( mojo.handlers ).length
            )
            .to
            .equal( 0 );
            done();
        });
        it( 'should remove all handlers matched by func when event type is falsy' , function( done ) {
            mojo
                .when([ 'gnarly' , 'rad' ] , Test )
                .when([ 'gnarly' , 'rad' ] , Test2 );
            expect( mojo.handlers.gnarly.length ).to.equal( 2 );
            expect( mojo.handlers.rad.length ).to.equal( 2 );
            mojo.dispel( null , Test );
            expect( mojo.handlers.gnarly.length ).to.equal( 1 );
            expect( mojo.handlers.rad.length ).to.equal( 1 );
            mojo.dispel();
            done();
        });
    });

    describe( '#once' , function() {
        it( 'should remove an event handler after it is executed' , function( done ) {
            mojo.once( 'gnarly' , function(){
                expect( mojo.handlers.gnarly.length ).to.equal( 1 );
            });
            mojo.happen( 'gnarly' );
            expect( mojo.handlers.gnarly.length ).to.equal( 0 );
            done();
        });
    });

    describe( 'MOJO.Create' , function() {
        it( 'should create a new object that extends the MOJO prototype' , function( done ) {
            for (var key in MOJO.prototype) {
                expect( GNARLY.prototype[key] ).to.equal( MOJO.prototype[key] );
            }
            expect( GNARLY.prototype ).to.include.keys( 'tubes' );
            expect( GNARLY.prototype ).to.include.keys( 'handleMOJO' );
            done();
        });
    });

    describe( 'MOJO.Construct' , function() {
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
            gnarly1.when( 'rad' , function(){
                assert.ok( false );
            });
            expect( gnarly2.handlers.rad ).to.be.undefined;
            gnarly2.happen( 'rad' );
            done();
        });
    });

    function async( callback ) {
        setTimeout( callback , 1 );
    }

}());



















