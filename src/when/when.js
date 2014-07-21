_MOJO.When = (function() {


    function When() {}


    When.prototype = {

        when: function() {

            var that = this;
            var args = arguments;
            var eventType = shift( args );
            var bindArgs = args.length > 1 ? shift( args ) : bindArgs;
            var handlerFunc = shift( args );

            eachEventType( eventType , function( type ) {
                var _handler = new _MOJO.EventHandler( handlerFunc , bindArgs );
                that._addHandler( type , _handler );
            });
        },

        happen: function( eventType , args ) {

            var that = this;
            var getHandlers = that._getHandlers.bind( that );

            function handlerExists( eventType , eventHandler ) {
                var handlerArray = getHandlers( eventType );
                return handlerArray.indexOf( eventHandler ) >= 0;
            }

            eachEventType( eventType , function( type ) {

                var handlers = getHandlers( type );
                var event = new _MOJO.Event( that , type );

                handlers.forEach(function( eventHandler ) {
                    if (handlerExists( type , eventHandler )) {
                        eventHandler.invoke( event , args );
                    }
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
            var handlers = this.handlers;
            return (eventType ? (handlers[eventType] || []) : handlers);
        },

        _addHandler: function( eventType , handlerFunc ) {
            var that = this;
            var handlers = that.handlers;
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


    return When;

    
}());



























