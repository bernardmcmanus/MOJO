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
            var getHandlers = that._getHandlers.bind( that );

            eachEventType( eventType , function( type ) {

                var handlers = getHandlers( type );
                var event = new Event( that , type );

                that.handlers[eventType] = handlers.filter(function( eventHandler ) {
                    eventHandler.invoke( event , args );
                    return eventHandler.active;
                });
            });
        },

        dispel: function( eventType , handlerFunc ) {

            var that = this;
            var getHandlers = that._getHandlers.bind( that );

            eachEventType( eventType , function( type ) {
                if (handlerFunc) {
                    that._removeHandler(
                        getHandlers( type ) , handlerFunc
                    );
                }
                else {
                    delete getHandlers()[type];
                }
            });
        },

        _getHandlers: function( eventType ) {
            var that = this;
            var handlers = (that.handlers = that.handlers || {});
            return (eventType ? (handlers[eventType] || []) : handlers);
        },

        _addHandler: function( eventType , handlerFunc ) {
            var that = this;
            var handlers = (that.handlers = that.handlers || {});
            (handlers[eventType] = handlers[eventType] || []).push( handlerFunc );
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
        eventType.split( ' ' ).forEach( callback );
    }

    
}( _MOJO.EventHandler , _MOJO.Event ));



























