MOJO.Construct = (function() {


    /*
    **  When MOJO.Create is used to create a prototype, call
    **  MOJO.Construct( instance ) within your object's constructor
    **  to define key properties on the object's uppermost level
    */


    function Construct( subject ) {

        var handlers = {};

        Object.defineProperties( subject , {

            handlers: createDescriptor(function() {
                return handlers;
            }),

            keys: createDescriptor(function() {
                return Object.keys( subject );
            }),

            values: createDescriptor(function() {
                return subject.keys.map(function( key ) {
                    return subject[key];
                });
            }),

            length: createDescriptor(function() {
                return subject.keys.length;
            })
        });
    }


    function createDescriptor( getter ) {
        return {
            get: getter,
            configurable: true
        };
    }


    return Construct;

    
}());



























