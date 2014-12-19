import EventHandler from 'eventHandler';
import { Event , isPrivate } from 'event';
import isE$ from 'static/is-emoney';
import {
  $WHEN,
  $EMIT,
  $DISPEL,
  $FUNCTION
} from 'static/constants';
import {
  $_length,
  $_shift,
  $_pop,
  $_slice,
  $_indexOf,
  $_last,
  $_ensureArray,
  $_forEach,
  $_is,
  $_has,
  $_delete,
  $_ensureFunc,
  $_getHandlerFunc,
  $_getHandlerContext
} from 'static/shared';

function indexOfHandler( handlerArray , func ) {
  var arr = $_ensureArray( handlerArray )
  .map(function( evtHandler ) {
    return evtHandler.func;
  });
  return $_indexOf( arr , func );
}

export default {

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
    var parsed = that.__parse( $EMIT , arguments );

    that.$enq(function() {
      $_forEach( parsed[0] , function( type ) {
        that.__invoke( type , parsed[1] , parsed[2] );
      });
    });

    that.$flush();

    return that;
  },

  /*parsed == [ [eventList] , [force] , [E$Handler] ]*/
  $dispel: function() {

    var that = this;
    var parsed = that.__parse( $DISPEL , arguments );
    //console.log(parsed);
    var func = $_getHandlerFunc( parsed[2] );

    that.$enq(function() {
      $_forEach( parsed[0] , function( type ) {
        that.__remove( type , func , !!parsed[1] );
      });
    });

    that.$flush();

    return that;
  },

  /*args == parsed == [ eventList , [bindArgs] , [E$Handler] ]*/
  _$when: function( args , callback ) {

    callback = $_ensureFunc( callback );

    var that = this;
    var parsed = that.__parse( $WHEN , args );
    
    var func = $_getHandlerFunc( parsed[2] );
    var context = $_getHandlerContext( parsed[2] , func );

    that.$enq(function() {
      $_forEach( parsed[0] , function( type , i ) {
        var evtHandler = that.__add( type , func , context , parsed[1] );
        callback( evtHandler );
      });
    });
  },

  __parse: function( type , args ) {

    var that = this;
    var parsed = [];

    args = $_slice( args );

    $_forEach([ 0 , 1 , 2 ] , function( i ) {

      // eventList
      if (!i) {
        parsed[0] = $_shift( args ) || that.__events;
      }
      
      // E$Handler / func
      else if (i < 2) {
        parsed[2] = $_is($_last( args ) , $FUNCTION ) || isE$($_last( args )) ? $_pop( args ) : null;
        parsed[2] = type != $DISPEL ? parsed[2] || that : parsed[2];
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
    if ($_has( that.__get() , privateType ) && eventType != privateType) {
      //console.log('emit private -> ' + privateType + ' (' + eventType + ')');
      that.$emit( privateType , args );
    }
  },

  __invoke: function( type , args , callback ) {

    var that = this;
    var handlers = that.__get( type );
    var evt = new Event( that , type );

    callback = $_ensureFunc( callback );
    
    $_forEach( handlers , function( evtHandler ) {
      evtHandler.after = callback;
      evtHandler.invoke( evt , args );
    });

    that.__pvt( type , $EMIT , [ type , [ type , args , callback ]]);
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

    evtHandler.locked = isPrivate( type );

    handlerArray.push( evtHandler );
    that.handlers[type] = handlerArray;

    that.__pvt( type , $WHEN , [ type , [ type , args , func ]]);

    return evtHandler;
  },

  __remove: function( type , func , force ) {

    var that = this;
    var handlers = that.__get();
    var handlerArray = that.__get( type );
    var i = 0, index, evtHandler;

    while (i < $_length( handlerArray )) {
      index = (func ? indexOfHandler( handlerArray , func ) : i);
      if (index >= 0 && (force || !handlerArray[i].locked)) {
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

    that.__pvt( type , $DISPEL , [ type , [ type , force , func ]]);
  }
};



















