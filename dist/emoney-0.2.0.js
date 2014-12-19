/*! emoney - 0.2.0 - Bernard McManus - regression - g95f924 - 2014-12-19 */

(function() {
    "use strict";
    var static$constants$$$Array = Array;
    var static$constants$$$Object = Object;
    var static$constants$$$Date = Date;
    var static$constants$$$Error = Error;

    var static$constants$$$HANDLE_E$ = 'handleE$';
    var static$constants$$$PROTO = 'prototype';
    var static$constants$$$FUNCTION = 'function';
    var static$constants$$$OBJECT = 'object';
    var static$constants$$$STRING = 'string';
    var static$constants$$$UNDEFINED;

    var static$constants$$$CANCEL_BUBBLE = 'cancelBubble';
    var static$constants$$$DEFAULT_PREVENTED = 'defaultPrevented';

    var static$constants$$$SET = '$set';
    var static$constants$$$UNSET = '$unset';
    var static$constants$$$WHEN = '$when';
    var static$constants$$$EMIT = '$emit';
    var static$constants$$$DISPEL = '$dispel';
    var static$constants$$$DEREF = '$deref';
    var static$constants$$$EVT = [ static$constants$$$SET , static$constants$$$UNSET , static$constants$$$WHEN , static$constants$$$EMIT , static$constants$$$DISPEL , static$constants$$$DEREF ];



















    function static$shared$$$_length( subject ) {
      return subject.length;
    }

    function static$shared$$$_indexOf( subject , element ) {
      return subject.indexOf( element );
    }

    function static$shared$$$_isArray( subject ) {
      return static$constants$$$Array.isArray( subject );
    }

    function static$shared$$$_ensureArray( subject ) {
      return (static$shared$$$_isArray( subject ) ? subject : ( subject !== static$constants$$$UNDEFINED ? [ subject ] : [] ));
    }

    function static$shared$$$_forEach( subject , callback ) {
      return static$shared$$$_ensureArray( subject ).forEach( callback );
    }

    function static$shared$$$_create( subject ) {
      return static$constants$$$Object.create( subject );
    }

    function static$shared$$$_defineProperty( subject , property , descriptor ) {
      static$constants$$$Object.defineProperty( subject , property , descriptor );
    }

    function static$shared$$$_delete( subject , key ) {
      delete subject[key];
    }

    function static$shared$$$_keys( subject ) {
      return static$constants$$$Object.keys( subject );
    }

    function static$shared$$$_shift( subject ) {
      return static$constants$$$Array[static$constants$$$PROTO].shift.call( subject );
    }

    function static$shared$$$_pop( subject ) {
      return static$constants$$$Array[static$constants$$$PROTO].pop.call( subject );
    }

    function static$shared$$$_slice( subject , start , end ) {
      return static$constants$$$Array[static$constants$$$PROTO].slice.call( subject , start || 0 , end );
    }

    function static$shared$$$_last( subject ) {
      return subject[static$shared$$$_length( subject ) - 1];
    }

    function static$shared$$$_is( subject , test ) {
      return (typeof test == static$constants$$$STRING) ? (typeof subject == test) : (subject instanceof test);
    }

    function static$shared$$$_has( subject , key ) {
      return subject.hasOwnProperty( key );
    }

    function static$shared$$$_ensureFunc( subject ) {
      //return subject || function() {};
      return static$shared$$$_is( subject , static$constants$$$FUNCTION ) ? subject : function(){};
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
      return (subject || {})[ static$constants$$$HANDLE_E$ ] ? subject[ static$constants$$$HANDLE_E$ ] : subject;
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

      that.bindArgs = static$shared$$$_ensureArray( bindArgs );

      that._reset( that );
    }

    var eventHandler$$default = eventHandler$$EventHandler;

    eventHandler$$EventHandler[static$constants$$$PROTO] = {

      _reset: function( that ) {
        that.before = static$shared$$$_ensureFunc();
        that.after = static$shared$$$_ensureFunc();
      },

      invoke: function( evt , invArgs ) {

        var that = this;

        if (evt[static$constants$$$CANCEL_BUBBLE]) {
          return;
        }

        var func = that.func;
        var args = static$shared$$$_slice( that.bindArgs ).concat(
          static$shared$$$_ensureArray( invArgs )
        );

        args.unshift( evt );
        that.before( evt , func );
        func.apply( that.context , args );
        if (!evt[static$constants$$$DEFAULT_PREVENTED]) {
          that.after( evt , func );
        }

        that._reset( that );
      }

    };



















    var event$$default = event$$Event;
    function event$$Event( target , type ) {
      var that = this;
      that.target = target;
      that.type = type;
      that[static$constants$$$CANCEL_BUBBLE] = false;
      that[static$constants$$$DEFAULT_PREVENTED] = false;
      that.timeStamp = static$constants$$$Date.now();
    }


    event$$Event[static$constants$$$PROTO] = {

      preventDefault: function() {
        this[static$constants$$$DEFAULT_PREVENTED] = true;
      },

      stopPropagation: function() {
        this[static$constants$$$CANCEL_BUBBLE] = true;
      }
    };


    function event$$isPrivate( type ) {
      return static$shared$$$_indexOf( static$constants$$$EVT , type ) >= 0;
    }



















    var static$is$emoney$$default = function( subject ) {
      return subject && static$shared$$$_is( subject , static$constants$$$OBJECT ) && static$constants$$$HANDLE_E$ in subject;
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

      /*parsed == [ eventList , [args] , [callback] ]*/
      $emit: function() {

        var that = this;
        var parsed = that.__parse( static$constants$$$EMIT , arguments );

        that.$enq(function() {
          static$shared$$$_forEach( parsed[0] , function( type ) {
            that.__invoke( type , parsed[1] , parsed[2] );
          });
        });

        that.$flush();

        return that;
      },

      /*parsed == [ [eventList] , [force] , [E$Handler] ]*/
      $dispel: function() {

        var that = this;
        var parsed = that.__parse( static$constants$$$DISPEL , arguments );
        //console.log(parsed);
        var func = static$shared$$$_getHandlerFunc( parsed[2] );

        that.$enq(function() {
          static$shared$$$_forEach( parsed[0] , function( type ) {
            that.__remove( type , func , !!parsed[1] );
          });
        });

        that.$flush();

        return that;
      },

      /*args == parsed == [ eventList , [bindArgs] , [E$Handler] ]*/
      _$when: function( args , callback ) {

        callback = static$shared$$$_ensureFunc( callback );

        var that = this;
        var parsed = that.__parse( static$constants$$$WHEN , args );
        
        var func = static$shared$$$_getHandlerFunc( parsed[2] );
        var context = static$shared$$$_getHandlerContext( parsed[2] , func );

        that.$enq(function() {
          static$shared$$$_forEach( parsed[0] , function( type , i ) {
            var evtHandler = that.__add( type , func , context , parsed[1] );
            callback( evtHandler );
          });
        });
      },

      __parse: function( type , args ) {

        var that = this;
        var parsed = [];

        args = static$shared$$$_slice( args );

        static$shared$$$_forEach([ 0 , 1 , 2 ] , function( i ) {

          // eventList
          if (!i) {
            parsed[0] = static$shared$$$_shift( args ) || that.__events;
          }
          
          // E$Handler / func
          else if (i < 2) {
            parsed[2] = static$shared$$$_is(static$shared$$$_last( args ) , static$constants$$$FUNCTION ) || static$is$emoney$$default(static$shared$$$_last( args )) ? static$shared$$$_pop( args ) : null;
            parsed[2] = type != static$constants$$$DISPEL ? parsed[2] || that : parsed[2];
          }

          // args / force
          else {
            parsed[1] = args[0];
          }
        });

        return parsed;
      },

      __pvt: function( eventType , privateType , args ) {
        var that = this;
        if (static$shared$$$_has( that.__get() , privateType ) && eventType != privateType) {
          //console.log('emit private -> ' + privateType + ' (' + eventType + ')');
          that.$emit( privateType , args );
        }
      },

      __invoke: function( type , args , callback ) {

        var that = this;
        var handlers = that.__get( type );
        var evt = new event$$Event( that , type );

        callback = static$shared$$$_ensureFunc( callback );
        
        static$shared$$$_forEach( handlers , function( evtHandler ) {
          evtHandler.after = callback;
          evtHandler.invoke( evt , args );
        });

        that.__pvt( type , static$constants$$$EMIT , [ type , [ type , args , callback ]]);
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

        that.__pvt( type , static$constants$$$WHEN , [ type , [ type , args , func ]]);

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

        that.__pvt( type , static$constants$$$DISPEL , [ type , [ type , force , func ]]);
      }
    };

    var static$construct$$default = function( subject ) {

      static$shared$$$_defineProperty( subject , '__stack' , {
        value: []
      });

      static$shared$$$_defineProperty( subject , '__inprog' , {
        value: false,
        writable: true
      });

      static$shared$$$_defineProperty( subject , '__events' , {
        get: function() {
          return static$shared$$$_keys( subject.handlers );
        }
      });

      static$shared$$$_defineProperty( subject , 'handlers' , {
        value: {}
      });

      static$shared$$$_defineProperty( subject , static$constants$$$HANDLE_E$ , {
        value: static$shared$$$_ensureFunc( subject[ static$constants$$$HANDLE_E$ ] ).bind( subject )
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

      proto.$set = function( key , value ) {
        var that = this;
        that[key] = value;
        that.$emit( static$constants$$$SET , [ key , [ key ]]);
        return that;
      };

      proto.$unset = function( key ) {
        var that = this;
        static$shared$$$_delete( that , key );
        that.$emit( static$constants$$$UNSET , [ key , [ key ]]);
        return that;
      };

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

        while (static$shared$$$_length( stack )) {
          static$shared$$$_shift( stack )();
        }
        
        that.__inprog = false;
      };

      return proto;
    }



















    var static$create$$default = function( subjectProto ) {

      var extendedProto = static$shared$$$_defineProto(
        static$shared$$$_create( proto$$default )
      );

      for (var key in subjectProto) {
        extendedProto[key] = subjectProto[key];
      }

      return extendedProto;
    };

    main$$default[static$constants$$$PROTO] = static$shared$$$_defineProto( proto$$default );
    main$$default.isE$ = static$is$emoney$$default;
    main$$default.create = static$create$$default;
    main$$default.construct = static$construct$$default;

    var $$index$$default = main$$default;

    if (typeof define == 'function' && define.amd) {
      define([], function() { return $$index$$default });
    }
    else if (typeof exports == 'object') {
      module.exports = $$index$$default;
    }
    else {
      this.E$ = $$index$$default;
    }
}).call(this);

