define([] , function() {

    return function( subject ) {

        var inprog = false;

        $_defineProperty( subject , '__stack' , {
            value: []
        });

        $_defineProperty( subject , '__inprog' , {
            get: function() {
                return inprog;
            },
            set: function( value ) {
                inprog = value;
            }
        });

        $_defineProperty( subject , '__events' , {
            get: function() {
                return $_keys( subject.handlers );
            }
        });

        $_defineProperty( subject , 'handlers' , {
            value: {}
        });

        $_defineProperty( subject , 'watchers' , {
            value: []
        });

        $_defineProperty( subject , $_HANDLE_MOJO , {
            value: $_ensureFunc( subject[ $_HANDLE_MOJO ] ).bind( subject )
        });

        $_defineProperty( subject , __$_HANDLE_MOJO , {
            value: subject[ __$_HANDLE_MOJO ].bind( subject )
        });

        $_forEach( $_keys( $_EVT ) , function( key ) {
            var evt = $_EVT[key];
            var evtHandler = subject.__add( evt , subject[ __$_HANDLE_MOJO ] , subject );
            evtHandler.locked = true;
        });
    };
});



















