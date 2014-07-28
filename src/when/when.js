_MOJO.When = (function( EventHandler , Event ) {


    return {

        once: function() {

            var that = this;
            var handlers = that.when.apply( that , arguments );
            
            handlers.forEach(function( eventHandler ) {
                eventHandler.callback = function() {
                    this.active = false;
                };
            });
        },

        when: function() {

            var that = this;
            var args = arguments;
            var eventType = shift( args );
            var bindArgs = args.length > 1 ? shift( args ) : bindArgs;
            var handlerFunc = shift( args );
            var eventHandlers = [];

            eachEventType( eventType , function( type , i ) {
                eventHandlers.push(
                    new EventHandler( handlerFunc , bindArgs )
                );
                that._addHandler( type , eventHandlers[i] );
            });
            
            return eventHandlers;
        },

        happen: function( eventType , args ) {

            var that = this;

            eachEventType( eventType , function( type ) {

                var handlers = that._getHandlers( type , true );
                var event = new Event( that , type );

                handlers
                .filter(function( eventHandler ) {
                    eventHandler.invoke( event , args );
                    return !eventHandler.active;
                })
                .forEach(function( eventHandler ) {
                    that._removeHandler( that._getHandlers( type ) , eventHandler.handler );
                });
            });
        },

        dispel: function( eventType , handlerFunc ) {

            var that = this;
            var handlers = that._getHandlers();

            eventType = eventType || Object.keys( handlers ).join( ' ' );

            eachEventType( eventType , function( type ) {
                if (handlerFunc) {
                    that._removeHandler( handlers[type] , handlerFunc );
                }
                else {
                    delete handlers[type];
                }
            });
        },

        _getHandlers: function( eventType , snapshot ) {
            var that = this;
            var handlers = (that.handlers = that.handlers || {});
            var response = (eventType ? (handlers[eventType] = handlers[eventType] || []) : handlers);
            return (snapshot ? (eventType ? response.slice() : Object.create( response )) : response);
        },

        _addHandler: function( eventType , handlerFunc ) {
            var that = this;
            that._getHandlers( eventType ).push( handlerFunc );
        },

        _removeHandler: function( handlerArray , handlerFunc ) {
            var index = indexOfHandler( handlerArray , handlerFunc );
            if (index >= 0) {
                handlerArray.splice( index , 1 );
            }
        }
    };


    function indexOfHandler( handlerArray , handlerFunc ) {
        return handlerArray
            .map(function( eventHandler ) {
                return eventHandler.handler;
            })
            .indexOf( handlerFunc );
    }


    function shift( subject ) {
        return Array.prototype.shift.call( subject );
    }


    function eachEventType( eventType , callback ) {
        (eventType instanceof Array ? eventType : eventType.split( ' ' )).forEach( callback );
    }

    
}( _MOJO.EventHandler , _MOJO.Event ));



























