MOJO.construct = MOJO.inject(
[
    'keys',
    'defProp',
    'descriptor',
    'length',
    'EVENTS'
],
function(
    keys,
    defProp,
    descriptor,
    length,
    EVENTS
){

    var HANDLE_MOJO = 'handleMOJO';
    var __HANDLE_MOJO = '__' + HANDLE_MOJO;


    function construct( subject ) {

        var handlers = {};

        defProp( subject , 'handlers' , descriptor(function() {
            return handlers;
        }));

        defProp( subject , __HANDLE_MOJO , {
            value: subject[ __HANDLE_MOJO ].bind( subject )
        });

        defProp( subject , HANDLE_MOJO , {
            value: (subject[ HANDLE_MOJO ] || function() {}).bind( subject )
        });

        /*defProp( subject , 'bubbleRoute' , {
            value: []
        });*/

        keys( EVENTS ).forEach(function( key ) {
            var evt = EVENTS[key];
            subject.__add( evt , subject[ __HANDLE_MOJO ] , subject );
        });
    }


    return construct;

});



















