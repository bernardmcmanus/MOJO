

function MOJO( seed ) {
    var that = this;
    that.__init( that , ( seed || {} ));
}


MOJO.__ready = function() {

    MOJO.inject( 'prototype', [
        MOJO,
        'Event',
        'when',
        'construct',
        'ocreate',
        'shift',
        'pop',
        'slice',
        'length',
        'del',
        'EVENTS'
    ],
    function(
        MOJO,
        Event,
        when,
        construct,
        ocreate,
        shift,
        pop,
        slice,
        length,
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

            /*var emit = false;
            var pubArgs, type;

            switch (e.type) {

                case EVENTS.$when:
                case EVENTS.$emit:
                case EVENTS.$dispel:
                    type = shift( args );
                    pubArgs = pop( args );
                    emit = (Event.getPublic( e.type ) !== type);
                break;

                case EVENTS.$set:
                case EVENTS.$unset:
                    emit = true;
                break;
            }*/

            var type = shift( args );
            var pubArgs = pop( args );
            var emit = (Event.getPublic( e.type ) !== type);

            //MOJO.log(e.type + ' -> ' + type);
            //MOJO.log(e.type,pubArgs);

            if (emit) {
                that.$emit( Event.getPublic( e.type ) , pubArgs );
            }

            if (e.type === EVENTS.$emit && Event.isPrivate( type )) {
                that.$emit( Event.getPublic( type ) , pop( pubArgs ));
            }
        };

        /*proto.__handleMOJO = function() {

            var that = this;
            var args = slice( arguments );
            var e = shift( args );
            var emit = false;
            var pubArgs, type;

            switch (e.type) {

                case EVENTS.$when:
                case EVENTS.$emit:
                case EVENTS.$dispel:
                    type = args[0];
                    pubArgs = args;
                    //pubArgs = [];
                    emit = (Event.getPublic( e.type ) !== type);
                    if (!Event.isPrivate( type )) {
                        MOJO.log(e.type);
                        pubArgs = pop( pubArgs );
                    }
                break;

                case EVENTS.$set:
                case EVENTS.$unset:
                    emit = true;
                break;
            }

            if (e.type === EVENTS.$emit && type === 'gnarly') {
                MOJO.log(pubArgs[2]);
            }

            //MOJO.log(e.type + ' -> ' + type);

            if (emit) {
                that.$emit( Event.getPublic( e.type ) , args );
            }

            if (Event.isPrivate( type )) {
                that.$emit( Event.getPublic( type ) , pubArgs );
            }
        };*/

        proto.handleMOJO = function() {};

        proto.$set = function( key , value ) {
            var that = this;
            that[key] = value;
            that.$emit( EVENTS.set , [ key , [ key ]]);
            return that;
        };

        proto.$unset = function( key ) {
            var that = this;
            del( that , key );
            that.$emit( EVENTS.unset , [ key , [ key ]]);
            return that;
        };

        proto.$subscribe = function( subscriber ) {

        };

        proto.$enq = function( task ) {
            var that = this;
            that.stack.push( task );
        };

        proto.$digest = function() {
            
            var that = this;
            var stack = that.stack;

            if (that.inprog) {
                //MOJO.log('--- INPROG ---',stack.length);
                return;
            }

            that.inprog = true;

            while (length( stack ) > 0) {
                shift( stack )();
            }
            
            that.inprog = false;
        };

        /*proto.spawn = function( instance ) {
            
            instance = instance || {};
            instance = instance.handleMOJO ? instance : new MOJO( instance );

            var that = this;

            instance.bubbleRoute.push( that );
            
            return that;
        };*/

        del( MOJO , '__ready' );

        return proto;
    });
};



















