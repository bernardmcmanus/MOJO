define([ 'inject' , 'MOJO' , 'Event' ],

function( inject , MOJO , Event ) {

    return inject(
    [
        Error,
        'keys',
        'forEach',
        'EVENTS'
    ],
    function(
        Error,
        keys,
        forEach,
        EVENTS
    ){

        function aggregate( arr ) {

            var er = new MOJO();

            forEach( arr , function( ee ) {
                forEach(keys( EVENTS ) , function( key ) {
                    er.$when( EVENTS[key] , function( e , type , args ) {
                        if (Event.isPrivate( type )) {
                            throw new Error( 'private events cannot be aggregated');
                        }
                        ee[key].apply( ee , args );
                    });
                });
            });

            return er;
        }

        return aggregate;
    });
});



















