_MOJO.When = (function( Object , Array , Shared , EventHandler , Event ) {


    var HANDLE_MOJO = 'handleMOJO';


    var Keys = Shared.keys;
    var Shift = Shared.shift;
    var EnsureArray = Shared.ensureArray;
    var Length = Shared.length;


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


    function getHandlerFunc( subject ) {
        return (subject || {})[HANDLE_MOJO] ? subject[HANDLE_MOJO] : subject;
    }


    function getHandlerContext( subject , handler ) {
        return subject === handler ? null : subject;
    }

    
}(
    Object,
    Array,
    _MOJO.Shared,
    _MOJO.EventHandler,
    _MOJO.Event
));



























