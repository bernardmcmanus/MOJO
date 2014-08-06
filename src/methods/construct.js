MOJO.Construct = (function( Object , Shared ) {


    /*
    **  When MOJO.Create is used to create a prototype, call
    **  MOJO.Construct( instance ) within your object's constructor
    **  to define key properties on the object's uppermost level
    */


    var Keys = Shared.keys;
    var Descriptor = Shared.descriptor;
    var Length = Shared.length;


    function Construct( subject ) {

        var handlers = {};

        Object.defineProperties( subject , {

            handlers: Descriptor(function() {
                return handlers;
            }),

            keys: Descriptor(function() {
                return Keys( subject );
            }),

            length: Descriptor(function() {
                return Length( subject.keys );
            })
        });
    }


    return Construct;

    
}( Object , _MOJO.Shared ));



























