MOJO.inject( 'construct' ,
[
    'keys',
    'defProp',
    'length',
    'EVENTS'
],
function(
    keys,
    defProp,
    length,
    EVENTS
){

    var HANDLE_MOJO = 'handleMOJO';
    var __HANDLE_MOJO = '__' + HANDLE_MOJO;


    function construct( subject ) {

        var inprog = false;

        defProp( subject , '__inprog' , {
            get: function() {
                return inprog;
            },
            set: function( value ) {
                inprog = value;
            }
        });

        defProp( subject , '__stack' , {
            value: []
        });

        defProp( subject , 'handlers' , {
            value: {}
        });

        defProp( subject , 'watchers' , {
            value: []
        });

        defProp( subject , HANDLE_MOJO , {
            value: subject[ HANDLE_MOJO ].bind( subject )
        });

        defProp( subject , __HANDLE_MOJO , {
            value: subject[ __HANDLE_MOJO ].bind( subject )
        });

        keys( EVENTS ).forEach(function( key ) {
            var evt = EVENTS[key];
            var evtHandler = subject.__add( evt , subject[ __HANDLE_MOJO ] , subject );
            evtHandler.locked = true;
        });
    }


    return construct;

});



















