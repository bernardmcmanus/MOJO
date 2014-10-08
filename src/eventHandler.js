MOJO.EventHandler = MOJO.inject([ 'ensureArray' , 'PROTO' ] , function( ensureArray , PROTO ) {


    function EventHandler( func , context , args ) {

        var that = this;

        that.func = func;
        that.active = true;
        that.callback = function() {};

        args = ensureArray( args );

        that.invoke = function( event , invArgs ) {
            
            if (!that.active || event.isBreak) {
                return;
            }

            var handlerArgs = args
                .slice( 0 )
                .concat(
                    ensureArray( invArgs )
                );

            handlerArgs.unshift( event );
            func.apply( context , handlerArgs );
            that.callback( event , func );
        };
    }


    return EventHandler;

});



















