MOJO.EventHandler = MOJO.inject([
    'defProp',
    'ensureArray',
    'PROTO'
],
function(
    defProp,
    ensureArray,
    PROTO
){


    function EventHandler( func , context , args ) {

        var that = this;

        that.func = func;
        that.active = true;
        that.callback = function() {};

        args = ensureArray( args );

        defProp( that , 'locked' , {
            value: (context && context.__handleMOJO === func)
        });

        that.invoke = function( event , invArgs ) {
            
            if (!that.active) {
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



















