/*! mojo - 0.2.0 - Bernard McManus - es6-transpiler - ge31b78 - 2014-10-27 */


(function() {
    "use strict";

    var main$$default = function( seed ) {
        var that = this;
        that.__init( that , ( seed || {} ));
    };

    var static$shared$$$Array = Array;
    var static$shared$$$Object = Object;
    var static$shared$$$Date = Date;
    var static$shared$$$Error = Error;

    var static$shared$$$_PROTO = 'prototype';
    var static$shared$$$_HANDLE_MOJO = 'handleMOJO';
    var static$shared$$__$_HANDLE_MOJO = '__' + static$shared$$$_HANDLE_MOJO;
    var static$shared$$$_UNDEFINED;

    var static$shared$$$_EVT = {
        $set: '$$set',
        $unset: '$$unset',
        $when: '$$listener.added',
        $emit: '$$listener.triggered',
        $dispel: '$$listener.removed',
        $deref: '$$deref'
    };

    function static$shared$$$_length( subject ) {
        return subject.length;
    }

    function static$shared$$$_indexOf( subject , element ) {
        return subject.indexOf( element );
    }

    function static$shared$$$_isArray( subject ) {
        return static$shared$$$Array.isArray( subject );
    }

    function static$shared$$$_ensureArray( subject ) {
        return (static$shared$$$_isArray( subject ) ? subject : ( subject !== static$shared$$$_UNDEFINED ? [ subject ] : [] ));
    }

    function static$shared$$$_forEach( subject , callback ) {
        return static$shared$$$_ensureArray( subject ).forEach( callback );
    }

    function static$shared$$$_create( subject ) {
        return static$shared$$$Object.create( subject );
    }

    function static$shared$$$_defineProperty( subject , property , descriptor ) {
        static$shared$$$Object.defineProperty( subject , property , descriptor );
    }

    function static$shared$$$_delete( subject , key ) {
        delete subject[key];
    }

    function static$shared$$$_keys( subject ) {
        return static$shared$$$Object.keys( subject );
    }

    function static$shared$$$_shift( subject ) {
        return static$shared$$$Array[static$shared$$$_PROTO].shift.call( subject );
    }

    function static$shared$$$_pop( subject ) {
        return static$shared$$$Array[static$shared$$$_PROTO].pop.call( subject );
    }

    function static$shared$$$_slice( subject , start , end ) {
        return static$shared$$$Array[static$shared$$$_PROTO].slice.call( subject , start , end );
    }

    function static$shared$$$_last( subject ) {
        return subject[static$shared$$$_length( subject ) - 1];
    }

    function static$shared$$$_is( subject , test ) {
        return (typeof test === 'string') ? (typeof subject === test) : (subject instanceof test);
    }

    function static$shared$$$_has( subject , key ) {
        return subject.hasOwnProperty( key );
    }

    function static$shared$$$_ensureFunc( subject ) {
        return subject || function() {};
    }

    function static$shared$$$_getHandlerFunc( subject ) {
        return (subject || {})[ static$shared$$$_HANDLE_MOJO ] ? subject[ static$shared$$$_HANDLE_MOJO ] : subject;
    }

    function static$shared$$$_getHandlerContext( handler , func ) {
        return handler === func ? null : handler;
    }



















    var event$$PRIVATE_REGEXP = /^\${2}/;
    var event$$CURRENT_TARGET = 'currentTarget';
    var event$$CANCEL_BUBBLE = 'cancelBubble';
    var event$$DEFAULT_PREVENTED = 'defaultPrevented';


    var event$$default = event$$Event;
    function event$$Event( target , type ) {
        var that = this;
        that.target = target;
        that.type = type;
        that[event$$CURRENT_TARGET] = target;
        that[event$$CANCEL_BUBBLE] = false;
        that[event$$DEFAULT_PREVENTED] = false;
        that.timeStamp = static$shared$$$Date.now();
    }


    event$$Event[static$shared$$$_PROTO] = {

        preventDefault: function() {
            this[event$$DEFAULT_PREVENTED] = true;
        },

        stopPropagation: function() {
            this[event$$CANCEL_BUBBLE] = true;
        }
    };


    event$$Event.clone = function( originalEvent , currentTarget ) {
        
        var evtKeys = static$shared$$$_keys( originalEvent );
        var event = static$shared$$$_create( originalEvent );
        
        static$shared$$$_forEach( evtKeys , function( key ) {
            event[key] = originalEvent[key];
        });
        
        event[event$$CURRENT_TARGET] = currentTarget;

        return event;
    };


    function event$$isPrivate( type ) {
        return event$$PRIVATE_REGEXP.test( type );
    }function event$$getPublic( type ) {
        return type.replace( event$$PRIVATE_REGEXP , '' );
    }

    var eventHandler$$default = function( func , context , bindArgs ) {

        var that = this;

        that.func = func;
        that.locked = false;
        that.before = function() {};
        that.after = function() {};

        bindArgs = static$shared$$$_ensureArray( bindArgs );

        that.invoke = function( event , invArgs ) {
            
            if (event.cancelBubble) {
                return;
            }

            var args = static$shared$$$_slice( bindArgs ).concat(
                static$shared$$$_ensureArray( invArgs )
            );

            args.unshift( event );
            that.before( event , func );
            func.apply( context , args );
            that.after( event , func );
        };
    };

    function when$$indexOfHandler( handlerArray , func ) {
        return static$shared$$$_ensureArray( handlerArray )
            .map(function( evtHandler ) {
                return evtHandler.func;
            })
            .indexOf( func );
    }

    function when$$isLockedEvent( type ) {
        var pvt, keys = static$shared$$$_keys( static$shared$$$_EVT );
        for (var i = 0; i < static$shared$$$_length( keys ); i++) {
            pvt = static$shared$$$_EVT[keys[i]];
            if (pvt === type || event$$getPublic( pvt ) === type) {
                return true;
            }
        }
    }

    var when$$default = {

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

                eventType = eventType || that.__events;

                static$shared$$$_forEach( eventType , function( type ) {

                    var handlers = that.__get( type );
                    var event = originalEvent ? event$$Event.clone( originalEvent , that ) : new event$$Event( that , type );
                    
                    static$shared$$$_forEach( handlers , function( evtHandler ) {
                        evtHandler.invoke( event , args );
                    });

                    if (!when$$isLockedEvent( type )) {
                        that.$emit( static$shared$$$_EVT.$emit , [ type , [ type , args , event ]]);
                    }
                });
            });

            that.$digest();

            return that;
        },

        $dispel: function( eventType , MOJOHandler , force ) {

            var that = this;
            var func = static$shared$$$_getHandlerFunc( MOJOHandler );

            that.$enq(function() {

                eventType = eventType || that.__events;

                static$shared$$$_forEach( eventType , function( type ) {
                    if (force || !event$$isPrivate( type )) {
                        that.__remove( type , func , !!force );
                    }
                });
            });

            that.$digest();

            return that;
        },

        /*args = [ eventType , [bindArgs] , [MOJOHandler] ]*/
        __when: function( args , callback ) {

            callback = static$shared$$$_ensureFunc( callback );

            var that = this;
            var eventType = static$shared$$$_shift( args );
            var MOJOHandler = static$shared$$$_is( static$shared$$$_last( args ) , 'function' ) || static$shared$$$_is( static$shared$$$_last( args ) , main$$default ) ? static$shared$$$_pop( args ) : that;
            var bindArgs = args[0];
            
            var func = static$shared$$$_getHandlerFunc( MOJOHandler );
            var context = static$shared$$$_getHandlerContext( MOJOHandler , func );

            that.$enq(function() {
                static$shared$$$_forEach( eventType , function( type , i ) {
                    callback(
                        that.__add( type , func , context , bindArgs )
                    );
                });
            });
        },

        __get: function( eventType ) {
            var that = this;
            var handlers = that.handlers;
            return (eventType ? static$shared$$$_ensureArray( handlers[eventType] ) : handlers);
        },

        __add: function( type , func , context , args ) {
            
            var that = this;
            var evtHandler = new eventHandler$$default( func , context , args );
            var handlerArray = that.__get( type );

            handlerArray.push( evtHandler );
            that.handlers[type] = handlerArray;

            if (!when$$isLockedEvent( type )) {
                that.$emit( static$shared$$$_EVT.$when , [ type , [ type , args , func ]]);
            }

            return evtHandler;
        },

        __remove: function( type , func , force ) {

            var that = this;
            var handlers = that.__get();
            var handlerArray = that.__get( type );
            var i = 0, index, evtHandler;

            while (i < static$shared$$$_length( handlerArray )) {
                index = (func ? when$$indexOfHandler( handlerArray , func ) : i);
                if (index >= 0 && !handlerArray[i].locked) {
                    handlerArray.splice( index , 1 );
                    i--;
                }
                i++;
            }
            
            if (!static$shared$$$_length( handlerArray )) {
                static$shared$$$_delete( handlers , type );
            }
            else {
                handlers[type] = handlerArray;
            }

            if (!when$$isLockedEvent( type )) {
                that.$emit( static$shared$$$_EVT.$dispel , [ type , [ type , func , force ]]);
            }
        }
    };

    var static$construct$$default = function( subject ) {

        var inprog = false;

        static$shared$$$_defineProperty( subject , '__stack' , {
            value: []
        });

        static$shared$$$_defineProperty( subject , '__inprog' , {
            get: function() {
                return inprog;
            },
            set: function( value ) {
                inprog = value;
            }
        });

        static$shared$$$_defineProperty( subject , '__events' , {
            get: function() {
                return static$shared$$$_keys( subject.handlers );
            }
        });

        static$shared$$$_defineProperty( subject , 'handlers' , {
            value: {}
        });

        static$shared$$$_defineProperty( subject , 'watchers' , {
            value: []
        });

        static$shared$$$_defineProperty( subject , static$shared$$$_HANDLE_MOJO , {
            value: static$shared$$$_ensureFunc( subject[ static$shared$$$_HANDLE_MOJO ] ).bind( subject )
        });

        static$shared$$$_defineProperty( subject , static$shared$$__$_HANDLE_MOJO , {
            value: subject[ static$shared$$__$_HANDLE_MOJO ].bind( subject )
        });

        static$shared$$$_forEach( static$shared$$$_keys( static$shared$$$_EVT ) , function( key ) {
            var evt = static$shared$$$_EVT[key];
            var evtHandler = subject.__add( evt , subject[ static$shared$$__$_HANDLE_MOJO ] , subject );
            evtHandler.locked = true;
        });
    };

    var proto$$default = proto$$Proto();


    function proto$$Proto() {

        var proto = static$shared$$$_create( when$$default );

        proto.__init = function( that , seed ) {
            for (var key in seed) {
                that[key] = seed[key];
            }
            static$construct$$default( that );
        };

        proto[static$shared$$__$_HANDLE_MOJO] = function() {

            var that = this;
            var args = static$shared$$$_slice( arguments );
            var e = static$shared$$$_shift( args );

            /*var shouldEmit = false;
            var pubArgs, type;

            switch (e.type) {

                case $_EVT.$when:
                case $_EVT.$emit:
                case $_EVT.$dispel:
                    type = shift( args );
                    pubArgs = pop( args );
                    shouldEmit = (getPublic( e.type ) !== type);
                break;

                case $_EVT.$set:
                case $_EVT.$unset:
                    shouldEmit = true;
                break;
            }*/

            var type = static$shared$$$_shift( args );
            var pubArgs = static$shared$$$_pop( args );
            var shouldEmit = (event$$getPublic( e.type ) !== type);

            /*if (e.type === '$$listener.triggered' && type === '$$gnarly') {
                MOJO.log(pubArgs);
            }*/

            //MOJO.log(e.type + ' -> ' + type);
            //MOJO.log(e.type,pubArgs);

            if (shouldEmit) {
                that.$emit( event$$getPublic( e.type ) , pubArgs );
            }

            if (e.type === static$shared$$$_EVT.$emit && !event$$isPrivate( type )) {
                //MOJO.log(pubArgs);
                static$shared$$$_forEach( that.watchers , function( watcher ) {
                    //MOJO.log(watcher);
                    watcher.$emit.apply( watcher , pubArgs );
                });
            }

            if (e.type === static$shared$$$_EVT.$emit && event$$isPrivate( type )) {
                /*var pubArgs2 = pubArgs.slice( 0 );
                pubArgs2[0] = getPublic( type );
                //that.$emit.apply( that , pubArgs );
                MOJO.log(pubArgs2);
                MOJO.log(pubArgs);*/
                that.$emit( event$$getPublic( type ) , pubArgs[1] );
            }
        };

        proto.$set = function( key , value ) {
            var that = this;
            that[key] = value;
            that.$emit( static$shared$$$_EVT.$set , [ key , [ key ]]);
            return that;
        };

        proto.$unset = function( key ) {
            var that = this;
            static$shared$$$_delete( that , key );
            that.$emit( static$shared$$$_EVT.$unset , [ key , [ key ]]);
            return that;
        };

        proto.$watch = function( parent ) {
            
            var that = this;

            if (!static$shared$$$_is( parent , main$$default )) {
                throw new $Error( 'parent must be a MOJO' );
            }

            var watchers = parent.watchers;
            var index = static$shared$$$_indexOf( watchers , that );

            if (index < 0) {
                watchers.push( that );
                that.$once( static$shared$$$_EVT.$deref , function( e ) {
                    if (index >= 0) {
                        watchers.splice( index , 1 );
                    }
                });
            }

            return that;
        };

        proto.$deref = function() {
            var that = this;
            that.$emit( static$shared$$$_EVT.$deref );
            //that.$dispel( null , null , true );
        };

        proto.$enq = function( task ) {
            var that = this;
            that.__stack.push( task );
        };

        proto.$digest = function() {
            
            var that = this;
            var stack = that.__stack;

            if (that.__inprog) {
                //MOJO.log('--- INPROG ---',stack.length);
                return;
            }

            that.__inprog = true;

            while (static$shared$$$_length( stack ) > 0) {
                static$shared$$$_shift( stack )();
            }
            
            that.__inprog = false;
        };

        return proto;
    }



















    var static$aggregate$$default = function( arr ) {

        var aggregator = new main$$default();

        static$shared$$$_forEach( arr , function( aggregatee ) {
            static$shared$$$_forEach( static$shared$$$_keys( static$shared$$$_EVT ) , function( key ) {
                aggregator.$when( static$shared$$$_EVT[key] , function( e , type , args ) {
                    if (event$$isPrivate( type )) {
                        throw new static$shared$$$Error( 'private events cannot be aggregated' );
                    }
                    aggregatee[key].apply( aggregatee , args );
                });
            });
        });

        return aggregator;
    };

    var static$create$$default = function( subject ) {

        var mojo_proto = static$shared$$$_create( proto$$default );

        for (var key in subject) {
            mojo_proto[key] = subject[key];
        }

        return mojo_proto;
    };

    //import Event from 'event';
    //import EventHandler from 'eventHandler';

    main$$default.prototype = proto$$default;
    main$$default.create = static$create$$default;
    main$$default.construct = static$construct$$default;
    main$$default.aggregate = static$aggregate$$default;
    //MOJO.Event = Event;
    //MOJO.EventHandler = EventHandler;
    main$$default.$_EVT = static$shared$$$_EVT;

    var $$$index$$default = main$$default;

    if (typeof define === 'function' && define.amd) {
        define([] , function() { return $$$index$$default });
    }
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = $$$index$$default;
    }
    else if (typeof this !== 'undefined') {
        this.MOJO = $$$index$$default;
    }
}).call(this);

//# sourceMappingURL=mojo.common.js.map