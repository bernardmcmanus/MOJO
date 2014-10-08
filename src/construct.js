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


    function construct( subject ) {

        var handlers = {};

        Object.defineProperties( subject , {

            handlers: descriptor(function() {
                return handlers;
            }),

            handleMOJO: {
                value: (subject.handleMOJO || function() {}).bind( subject ),
                configurable: true
            }
        });
    }


    return construct;

});



















