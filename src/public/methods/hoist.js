MOJO.Hoist = (function() {


    /*
    **
    **  When MOJO is used to construct a prototype, call
    **  MOJO.Hoist( instance ) within your object's constructor
    **  to set the appropriate context of properties
    **
    */


    var Object_defineProperty = Object.defineProperty;


    function Hoist( subject ) {

        var handlers = {};

        Object_defineProperty( subject , 'handlers' , {
            get: function() {
                return handlers;
            },
            set: function( value ) {
                handlers = value;
            },
            configurable: true
        });

        Object_defineProperty( subject , 'keys' , {
            get: function() {
                return Object.keys( subject );
            }
        });

        Object_defineProperty( subject , 'values' , {
            get: function() {
                return subject.keys.map(function( key , i ) {
                    return subject[key];
                });
            }
        });

        Object_defineProperty( subject , 'length' , {
            get: function() {
                return subject.keys.length;
            }
        });
    }


    return Hoist;

    
}());



























