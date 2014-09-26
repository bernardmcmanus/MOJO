MOJO.EventHandler = MOJO.inject([ 'ensureArray' , 'PROTO' ] , function( ensureArray , PROTO ) {


    function EventHandler( func , context , args ) {

        var that = this;

        that.func = func;
        that.active = true;
        that.callback = function() {};

        args = ensureArray( args );

        that.invoke = function( event , invArgs ) {
            
            if (!that.active || event.isBreak || event.isSkip( func )) {
                return;
            }

            args = args.concat(
                ensureArray( invArgs )
            );

            args.unshift( event );
            func.apply( context , args );
            that.callback( event , func );
        };
    }


    /*
        function EventHandler( func , context , args ) {

            var that = this;

            that.func = func;
            that.context = context;
            that.active = true;
            that.callback = function() {};

            that.args = ensureArray( args );
        }


        EventHandler[ PROTO ] = {

            invoke: function( event , args ) {
                
                var that = this;
                var func = that.func;

                if (!that.active || event.isBreak || event.isSkip( func )) {
                    return;
                }

                var Args = that.args.concat(
                    ensureArray( args )
                );

                Args.unshift( event );
                func.apply( that.context , Args );
                that.callback( event , func );
            }
        };
    */


    return EventHandler;

});



















