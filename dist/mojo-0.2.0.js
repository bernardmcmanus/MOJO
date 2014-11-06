/*! mojo - 0.2.0 - Bernard McManus - es6-transpiler - g5ac089 - 2014-11-05 */

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
      $when: '$$when',
      $emit: '$$emit',
      $dispel: '$$dispel',
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

    function static$shared$$$_parseRoute( path ) {
      return path.split( '.' );
    }

    function static$shared$$$_ensureBranch( subject , path , action ) {
      
      var route = static$shared$$$_parseRoute( path );
      var lastKey = static$shared$$$_pop( route );
      
      static$shared$$$_forEach( route , function( key ) {
        subject[key] = subject = subject[key] || {};
      });
      
      return function( value ) {
        
        /*
          the following is an abbreviated way of writing:
          -----------------------------------------------
          switch (action) {
            case $_EVT.$set:
              return subject[lastKey] = value;
            case $_EVT.$unset:
              return $_delete( subject , lastKey );
            default:
              return (subject || {})[lastKey];
          }
        */

        return action === static$shared$$$_EVT.$set ? 
          subject[lastKey] = value :
          (
            action === static$shared$$$_EVT.$unset ?
              static$shared$$$_delete( subject , lastKey ) :
              (subject || {})[lastKey]
          );
      };
    }

    function static$shared$$$_ensureFunc( subject ) {
      return subject || function() {};
    }

    function static$shared$$$_defineProto( proto ) {
      var nonEnumerableProto = {};
      for (var key in proto) {
        static$shared$$$_defineProperty( nonEnumerableProto , key , {
          value: proto[key]
        });
      }
      return nonEnumerableProto;
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


    function event$$cloneEvent( originalEvent , currentTarget ) {
      
      var evtKeys = static$shared$$$_keys( originalEvent );
      var event = static$shared$$$_create( originalEvent );
      
      static$shared$$$_forEach( evtKeys , function( key ) {
        event[key] = originalEvent[key];
      });
      
      event[event$$CURRENT_TARGET] = currentTarget;

      return event;
    }


    function event$$isLocked( type ) {
      var pvt, keys = static$shared$$$_keys( static$shared$$$_EVT );
      for (var i = 0; i < static$shared$$$_length( keys ); i++) {
        pvt = static$shared$$$_EVT[keys[i]];
        if (pvt === type || event$$getPublic( pvt ) === type) {
          return true;
        }
      }
    }


    function event$$isPrivate( type ) {
      return event$$PRIVATE_REGEXP.test( type );
    }


    function event$$getPublic( type ) {
      return type.replace( event$$PRIVATE_REGEXP , '' );
    }



















    var eventHandler$$default = function( func , context , bindArgs ) {

      var that = this;

      that.func = func;
      that.locked = false;
      that.active = true;
      that.before = function() {};
      that.after = function() {};

      bindArgs = static$shared$$$_ensureArray( bindArgs );

      that.invoke = function( event , invArgs ) {
        
        if (!that.active || event.cancelBubble) {
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
      var arr = static$shared$$$_ensureArray( handlerArray )
      .map(function( evtHandler ) {
        return evtHandler.func;
      });
      return static$shared$$$_indexOf( arr , func );
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
          evtHandler.after = function() {
            evtHandler.active = false;
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
            var event = originalEvent ? event$$cloneEvent( originalEvent , that ) : new event$$Event( that , type );
            
            static$shared$$$_forEach( handlers , function( evtHandler ) {
              evtHandler.invoke( event , args );
            });

            if (!event$$isLocked( type )) {
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

        if (!event$$isLocked( type )) {
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

        if (!event$$isLocked( type )) {
          that.$emit( static$shared$$$_EVT.$dispel , [ type , [ type , func , force ]]);
        }
      }
    };

    var static$construct$$default = function( subject ) {

      var inprog = false, __maxWatchers = 10, watchers = [];

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

      static$shared$$$_defineProperty( subject , '__maxWatchers' , {
        get: function() {
          return __maxWatchers;
        },
        set: function( value ) {
          __maxWatchers = value;
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
        get: function() {
          return watchers;
        },
        set: function( value ) {
          watchers = static$shared$$$_isArray( value ) ? value : [];
        }
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

      proto[ static$shared$$__$_HANDLE_MOJO ] = function() {

        var that = this;
        var args = static$shared$$$_slice( arguments );
        var e = static$shared$$$_shift( args );
        var type = static$shared$$$_shift( args );
        var pubArgs = static$shared$$$_pop( args );
        var shouldEmit = (type && event$$getPublic( e.type ) !== type);

        if (shouldEmit) {
          that.$emit( event$$getPublic( e.type ) , pubArgs );
        }

        if (e.type === static$shared$$$_EVT.$emit && !event$$isPrivate( type )) {
          static$shared$$$_forEach( that.watchers , function( watcher ) {
            watcher.$emit.apply( watcher , pubArgs );
          });
        }

        if (e.type === static$shared$$$_EVT.$emit && event$$isPrivate( type )) {
          that.$emit( event$$getPublic( type ) , pubArgs[1] );
        }
      };

      proto.$get = function( path ) {
        var that = this;
        return that.__modBranch( null , path );
      };

      proto.$set = function( path , value ) {
        var that = this;
        that.__modBranch( static$shared$$$_EVT.$set , path , value );
        that.$emit( static$shared$$$_EVT.$set , [ path , [ path ]]);
        return that;
      };

      proto.$unset = function( path ) {
        var that = this;
        var target = that.$get( path );
        if (static$shared$$$_is( target , main$$default )) {
          target.$deref();
        }
        that.__modBranch( static$shared$$$_EVT.$unset , path );
        that.$emit( static$shared$$$_EVT.$unset , [ path , [ path ]]);
        return that;
      };

      proto.$spawn = function( path , seed ) {

        var that = this;
        var child = new main$$default( seed );

        that
          .$watch( child )
          .$set( path , child );

        return child;
      };

      proto.$watch = function( child ) {
        
        var that = this;

        if (!static$shared$$$_is( child , main$$default )) {
          throw new static$shared$$$Error( 'child must be a $MOJO' );
        }

        var childWatchers = child.watchers;
        var childMax = child.__maxWatchers;
        var index = static$shared$$$_indexOf( childWatchers , that );

        function onParentDeref() {
          child.$deref();
        }

        function onChildDeref() {
          that.$dispel( static$shared$$$_EVT.$deref , onParentDeref , true );
        }

        if (index < 0 && (!childMax || static$shared$$$_length( childWatchers ) < childMax)) {
          childWatchers.push( that );
          that.$once( static$shared$$$_EVT.$deref , onParentDeref );
          child.$once( static$shared$$$_EVT.$deref , onChildDeref );
        }

        return that;
      };

      proto.$deref = function() {
        var that = this;
        that.watchers = [];
        that.$emit( static$shared$$$_EVT.$deref );
        that.$dispel( null , null , true );
      };

      proto.$enq = function( task ) {
        var that = this;
        that.__stack.push( task );
      };

      proto.$digest = function() {
        
        var that = this;
        var stack = that.__stack;

        if (that.__inprog) {
          return;
        }

        that.__inprog = true;

        while (static$shared$$$_length( stack ) > 0) {
          static$shared$$$_shift( stack )();
        }
        
        that.__inprog = false;
      };

      proto.maxWatchers = function( value ) {
        var that = this;
        if (static$shared$$$_is( value , 'number' ) && value >= 0) {
          that.__maxWatchers = value;
        }
        return that.__maxWatchers;
      };

      proto.__modBranch = function( evt , path , value ) {
        var that = this;
        var func = static$shared$$$_ensureBranch( that , path , evt );
        return func( value );
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

    var static$create$$default = function( subjectProto ) {

      var extendedProto = static$shared$$$_defineProto(static$shared$$$_create( proto$$default ));

      for (var key in subjectProto) {
        extendedProto[key] = subjectProto[key];
      }

      return extendedProto;
    };

    main$$default[static$shared$$$_PROTO] = static$shared$$$_defineProto( proto$$default );
    main$$default.create = static$create$$default;
    main$$default.construct = static$construct$$default;
    main$$default.aggregate = static$aggregate$$default;

    var $$index$$default = main$$default;

    if (typeof define === 'function' && define.amd) {
      define([] , function() { return $$index$$default });
    }
    else if (typeof module !== 'undefined' && module.exports) {
      module.exports = $$index$$default;
    }
    else if (typeof this !== 'undefined') {
      this.$MOJO = $$index$$default;
    }
}).call(this);

