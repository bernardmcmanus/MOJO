/*! mojo - 0.2.0 - Bernard McManus - es6-transpiler - ge31b78 - 2014-10-27 */


define("event", 
  ["static/shared","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var $Date = __dependency1__.$Date;
    var $_keys = __dependency1__.$_keys;
    var $_create = __dependency1__.$_create;
    var $_forEach = __dependency1__.$_forEach;
    var $_PROTO = __dependency1__.$_PROTO;


    var PRIVATE_REGEXP = /^\${2}/;
    var CURRENT_TARGET = 'currentTarget';
    var CANCEL_BUBBLE = 'cancelBubble';
    var DEFAULT_PREVENTED = 'defaultPrevented';


    __exports__["default"] = Event;


    function Event( target , type ) {
        var that = this;
        that.target = target;
        that.type = type;
        that[CURRENT_TARGET] = target;
        that[CANCEL_BUBBLE] = false;
        that[DEFAULT_PREVENTED] = false;
        that.timeStamp = $Date.now();
    }

    __exports__.Event = Event;
    Event[$_PROTO] = {

        preventDefault: function() {
            this[DEFAULT_PREVENTED] = true;
        },

        stopPropagation: function() {
            this[CANCEL_BUBBLE] = true;
        }
    };


    Event.clone = function( originalEvent , currentTarget ) {
        
        var evtKeys = $_keys( originalEvent );
        var event = $_create( originalEvent );
        
        $_forEach( evtKeys , function( key ) {
            event[key] = originalEvent[key];
        });
        
        event[CURRENT_TARGET] = currentTarget;

        return event;
    };


    function isPrivate( type ) {
        return PRIVATE_REGEXP.test( type );
    };
    __exports__.isPrivate = isPrivate;

    function getPublic( type ) {
        return type.replace( PRIVATE_REGEXP , '' );
    };
    __exports__.getPublic = getPublic;
  });
define("eventHandler", 
  ["static/shared","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var $_slice = __dependency1__.$_slice;
    var $_ensureArray = __dependency1__.$_ensureArray;

    __exports__["default"] = function( func , context , bindArgs ) {

        var that = this;

        that.func = func;
        that.locked = false;
        that.before = function() {};
        that.after = function() {};

        bindArgs = $_ensureArray( bindArgs );

        that.invoke = function( event , invArgs ) {
            
            if (event.cancelBubble) {
                return;
            }

            var args = $_slice( bindArgs ).concat(
                $_ensureArray( invArgs )
            );

            args.unshift( event );
            that.before( event , func );
            func.apply( context , args );
            that.after( event , func );
        };
    }
  });
define("main", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = function( seed ) {
        var that = this;
        that.__init( that , ( seed || {} ));
    }
  });
define("proto", 
  ["main","event","when","static/construct","static/shared","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";
    var MOJO = __dependency1__["default"];
    var isPrivate = __dependency2__.isPrivate;
    var getPublic = __dependency2__.getPublic;
    var when = __dependency3__["default"];
    var construct = __dependency4__["default"];
    var $_create = __dependency5__.$_create;
    var $_delete = __dependency5__.$_delete;
    var $_is = __dependency5__.$_is;
    var $_indexOf = __dependency5__.$_indexOf;
    var $_slice = __dependency5__.$_slice;
    var $_shift = __dependency5__.$_shift;
    var $_pop = __dependency5__.$_pop;
    var $_forEach = __dependency5__.$_forEach;
    var $_length = __dependency5__.$_length;
    var $_EVT = __dependency5__.$_EVT;
    var __$_HANDLE_MOJO = __dependency5__.__$_HANDLE_MOJO;


    __exports__["default"] = Proto();


    function Proto() {

        var proto = $_create( when );

        proto.__init = function( that , seed ) {
            for (var key in seed) {
                that[key] = seed[key];
            }
            construct( that );
        };

        proto[__$_HANDLE_MOJO] = function() {

            var that = this;
            var args = $_slice( arguments );
            var e = $_shift( args );

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

            var type = $_shift( args );
            var pubArgs = $_pop( args );
            var shouldEmit = (getPublic( e.type ) !== type);

            /*if (e.type === '$$listener.triggered' && type === '$$gnarly') {
                MOJO.log(pubArgs);
            }*/

            //MOJO.log(e.type + ' -> ' + type);
            //MOJO.log(e.type,pubArgs);

            if (shouldEmit) {
                that.$emit( getPublic( e.type ) , pubArgs );
            }

            if (e.type === $_EVT.$emit && !isPrivate( type )) {
                //MOJO.log(pubArgs);
                $_forEach( that.watchers , function( watcher ) {
                    //MOJO.log(watcher);
                    watcher.$emit.apply( watcher , pubArgs );
                });
            }

            if (e.type === $_EVT.$emit && isPrivate( type )) {
                /*var pubArgs2 = pubArgs.slice( 0 );
                pubArgs2[0] = getPublic( type );
                //that.$emit.apply( that , pubArgs );
                MOJO.log(pubArgs2);
                MOJO.log(pubArgs);*/
                that.$emit( getPublic( type ) , pubArgs[1] );
            }
        };

        proto.$set = function( key , value ) {
            var that = this;
            that[key] = value;
            that.$emit( $_EVT.$set , [ key , [ key ]]);
            return that;
        };

        proto.$unset = function( key ) {
            var that = this;
            $_delete( that , key );
            that.$emit( $_EVT.$unset , [ key , [ key ]]);
            return that;
        };

        proto.$watch = function( parent ) {
            
            var that = this;

            if (!$_is( parent , MOJO )) {
                throw new $Error( 'parent must be a MOJO' );
            }

            var watchers = parent.watchers;
            var index = $_indexOf( watchers , that );

            if (index < 0) {
                watchers.push( that );
                that.$once( $_EVT.$deref , function( e ) {
                    if (index >= 0) {
                        watchers.splice( index , 1 );
                    }
                });
            }

            return that;
        };

        proto.$deref = function() {
            var that = this;
            that.$emit( $_EVT.$deref );
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

            while ($_length( stack ) > 0) {
                $_shift( stack )();
            }
            
            that.__inprog = false;
        };

        return proto;
    }
  });
define("static/aggregate", 
  ["main","event","static/shared","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var MOJO = __dependency1__["default"];
    var isPrivate = __dependency2__.isPrivate;
    var $Error = __dependency3__.$Error;
    var $_forEach = __dependency3__.$_forEach;
    var $_keys = __dependency3__.$_keys;
    var $_EVT = __dependency3__.$_EVT;


    __exports__["default"] = function( arr ) {

        var aggregator = new MOJO();

        $_forEach( arr , function( aggregatee ) {
            $_forEach( $_keys( $_EVT ) , function( key ) {
                aggregator.$when( $_EVT[key] , function( e , type , args ) {
                    if (isPrivate( type )) {
                        throw new $Error( 'private events cannot be aggregated' );
                    }
                    aggregatee[key].apply( aggregatee , args );
                });
            });
        });

        return aggregator;
    };
  });
define("static/construct", 
  ["static/shared","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var $_defineProperty = __dependency1__.$_defineProperty;
    var $_keys = __dependency1__.$_keys;
    var $_ensureFunc = __dependency1__.$_ensureFunc;
    var $_forEach = __dependency1__.$_forEach;
    var $_EVT = __dependency1__.$_EVT;
    var $_HANDLE_MOJO = __dependency1__.$_HANDLE_MOJO;
    var __$_HANDLE_MOJO = __dependency1__.__$_HANDLE_MOJO;


    __exports__["default"] = function( subject ) {

        var inprog = false;

        $_defineProperty( subject , '__stack' , {
            value: []
        });

        $_defineProperty( subject , '__inprog' , {
            get: function() {
                return inprog;
            },
            set: function( value ) {
                inprog = value;
            }
        });

        $_defineProperty( subject , '__events' , {
            get: function() {
                return $_keys( subject.handlers );
            }
        });

        $_defineProperty( subject , 'handlers' , {
            value: {}
        });

        $_defineProperty( subject , 'watchers' , {
            value: []
        });

        $_defineProperty( subject , $_HANDLE_MOJO , {
            value: $_ensureFunc( subject[ $_HANDLE_MOJO ] ).bind( subject )
        });

        $_defineProperty( subject , __$_HANDLE_MOJO , {
            value: subject[ __$_HANDLE_MOJO ].bind( subject )
        });

        $_forEach( $_keys( $_EVT ) , function( key ) {
            var evt = $_EVT[key];
            var evtHandler = subject.__add( evt , subject[ __$_HANDLE_MOJO ] , subject );
            evtHandler.locked = true;
        });
    }
  });
define("static/create", 
  ["proto","static/shared","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var proto = __dependency1__["default"];
    var $_create = __dependency2__.$_create;


    __exports__["default"] = function( subject ) {

        var mojo_proto = $_create( proto );

        for (var key in subject) {
            mojo_proto[key] = subject[key];
        }

        return mojo_proto;
    }
  });
define("static/shared", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var $Array = Array;
    __exports__.$Array = $Array;var $Object = Object;
    __exports__.$Object = $Object;var $Date = Date;
    __exports__.$Date = $Date;var $Error = Error;
    __exports__.$Error = $Error;
    var $_PROTO = 'prototype';
    __exports__.$_PROTO = $_PROTO;var $_HANDLE_MOJO = 'handleMOJO';
    __exports__.$_HANDLE_MOJO = $_HANDLE_MOJO;var __$_HANDLE_MOJO = '__' + $_HANDLE_MOJO;
    __exports__.__$_HANDLE_MOJO = __$_HANDLE_MOJO;var $_UNDEFINED;
    __exports__.$_UNDEFINED = $_UNDEFINED;
    var $_EVT = {
        $set: '$$set',
        $unset: '$$unset',
        $when: '$$listener.added',
        $emit: '$$listener.triggered',
        $dispel: '$$listener.removed',
        $deref: '$$deref'
    };
    __exports__.$_EVT = $_EVT;
    function $_length( subject ) {
        return subject.length;
    }

    __exports__.$_length = $_length;function $_indexOf( subject , element ) {
        return subject.indexOf( element );
    }

    __exports__.$_indexOf = $_indexOf;function $_isArray( subject ) {
        return $Array.isArray( subject );
    }

    __exports__.$_isArray = $_isArray;function $_ensureArray( subject ) {
        return ($_isArray( subject ) ? subject : ( subject !== $_UNDEFINED ? [ subject ] : [] ));
    }

    __exports__.$_ensureArray = $_ensureArray;function $_forEach( subject , callback ) {
        return $_ensureArray( subject ).forEach( callback );
    }

    __exports__.$_forEach = $_forEach;function $_create( subject ) {
        return $Object.create( subject );
    }

    __exports__.$_create = $_create;function $_defineProperty( subject , property , descriptor ) {
        $Object.defineProperty( subject , property , descriptor );
    }

    __exports__.$_defineProperty = $_defineProperty;function $_delete( subject , key ) {
        delete subject[key];
    }

    __exports__.$_delete = $_delete;function $_keys( subject ) {
        return $Object.keys( subject );
    }

    __exports__.$_keys = $_keys;function $_shift( subject ) {
        return $Array[$_PROTO].shift.call( subject );
    }

    __exports__.$_shift = $_shift;function $_pop( subject ) {
        return $Array[$_PROTO].pop.call( subject );
    }

    __exports__.$_pop = $_pop;function $_slice( subject , start , end ) {
        return $Array[$_PROTO].slice.call( subject , start , end );
    }

    __exports__.$_slice = $_slice;function $_last( subject ) {
        return subject[$_length( subject ) - 1];
    }

    __exports__.$_last = $_last;function $_is( subject , test ) {
        return (typeof test === 'string') ? (typeof subject === test) : (subject instanceof test);
    }

    __exports__.$_is = $_is;function $_has( subject , key ) {
        return subject.hasOwnProperty( key );
    }

    __exports__.$_has = $_has;function $_ensureFunc( subject ) {
        return subject || function() {};
    }

    __exports__.$_ensureFunc = $_ensureFunc;function $_getHandlerFunc( subject ) {
        return (subject || {})[ $_HANDLE_MOJO ] ? subject[ $_HANDLE_MOJO ] : subject;
    }

    __exports__.$_getHandlerFunc = $_getHandlerFunc;function $_getHandlerContext( handler , func ) {
        return handler === func ? null : handler;
    }

    __exports__.$_getHandlerContext = $_getHandlerContext;
  });
define("when", 
  ["main","eventHandler","event","static/shared","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var MOJO = __dependency1__["default"];
    var EventHandler = __dependency2__["default"];
    var Event = __dependency3__.Event;
    var isPrivate = __dependency3__.isPrivate;
    var getPublic = __dependency3__.getPublic;
    var $_keys = __dependency4__.$_keys;
    var $_length = __dependency4__.$_length;
    var $_shift = __dependency4__.$_shift;
    var $_pop = __dependency4__.$_pop;
    var $_last = __dependency4__.$_last;
    var $_ensureArray = __dependency4__.$_ensureArray;
    var $_forEach = __dependency4__.$_forEach;
    var $_is = __dependency4__.$_is;
    var $_delete = __dependency4__.$_delete;
    var $_ensureFunc = __dependency4__.$_ensureFunc;
    var $_getHandlerFunc = __dependency4__.$_getHandlerFunc;
    var $_getHandlerContext = __dependency4__.$_getHandlerContext;
    var $_EVT = __dependency4__.$_EVT;

    function indexOfHandler( handlerArray , func ) {
        return $_ensureArray( handlerArray )
            .map(function( evtHandler ) {
                return evtHandler.func;
            })
            .indexOf( func );
    }

    function isLockedEvent( type ) {
        var pvt, keys = $_keys( $_EVT );
        for (var i = 0; i < $_length( keys ); i++) {
            pvt = $_EVT[keys[i]];
            if (pvt === type || getPublic( pvt ) === type) {
                return true;
            }
        }
    }

    __exports__["default"] = {

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

                $_forEach( eventType , function( type ) {

                    var handlers = that.__get( type );
                    var event = originalEvent ? Event.clone( originalEvent , that ) : new Event( that , type );
                    
                    $_forEach( handlers , function( evtHandler ) {
                        evtHandler.invoke( event , args );
                    });

                    if (!isLockedEvent( type )) {
                        that.$emit( $_EVT.$emit , [ type , [ type , args , event ]]);
                    }
                });
            });

            that.$digest();

            return that;
        },

        $dispel: function( eventType , MOJOHandler , force ) {

            var that = this;
            var func = $_getHandlerFunc( MOJOHandler );

            that.$enq(function() {

                eventType = eventType || that.__events;

                $_forEach( eventType , function( type ) {
                    if (force || !isPrivate( type )) {
                        that.__remove( type , func , !!force );
                    }
                });
            });

            that.$digest();

            return that;
        },

        /*args = [ eventType , [bindArgs] , [MOJOHandler] ]*/
        __when: function( args , callback ) {

            callback = $_ensureFunc( callback );

            var that = this;
            var eventType = $_shift( args );
            var MOJOHandler = $_is( $_last( args ) , 'function' ) || $_is( $_last( args ) , MOJO ) ? $_pop( args ) : that;
            var bindArgs = args[0];
            
            var func = $_getHandlerFunc( MOJOHandler );
            var context = $_getHandlerContext( MOJOHandler , func );

            that.$enq(function() {
                $_forEach( eventType , function( type , i ) {
                    callback(
                        that.__add( type , func , context , bindArgs )
                    );
                });
            });
        },

        __get: function( eventType ) {
            var that = this;
            var handlers = that.handlers;
            return (eventType ? $_ensureArray( handlers[eventType] ) : handlers);
        },

        __add: function( type , func , context , args ) {
            
            var that = this;
            var evtHandler = new EventHandler( func , context , args );
            var handlerArray = that.__get( type );

            handlerArray.push( evtHandler );
            that.handlers[type] = handlerArray;

            if (!isLockedEvent( type )) {
                that.$emit( $_EVT.$when , [ type , [ type , args , func ]]);
            }

            return evtHandler;
        },

        __remove: function( type , func , force ) {

            var that = this;
            var handlers = that.__get();
            var handlerArray = that.__get( type );
            var i = 0, index, evtHandler;

            while (i < $_length( handlerArray )) {
                index = (func ? indexOfHandler( handlerArray , func ) : i);
                if (index >= 0 && !handlerArray[i].locked) {
                    handlerArray.splice( index , 1 );
                    i--;
                }
                i++;
            }
            
            if (!$_length( handlerArray )) {
                $_delete( handlers , type );
            }
            else {
                handlers[type] = handlerArray;
            }

            if (!isLockedEvent( type )) {
                that.$emit( $_EVT.$dispel , [ type , [ type , func , force ]]);
            }
        }
    };
  });