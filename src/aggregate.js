MOJO.inject( 'aggregate' ,
[
    MOJO,
    'forEach',
    'EVENTS'
],
function(
    MOJO,
    forEach,
    EVENTS
){

    function aggregate( arr ) {

        var parent = new MOJO();

        forEach( arr , function( child ) {

            parent

            .$when( EVENTS.$when , function( e , type , func , args ) {
                child.$when( type , args , func );
            })

            .$when( EVENTS.$emit , function( e , type , originalEvent , args ) {
                child.$emit( type , args , originalEvent );
            })

            .$when( EVENTS.$dispel , function( e , type , func ) {
                child.$dispel( type , func );
            })

            .$when( EVENTS.$set , function( e , key ) {
                child.set( key , parent[key] );
            })

            .$when( EVENTS.$unset , function( e , key ) {
                child.unset( key );
            });
        });

        return parent;
    }

    return aggregate;
});



















