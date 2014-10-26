define([ 'MOJO' , 'Event' ],

function( MOJO , Event ) {

    return function( arr ) {

        var aggregator = new MOJO();

        $_forEach( arr , function( aggregatee ) {
            $_forEach( $_keys( $_EVT ) , function( key ) {
                aggregator.$when( $_EVT[key] , function( e , type , args ) {
                    if (Event.isPrivate( type )) {
                        throw new $Error( 'private events cannot be aggregated' );
                    }
                    aggregatee[key].apply( aggregatee , args );
                });
            });
        });

        return aggregator;
    };
});



















