MOJO.construct = MOJO.inject(
[
    Object,
    'keys',
    'descriptor',
    'length'
],
function(
    Object,
    keys,
    descriptor,
    length
){


    /*
    **  When MOJO.create is used to create a prototype, call
    **  MOJO.construct( instance ) within your object's constructor
    **  to define key properties on the object's uppermost level
    */


    function construct( subject ) {

        var handlers = {};

        Object.defineProperties( subject , {

            handlers: descriptor(function() {
                return handlers;
            }),

            /*keys: descriptor(function() {
                return keys( subject );
            }),

            length: descriptor(function() {
                return length( subject.keys );
            }),*/

            handleMOJO: {
                value: (subject.handleMOJO || function() {}).bind( subject ),
                configurable: true
            }
        });
    }


    return construct;

});



















