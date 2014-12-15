/*! emoney - 0.2.0 - Bernard McManus - es6-transpiler - gbac90b - 2014-12-12 */

(function() {
    "use strict";
    var static$shared$$$Array = Array;
    var static$shared$$$Object = Object;
    var static$shared$$$Date = Date;
    var static$shared$$$Error = Error;

    var static$shared$$$_PROTO = 'prototype';
    var static$shared$$$_UNDEFINED;

    var static$shared$$$_EVT = {
      $set: '$$set',
      $unset: '$$unset',
      $when: '$$when',
      $emit: '$$emit',
      $dispel: '$$dispel'
      //$deref: '$$deref'
    };

    var static$shared$$$_EVT_ARRAY = static$shared$$$_keys( static$shared$$$_EVT ).map(function( key ) {
      return static$shared$$$_EVT[key];
    });

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
      return static$shared$$$Array[static$shared$$$_PROTO].slice.call( subject , start || 0 , end );
    }

    function static$shared$$$_last( subject ) {
      return subject[static$shared$$$_length( subject ) - 1];
    }

    function static$shared$$$_is( subject , test ) {
      return (typeof test == 'string') ? (typeof subject == test) : (subject instanceof test);
    }

    function static$shared$$$_has( subject , key ) {
      return subject.hasOwnProperty( key );
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
      return (subject || {}).handleE$ ? subject.handleE$ : subject;
    }

    function static$shared$$$_getHandlerContext( handler , func ) {
      return handler === func ? null : handler;
    }



















    function main$$E$( seed ) {
      var that = this;
      if (static$shared$$$_is( that , main$$E$ )) {
        that.__init( that , ( seed || {} ));
      }
      else {
        return new main$$E$( seed );
      }
    }



















    var main$$default = main$$E$;
    function eventHandler$$EventHandler( func , context , bindArgs ) {

      var that = this;

      that.func = func;
      that.context = context;
      //that.locked = false;
      //that.active = true;
      //that.events = [];
      that.before = function() {};
      that.after = function() {};

      that.bindArgs = static$shared$$$_ensureArray( bindArgs );
    }

    var eventHandler$$default = eventHandler$$EventHandler;

    eventHandler$$EventHandler[static$shared$$$_PROTO] = {

      invoke: function( evt , invArgs ) {

        var that = this;

        if (/*!that.active ||*/ evt.cancelBubble) {
          return;
        }

        var func = that.func;
        var args = static$shared$$$_slice( that.bindArgs ).concat(
          static$shared$$$_ensureArray( invArgs )
        );

        args.unshift( evt );
        that.before( evt , func );
        func.apply( that.context , args );
        that.after( evt , func );
      }

    };



















    //var PRIVATE_REGEXP = /^\${2}/;
    //var CURRENT_TARGET = 'currentTarget';
    var event$$CANCEL_BUBBLE = 'cancelBubble';
    var event$$DEFAULT_PREVENTED = 'defaultPrevented';


    var event$$default = event$$Event;
    function event$$Event( target , type ) {
      var that = this;
      that.target = target;
      that.type = type;
      //that[CURRENT_TARGET] = target;
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


    function event$$isPrivate( type ) {
      return static$shared$$$_indexOf( static$shared$$$_EVT_ARRAY , type ) >= 0;
    }


    var static$is$emoney$$default = function( subject ) {
      return static$shared$$$_is( subject , 'object' ) && 'handleE$' in subject;
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

        that._$when( arguments , function( evtHandler ) {
          evtHandler.before = function( evt , func ) {
            that.$enq(function() {
              that.__remove( evt.type , func , true );
            });
            that.$flush();
          };
        });

        that.$flush();

        return that;
      },

      $when: function() {
        var that = this;
        that._$when( arguments );
        that.$flush();
        return that;
      },

      $emit: function( eventList , args ) {

        var that = this;

        that.$enq(function() {

          eventList = eventList || that.__events;

          static$shared$$$_forEach( eventList , function( type ) {
            that.__invoke( type , args );
          });
        });

        that.$flush();

        return that;
      },

      $dispel: function( eventList , E$Handler , force ) {

        var that = this;
        var func = static$shared$$$_getHandlerFunc( E$Handler );

        that.$enq(function() {

          eventList = eventList || that.__events;

          static$shared$$$_forEach( eventList , function( type ) {
            //if (force || !isPrivate( type )) {
              that.__remove( type , func , !!force );
            //}
          });
        });

        that.$flush();

        return that;
      },

      /*args == [ eventList , [bindArgs] , [E$Handler] ]*/
      _$when: function( args , callback ) {

        callback = static$shared$$$_ensureFunc( callback );

        var that = this;
        var eventList = static$shared$$$_shift( args );
        var E$Handler = static$shared$$$_is( static$shared$$$_last( args ) , 'function' ) || static$is$emoney$$default( static$shared$$$_last( args )) ? static$shared$$$_pop( args ) : that;
        var bindArgs = args[0];
        
        var func = static$shared$$$_getHandlerFunc( E$Handler );
        var context = static$shared$$$_getHandlerContext( E$Handler , func );

        that.$enq(function() {
          static$shared$$$_forEach( eventList , function( type , i ) {
            var evtHandler = that.__add( type , func , context , bindArgs );
            //evtHandler.events = $_ensureArray( eventList );
            callback( evtHandler );
          });
        });
      },

      __pvt: function( eventType , privateType , args ) {
        var that = this;
        if (static$shared$$$_has( that.__get() , privateType ) && eventType != privateType) {
          //console.log('emit private -> ' + privateType + ' (' + eventType + ')');
          that.$emit( privateType , args );
        }
      },

      __invoke: function( type , args ) {

        var that = this;
        var handlers = that.__get( type );
        var evt = new event$$Event( that , type );
        
        static$shared$$$_forEach( handlers , function( evtHandler ) {
          evtHandler.invoke( evt , args );
        });

        that.__pvt( type , static$shared$$$_EVT.$emit , [ type , [ type , args ]]);
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

        evtHandler.locked = event$$isPrivate( type );

        handlerArray.push( evtHandler );
        that.handlers[type] = handlerArray;

        that.__pvt( type , static$shared$$$_EVT.$when , [ type , [ type , args , func ]]);

        return evtHandler;
      },

      __remove: function( type , func , force ) {

        var that = this;
        var handlers = that.__get();
        var handlerArray = that.__get( type );
        var i = 0, index, evtHandler;

        while (i < static$shared$$$_length( handlerArray )) {
          index = (func ? when$$indexOfHandler( handlerArray , func ) : i);
          if (index >= 0 && (force || !handlerArray[i].locked)) {
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

        that.__pvt( type , static$shared$$$_EVT.$dispel , [ type , [ type , func , force ]]);
      }
    };

    var static$construct$$default = function( subject ) {

      //var inprog = false, __maxWatchers = 10, watchers = [];

      static$shared$$$_defineProperty( subject , '__stack' , {
        value: []
      });

      static$shared$$$_defineProperty( subject , '__inprog' , {
        value: false,
        writable: true
      });

      /*$_defineProperty( subject , '__inprog' , {
        get: function() {
          return inprog;
        },
        set: function( value ) {
          inprog = value;
        }
      });*/

      /*$_defineProperty( subject , '__maxWatchers' , {
        get: function() {
          return __maxWatchers;
        },
        set: function( value ) {
          __maxWatchers = value;
        }
      });*/

      static$shared$$$_defineProperty( subject , '__events' , {
        get: function() {
          return static$shared$$$_keys( subject.handlers );
        }
      });

      static$shared$$$_defineProperty( subject , 'handlers' , {
        value: {}
      });

      /*$_defineProperty( subject , 'watchers' , {
        get: function() {
          return watchers;
        },
        set: function( value ) {
          watchers = $_isArray( value ) ? value : [];
        }
      });*/

      static$shared$$$_defineProperty( subject , 'handleE$' , {
        value: static$shared$$$_ensureFunc( subject.handleE$ ).bind( subject )
      });

      /*$_defineProperty( subject , '__handleE$' , {
        value: subject.__handleE$.bind( subject )
      });*/

      /*$_forEach( $_keys( $_EVT ) , function( key ) {
        var evt = $_EVT[key];
        var evtHandler = subject.__add( evt , subject.__handleE$ , subject );
        evtHandler.locked = true;
      });*/
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

      /*proto.__handleE$ = function() {

        var that = this;
        var args = $_slice( arguments );
        var e = $_shift( args );
        var type = $_shift( args );
        var pubArgs = $_pop( args );
        var shouldEmit = (type && getPublic( e.type ) !== type);

        if (shouldEmit) {
          that.$emit( getPublic( e.type ) , pubArgs );
        }

        if (e.type === $_EVT.$emit && isPrivate( type )) {
          that.$emit( getPublic( type ) , pubArgs[1] );
        }
      };*/

      proto.$set = function( key , value ) {
        var that = this;
        that[key] = value;
        that.$emit( static$shared$$$_EVT.$set , [ key , [ key ]]);
        return that;
      };

      proto.$unset = function( key ) {
        var that = this;
        /*var target = that[key];
        if (isE$( target )) {
          target.$deref();
        }*/
        that.$emit( static$shared$$$_EVT.$unset , [ key , [ key ]]);
        return that;
      };

      /*proto.$deref = function() {
        var that = this;
        that.$emit( $_EVT.$deref );
        that.$dispel( null , null , true );
      };*/

      proto.$enq = function( task ) {
        var that = this;
        that.__stack.push( task );
      };

      proto.$flush = function() {
        
        var that = this;
        var stack = that.__stack;

        if (that.__inprog) {
          //E$.log('inprog');
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



















    var static$create$$default = function( subjectProto ) {

      var extendedProto = static$shared$$$_defineProto(static$shared$$$_create( proto$$default ));

      for (var key in subjectProto) {
        extendedProto[key] = subjectProto[key];
      }

      return extendedProto;
    };

    main$$default[static$shared$$$_PROTO] = static$shared$$$_defineProto( proto$$default );
    main$$default.isE$ = static$is$emoney$$default;
    main$$default.create = static$create$$default;
    main$$default.construct = static$construct$$default;
    var $$index$$default = main$$default;

    if (typeof define == 'function' && define.amd) {
      define([] , function() { return $$index$$default });
    }
    else if (typeof module != 'undefined' && module.exports) {
      module.exports = $$index$$default;
    }
    else if (typeof this != 'undefined') {
      this.E$ = $$index$$default;
    }
}).call(this);

