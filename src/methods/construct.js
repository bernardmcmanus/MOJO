MOJO.Construct = (function( Object , _MOJO ) {


    /*
    **  When MOJO.Create is used to create a prototype, call
    **  MOJO.Construct( instance ) within your object's constructor
    **  to define key properties on the object's uppermost level
    */


    var Shared = _MOJO.Shared;


    var Keys = Shared.keys;
    var Descriptor = Shared.descriptor;
    var Length = Shared.length;


    function Construct( subject ) {

        var handlers = {};

        Object.defineProperties( subject , {

            handlers: {
                get: function() {
                    return handlers;
                },
                set: function( value ) {
                    handlers = value;
                },
                configurable: true
            },

            keys: Descriptor(function() {
                return Keys( subject );
            }),

            length: Descriptor(function() {
                return Length( subject.keys );
            }),

            handleMOJO: {
                value: (subject.handleMOJO || function() {}).bind( subject ),
                configurable: true
            }
        });
    }


    return Construct;

    
}( Object , _MOJO ));



























