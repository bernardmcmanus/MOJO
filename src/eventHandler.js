MOJO.inject( 'EventHandler' , [ 'ensureArray' ] , function( ensureArray ) {

    
    function EventHandler( func , context , bindArgs ) {

        var that = this;

        that.func = func;
        that.active = true;
        that.locked = false;
        that.callback = function() {};

        bindArgs = ensureArray( bindArgs );

        that.invoke = function( event , invArgs ) {
            
            if (!that.active || event.cancelBubble) {
                return;
            }

            var args = bindArgs
                .slice( 0 )
                .concat(
                    ensureArray( invArgs )
                );

            args.unshift( event );
            func.apply( context , args );
            that.callback( event , func );
        };
    }


    return EventHandler;

});



















