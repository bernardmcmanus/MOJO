

function MOJO( seed ) {
    var that = this;
    that.__init( that , ( seed || {} ));
}


MOJO.__ready = function() {

    MOJO.inject( 'prototype', [
        Error,
        MOJO,
        'Event',
        'when',
        'construct',
        'ocreate',
        'shift',
        'pop',
        'slice',
        'length',
        'is',
        'del',
        'EVENTS'
    ],
    function(
        Error,
        MOJO,
        Event,
        when,
        construct,
        ocreate,
        shift,
        pop,
        slice,
        length,
        is,
        del,
        EVENTS
    ){

        var proto = ocreate( when );

        proto.__init = function( that , seed ) {
            for (var key in seed) {
                that[key] = seed[key];
            }
            construct( that );
        };

        proto.__handleMOJO = function() {

            var that = this;
            var args = slice( arguments );
            var e = shift( args );

            /*var shouldEmit = false;
            var pubArgs, type;

            switch (e.type) {

                case EVENTS.$when:
                case EVENTS.$emit:
                case EVENTS.$dispel:
                    type = shift( args );
                    pubArgs = pop( args );
                    shouldEmit = (Event.getPublic( e.type ) !== type);
                break;

                case EVENTS.$set:
                case EVENTS.$unset:
                    shouldEmit = true;
                break;
            }*/

            var type = shift( args );
            var pubArgs = pop( args );
            var shouldEmit = (Event.getPublic( e.type ) !== type);

            /*if (e.type === '$$listener.triggered' && type === '$$gnarly') {
                MOJO.log(pubArgs);
            }*/

            //MOJO.log(e.type + ' -> ' + type);
            //MOJO.log(e.type,pubArgs);

            if (shouldEmit) {
                that.$emit( Event.getPublic( e.type ) , pubArgs );
            }

            if (e.type === EVENTS.$emit && !Event.isPrivate( type )) {
                //MOJO.log(pubArgs);
                that.watchers.forEach(function( watcher ) {
                    //MOJO.log(watcher);
                    watcher.$emit.apply( watcher , pubArgs );
                });
            }

            if (e.type === EVENTS.$emit && Event.isPrivate( type )) {
                /*var pubArgs2 = pubArgs.slice( 0 );
                pubArgs2[0] = Event.getPublic( type );
                //that.$emit.apply( that , pubArgs );
                MOJO.log(pubArgs2);
                MOJO.log(pubArgs);*/
                that.$emit( Event.getPublic( type ) , pubArgs[1] );
            }
        };

        proto.handleMOJO = function() {};

        proto.$set = function( key , value ) {
            var that = this;
            that[key] = value;
            that.$emit( EVENTS.$set , [ key , [ key ]]);
            return that;
        };

        proto.$unset = function( key ) {
            var that = this;
            del( that , key );
            that.$emit( EVENTS.$unset , [ key , [ key ]]);
            return that;
        };

        proto.$watch = function( parent ) {
            
            var that = this;

            if (!is( parent , MOJO )) {
                throw new Error( 'parent must be a MOJO' );
            }

            var watchers = parent.watchers;

            if (watchers.indexOf( that ) < 0) {

                watchers.push( that );

                that.$once( EVENTS.$deref , function( e ) {
                    var i = watchers.indexOf( that );
                    if (i >= 0) {
                        watchers.splice( i , 1 );
                    }
                });
            }

            return that;
        };

        proto.$deref = function() {
            var that = this;
            that.$emit( EVENTS.$deref );
            //that.$dispel( null , null , true );
        };

        proto.$enq = function( task ) {
            var that = this;
            that.__stack.push( task );
        };

        proto.$digest = function() {
            
            var that = this;
            var stack = that.__stack;

            if (that.__inprog) {
                //MOJO.log('--- INPROG ---',stack.length);
                return;
            }

            that.__inprog = true;

            while (length( stack ) > 0) {
                shift( stack )();
            }
            
            that.__inprog = false;
        };

        del( MOJO , '__ready' );

        return proto;
    });
};



















