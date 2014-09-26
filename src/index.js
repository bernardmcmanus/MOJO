

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
        'PROTO'
    ],
    function(
        MOJO,
        when,
        construct,
        ocreate,
        del,
        PROTO
    ){

        var MOJO_prototype = (MOJO[ PROTO ] = ocreate( when ));

        MOJO_prototype.__init = function( that , seed ) {

            for (var key in seed) {
                that[key] = seed[key];
            }

            construct( that );
        };

        MOJO_prototype.set = function( key , value ) {
            var that = this;
            that[key] = value;
            that.happen( 'set' , key );
            return that;
        };

        MOJO_prototype.unset = function( key ) {
            var that = this;
            del( that , key );
            that.happen( 'unset' , key );
            return that;
        };

        del( MOJO , '__ready' );
    });
};



















