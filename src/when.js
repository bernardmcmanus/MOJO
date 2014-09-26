MOJO.when = MOJO.inject(
[
    'EventHandler',
    'Event',
    'keys',
    'ocreate',
    'shift',
    'pop',
    'ensureArray',
    'length',
    'getHandlerFunc',
    'isArray',
    'del'
],
function(
    EventHandler,
    Event,
    keys,
    ocreate,
    shift,
    pop,
    ensureArray,
    length,
    getHandlerFunc,
    isArray,
    del
){


    function indexOfHandler( handlerArray , func ) {
        return ensureArray( handlerArray )
            .map(function( eventHandler ) {
                return eventHandler.func;
            })
            .indexOf( func );
    }


    function eachEventType( eventType , callback ) {
        ensureArray( eventType ).forEach( callback );
    }
    

    function getHandlerContext( handler , func ) {
        return handler === func ? null : handler;
    }


    return {

        once: function() {

            var that = this;
            var eventHandlers = that.__when( arguments );
            
            eventHandlers.forEach(function( evtHandler ) {
                evtHandler.callback = function() {
                    this.active = false;
                };
            });

            return that;
        },

        when: function() {
            var that = this;
            that.__when( arguments );
            return that;
        },

        happen: function( eventType , args ) {

            var that = this;

            eventType = that._ensureEType( eventType );

            eachEventType( eventType , function( type ) {

                var handlers = that.__get( type , true );
                var event = new Event( that , type );

                handlers
                .filter(function( evtHandler ) {
                    evtHandler.invoke( event , args );
                    return !evtHandler.active;
                })
                .forEach(function( evtHandler ) {
                    that.__remove( type , evtHandler.func );
                });
            });

            return that;
        },

        dispel: function( eventType , MOJOHandler ) {

            var that = this;
            var handlers = that.__get();
            var func = getHandlerFunc( MOJOHandler );

            eventType = that._ensureEType( eventType );

            eachEventType( eventType , function( type ) {
                that.__remove( type , func );
            });

            return that;
        },

        __when: function( args ) {

            var that = this;
            var eventType = shift( args );
            var MOJOHandler = pop( args );
            var bindArgs = args[0];
            
            var handlerArray = [];
            var func = getHandlerFunc( MOJOHandler );
            var context = getHandlerContext( MOJOHandler , func );

            eachEventType( eventType , function( type , i ) {
                handlerArray.push(
                    that.__add( type , func , context , bindArgs )
                );
            });
            
            return handlerArray;
        },

        _ensureEType: function( eventType ) {
            return eventType || keys( this.handlers );
        },

        __get: function( eventType , snapshot ) {
            
            var that = this;
            var handlers = that.handlers;
            var response = (eventType ? ensureArray( handlers[eventType] ) : handlers);

            if (snapshot) {
                response = isArray( response ) ? response.slice( 0 ) : ocreate( response );
            }

            return response;
        },

        __add: function( type , func , context , args ) {
            
            var that = this;
            var eventHandler = new EventHandler( func , context , args );
            var handlerArray = that.__get( type );

            handlerArray.push( eventHandler );
            that.handlers[type] = handlerArray;

            return eventHandler;
        },

        __remove: function( type , func ) {

            var that = this;
            var handlers = that.__get();
            var handlerArray = that.__get( type );
            var index = indexOfHandler( handlerArray , func );
            
            if (index >= 0) {
                handlerArray.splice( index , 1 );
            }
            
            if (!length( handlerArray ) || !func) {
                del( handlers , type );
            }
            else {
                handlers[type] = handlerArray;
            }
        }
    };
});



















