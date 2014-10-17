/* jshint -W018 */
MOJO.inject( 'when' ,
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
    'del',
    'EVENTS'
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
    del,
    EVENTS
){


    function indexOfHandler( handlerArray , func ) {
        return ensureArray( handlerArray )
            .map(function( evtHandler ) {
                return evtHandler.func;
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

        $once: function() {

            var that = this;
            var eventHandlers = that.__when( arguments );
            
            eventHandlers.forEach(function( evtHandler ) {
                evtHandler.callback = function() {
                    this.active = false;
                };
            });

            return that;
        },

        $when: function() {
            var that = this;
            that.__when( arguments );
            return that;
        },

        $emit: function( eventType , args , originalEvent ) {

            var that = this;

            eventType = that._ensureEType( eventType );

            eachEventType( eventType , function( type ) {

                var handlers = that.__get( type , true );
                var event = originalEvent ? Event.clone( originalEvent , that ) : new Event( that , type );

                /*handlers
                .filter(function( evtHandler ) {
                    evtHandler.invoke( event , args );
                    return !evtHandler.active;
                })
                .forEach(function( evtHandler ) {
                    that.__remove( type , evtHandler.func );
                });*/

                handlers.forEach(function( evtHandler ) {
                    that.$enq(function() {
                        evtHandler.invoke( event , args );
                    });
                });

                that.$enq(function() {
                    handlers.forEach(function( evtHandler ) {
                        if (!evtHandler.active) {
                            that.__remove( type , evtHandler.func );
                        }
                    });
                });

                // emit $$listener.triggered event
                /*if (!Event.isPrivate( type )) {
                    that.$emit( EVENTS.$emit , [ type , event , args ]);
                }*/
                if (!Event.isPrivate( type ) /*&& type !== Event.getPublic( EVENTS.$emit )*/) {
                    that.$emit( EVENTS.$emit , [ type , event , args ]);
                }

                that.$digest();
            });

            return that;
        },

        $dispel: function( eventType , MOJOHandler , force ) {

            var that = this;
            var handlers = that.__get();
            var func = getHandlerFunc( MOJOHandler );

            eventType = that._ensureEType( eventType );

            eachEventType( eventType , function( type ) {
                if (force || !Event.isPrivate( type )) {
                    that.__remove( type , func );
                }
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
            var evtHandler = new EventHandler( func , context , args );
            var handlerArray = that.__get( type );

            handlerArray.push( evtHandler );
            that.handlers[type] = handlerArray;

            // emit $$listener.added event
            /*if (!Event.isPrivate( type )) {
                that.$emit( EVENTS.$when , [ type , func , args ]);
            }*/
            if (!Event.isPrivate( type ) /*&& type !== Event.getPublic( EVENTS.$when )*/) {
                that.$emit( EVENTS.$when , [ type , func , args ]);
            }
            /*if (!Event.isPrivate( type ) && type !== Event.getPublic( EVENTS.$when )) {
                that.$emit([ EVENTS.$when , Event.getPublic( EVENTS.$when )], [ type , func , args ]);
            }*/

            return evtHandler;
        },

        __remove: function( type , func ) {

            var that = this;
            var handlers = that.__get();
            var handlerArray = that.__get( type );
            var i = 0, index, evtHandler;

            while (i < length( handlerArray )) {
                index = (func ? indexOfHandler( handlerArray , func ) : i);
                if (index >= 0 && !handlerArray[i].locked) {
                    handlerArray.splice( index , 1 );
                    i--;
                }
                i++;
            }
            
            if (!length( handlerArray )) {
                del( handlers , type );
            }
            else {
                handlers[type] = handlerArray;
            }

            // emit $$listener.removed event
            /*if (!Event.isPrivate( type )) {
                that.$emit( EVENTS.$dispel ,[ type , func ]);
            }*/
            if (!Event.isPrivate( type ) /*&& type !== Event.getPublic( EVENTS.$dispel )*/) {
                that.$emit( EVENTS.$dispel ,[ type , func ]);
            }
        },

        _ensureEType: function( eventType ) {
            return eventType || keys( this.handlers );
        }
    };
});



















