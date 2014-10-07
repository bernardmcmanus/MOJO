(function() {
    

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


    var mojo = new MOJO();
    function TEST(){}

    
    describe( '#constructor' , function() {
        it( 'should create a new MOJO instance' , function( done ) {
            assert.instanceOf( mojo , MOJO );
            done();
        });
    });

    describe( '#__add' , function() {
        it( 'should push to the handlers[type] array' , function( done ) {
            mojo.__add( 'gnarly' , TEST , null );
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
            mojo.__add( 'gnarly' , TEST , null );
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
            mojo.__remove( 'gnarly' , TEST );
            expect( mojo.handlers ).to.not.have.property( 'gnarly' );
            done();
        });

        it( 'should delete the handlers[type] array if func is falsy' , function( done ) {
            mojo.__add( 'gnarly' , TEST , null );
            expect( mojo.handlers.gnarly.length ).to.equal( 1 );
            mojo.__remove( 'gnarly' );
            expect( mojo.handlers ).to.not.have.property( 'gnarly' );
            done();
        });
    });

    describe( '#when' , function() {
        it( 'should add an event handler' , function( done ) {
            mojo.when( 'gnarly' , TEST );
            expect( mojo.handlers ).to.have.property( 'gnarly' );
            expect( mojo.handlers.gnarly.length ).to.equal( 1 );
            done();
        });
    });

    describe( '#dispel' , function() {
        it( 'should remove an event handler' , function( done ) {
            mojo.dispel( 'gnarly' , TEST );
            expect( mojo.handlers ).to.not.have.property( 'gnarly' );
            done();
        });
    });

    describe( '#once' , function() {
        it( 'should remove an event handler after it is executed' , function( done ) {
            mojo.once( 'gnarly' , function(){
                expect( mojo.handlers ).to.have.property( 'gnarly' );
            });
            mojo.happen( 'gnarly' );
            expect( mojo.handlers ).to.not.have.property( 'gnarly' );
            done();
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

    function async( callback ) {
        setTimeout( callback , 1 );
    }

}());



















