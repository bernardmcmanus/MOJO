

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
            var args = arguments;
            var e = shift( args );

            /*if (Event.isPrivate( e.type )) {
                that.$emit( Event.getPublic( e.type ) , args );
            }*/
        };

        proto.handleMOJO = function() {};

        proto.$set = function( key , value ) {
            var that = this;
            that[key] = value;
            that.$emit( EVENTS.set , key );
            return that;
        };

        proto.$unset = function( key ) {
            var that = this;
            del( that , key );
            that.$emit( EVENTS.unset , key );
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



















