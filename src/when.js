/* jshint -W018 */
define([ 'inject' , 'MOJO' , 'Event' , 'EventHandler' ],

function( inject , MOJO , Event , EventHandler ) {

    return inject(
    [
        'keys',
        'ocreate',
        'shift',
        'pop',
        'ensureArray',
        'forEach',
        'length',
        'last',
        'ensureFunc',
        'getHandlerFunc',
        'isArray',
        'is',
        'del',
        'EVENTS'
    ],
    function(
        keys,
        ocreate,
        shift,
        pop,
        ensureArray,
        forEach,
        length,
        last,
        ensureFunc,
        getHandlerFunc,
        isArray,
        is,
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
        

        function getHandlerContext( handler , func ) {
            return handler === func ? null : handler;
        }


        function isLockedEvent( type ) {
            var keys = Object.keys( EVENTS );
            var pvt;
            for (var i = 0; i < keys.length; i++) {
                pvt = EVENTS[keys[i]];
                if (pvt === type || Event.getPublic( pvt ) === type) {
                    return true;
                }
            }
        }


        return {

            $once: function() {

                var that = this;

                that.__when( arguments , function( evtHandler ) {
                    evtHandler.before = function( event , func ) {
                        that.$enq(function() {
                            that.__remove( event.type , func );
                        });
                        that.$digest();
                    };
                });

                that.$digest();

                return that;
            },

            $when: function() {
                var that = this;
                that.__when( arguments );
                that.$digest();
                return that;
            },

            $emit: function( eventType , args , originalEvent ) {

                var that = this;

                that.$enq(function() {

                    eventType = that._ensureEType( eventType );

                    forEach( eventType , function( type ) {

                        var handlers = that.__get( type );
                        var event = originalEvent ? Event.clone( originalEvent , that ) : new Event( that , type );
                        
                        forEach( handlers , function( evtHandler ) {
                            evtHandler.invoke( event , args );
                        });

                        if (!isLockedEvent( type )) {
                            that.$emit( EVENTS.$emit , [ type , [ type , args , event ]]);
                        }

                        /*if (!Event.isPrivate( type )) {
                            that.$emit( EVENTS.$emit , [ type , event , args ]);
                        }*/
                    });
                });

                that.$digest();

                return that;
            },

            $dispel: function( eventType , MOJOHandler , force ) {

                var that = this;
                var func = getHandlerFunc( MOJOHandler );

                that.$enq(function() {

                    eventType = that._ensureEType( eventType );

                    forEach( eventType , function( type ) {
                        if (force || !Event.isPrivate( type )) {
                            that.__remove( type , func , !!force );
                        }
                    });
                });

                that.$digest();

                return that;
            },

            /*args = [ eventType , [bindArgs] , [MOJOHandler] ]*/
            __when: function( args , callback ) {

                callback = ensureFunc( callback );

                var that = this;
                var eventType = shift( args );
                var MOJOHandler = is( last( args ) , 'function' ) || is( last( args ) , MOJO ) ? pop( args ) : that;
                var bindArgs = args[0];
                
                var func = getHandlerFunc( MOJOHandler );
                var context = getHandlerContext( MOJOHandler , func );

                that.$enq(function() {
                    forEach( eventType , function( type , i ) {
                        callback(
                            that.__add( type , func , context , bindArgs )
                        );
                    });
                });
            },

            __get: function( eventType ) {
                var that = this;
                var handlers = that.handlers;
                return (eventType ? ensureArray( handlers[eventType] ) : handlers);
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
                
                /*if (!Event.isPrivate( type )) {
                    that.$emit( EVENTS.$when , [ type , func , args ]);
                }*/
                if (!isLockedEvent( type )) {
                    that.$emit( EVENTS.$when , [ type , [ type , args , func ]]);
                }

                /*if (!Event.isPrivate( type ) && type !== Event.getPublic( EVENTS.$when )) {
                    that.$emit([ EVENTS.$when , Event.getPublic( EVENTS.$when )], [ type , func , args ]);
                }*/

                return evtHandler;
            },

            __remove: function( type , func , force ) {

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
                    that.$emit( EVENTS.$dispel , [ type , func ]);
                }*/
                /*if (!Event.isPrivate( type )) {
                    that.$emit( EVENTS.$dispel , [ type , func ]);
                }*/
                if (!isLockedEvent( type )) {
                    that.$emit( EVENTS.$dispel , [ type , [ type , func , force ]]);
                }
            },

            _ensureEType: function( eventType ) {
                return eventType || keys( this.handlers );
            }
        };
    });
});



















