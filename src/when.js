import MOJO from 'main';
import EventHandler from 'eventHandler';
import {
  Event,
  isPrivate,
  getPublic,
  cloneEvent
} from 'event';
import {
  $_keys,
  $_length,
  $_shift,
  $_pop,
  $_indexOf,
  $_last,
  $_ensureArray,
  $_forEach,
  $_is,
  $_delete,
  $_ensureFunc,
  $_getHandlerFunc,
  $_getHandlerContext,
  $_EVT
} from 'static/shared';

function indexOfHandler( handlerArray , func ) {
  var arr = $_ensureArray( handlerArray )
  .map(function( evtHandler ) {
    return evtHandler.func;
  });
  return $_indexOf( arr , func );
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

export default {

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
        var event = originalEvent ? cloneEvent( originalEvent , that ) : new Event( that , type );
        
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



















