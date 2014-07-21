MOJO.Hoist = (function() {


    /*
    **  When MOJO is used to construct a prototype, call
    **  MOJO.Hoist( instance ) within your object's constructor
    **  to define key properties on the object's top level
    */


    function Hoist( subject ) {

        var handlers = {};

        Object.defineProperties( subject , {

            handlers: {
                get: function() {
                    return handlers;
                },
                configurable: true
            },

            keys: {
                get: function() {
                    return Object.keys( subject );
                },
                configurable: true
            },

            values: {
                get: function() {
                    return subject.keys.map(function( key ) {
                        return subject[key];
                    });
                },
                configurable: true
            },

            length: {
                get: function() {
                    return subject.keys.length;
                },
                configurable: true
            }
        });
    }


    return Hoist;

    
}());



























