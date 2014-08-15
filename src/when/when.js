_MOJO.When = (function( Object , Array , _MOJO ) {


    var HANDLE_MOJO = 'handleMOJO';


    var Shared = _MOJO.Shared;
    var EventHandler = _MOJO.EventHandler;
    var Event = _MOJO.Event;


    var Keys = Shared.keys;
    var Shift = Shared.shift;
    var EnsureArray = Shared.ensureArray;
    var Length = Shared.length;
    var getHandlerFunc = Shared.getHandlerFunc;


    var When = {

        once: function() {

            var that = this;
            var handlers = that._when( arguments );
            
            handlers.forEach(function( eventHandler ) {
                eventHandler.callback = function() {
                    this.active = false;
                };
            });

            return that;
        },

        when: function() {
            var that = this;
            that._when( arguments );
            return that;
        },

        _when: function( args ) {

            var that = this;
            var eventType = Shift( args );
            var bindArgs = Length( args ) > 1 ? Shift( args ) : bindArgs;
            var eventHandlers = [];

            var MOJOHandler = Shift( args );
            var handlerFunc = getHandlerFunc( MOJOHandler );
            var context = getHandlerContext( MOJOHandler , handlerFunc );

            eachEventType( eventType , function( type , i ) {
                eventHandlers.push(
                    new EventHandler( handlerFunc , context , bindArgs )
                );
                that._addHandler( type , eventHandlers[i] );
            });
            
            return eventHandlers;
        },

        happen: function( eventType , args ) {

            var that = this;

            eventType = that._ensureEType( eventType );

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

            return that;
        },

        dispel: function( eventType , MOJOHandler ) {

            var that = this;
            var handlers = that._getHandlers();
            var handlerFunc = getHandlerFunc( MOJOHandler );

            eventType = that._ensureEType( eventType );

            eachEventType( eventType , function( type ) {
                if (handlerFunc) {
                    that._removeHandler( handlers[type] , handlerFunc );
                }
                else {
                    delete handlers[type];
                }
            });

            return that;
        },

        _ensureEType: function( eventType ) {
            return eventType || Keys( this._getHandlers() ).join( ' ' );
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
        return EnsureArray( handlerArray )
            .map(function( eventHandler ) {
                return eventHandler.handler;
            })
            .indexOf( handlerFunc );
    }


    function eachEventType( eventType , callback ) {
        (eventType instanceof Array ? eventType : eventType.split( ' ' )).forEach( callback );
    }
    

    function getHandlerContext( subject , handler ) {
        return subject === handler ? null : subject;
    }


    return When;

    
}( Object , Array , _MOJO ));



























