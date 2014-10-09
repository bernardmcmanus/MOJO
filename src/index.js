

function MOJO( seed ) {
    var that = this;
    that.__init( that , ( seed || {} ));
}


MOJO.__ready = function() {

    MOJO.inject(
    [
        MOJO,
        'when',
        'construct',
        'ocreate',
        'del',
        'EVENTS',
        'PROTO'
    ],
    function(
        MOJO,
        when,
        construct,
        ocreate,
        del,
        EVENTS,
        PROTO
    ){

        var MOJO_prototype = (MOJO[ PROTO ] = ocreate( when ));

        MOJO_prototype.__init = function( that , seed ) {

            for (var key in seed) {
                that[key] = seed[key];
            }

            construct( that );
        };

        MOJO_prototype.__handleMOJO = function( e ) {

            switch (e.type) {

                case EVENTS.$when:
                    //MOJO.log(e.type,arguments[1]);
                break;

                case EVENTS.$dispel:
                    //MOJO.log(e.type,arguments[1]);
                break;

                case EVENTS.set:
                    //MOJO.log(e.type,arguments[1]);
                break;

                case EVENTS.unset:
                    //MOJO.log(e.type,arguments[1]);
                break;
            }
        };

        MOJO_prototype.set = function( key , value ) {
            var that = this;
            that[key] = value;
            that.$emit( EVENTS.set , key );
            return that;
        };

        MOJO_prototype.unset = function( key ) {
            var that = this;
            del( that , key );
            that.$emit( EVENTS.unset , key );
            return that;
        };

        /*MOJO_prototype.spawn = function( instance ) {
            
            instance = instance || {};
            instance = instance.handleMOJO ? instance : new MOJO( instance );

            var that = this;

            instance.bubbleRoute.push( that );
            
            return that;
        };*/

        del( MOJO , '__ready' );
    });
};



















