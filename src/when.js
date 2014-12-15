import EventHandler from 'eventHandler';
import {
  Event,
  isPrivate
  //isLocked,
  //cloneEvent
} from 'event';
import isE$ from 'static/is-emoney';
import {
  $_length,
  $_shift,
  $_pop,
  $_indexOf,
  $_last,
  $_ensureArray,
  $_forEach,
  $_is,
  $_has,
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

  $emit: function( eventList , args ) {

    var that = this;

    that.$enq(function() {

      eventList = eventList || that.__events;

      $_forEach( eventList , function( type ) {
        that.__invoke( type , args );
      });
    });

    that.$flush();

    return that;
  },

  $dispel: function( eventList , E$Handler , force ) {

    var that = this;
    var func = $_getHandlerFunc( E$Handler );

    that.$enq(function() {

      eventList = eventList || that.__events;

      $_forEach( eventList , function( type ) {
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

    callback = $_ensureFunc( callback );

    var that = this;
    var eventList = $_shift( args );
    var E$Handler = $_is( $_last( args ) , 'function' ) || isE$( $_last( args )) ? $_pop( args ) : that;
    var bindArgs = args[0];
    
    var func = $_getHandlerFunc( E$Handler );
    var context = $_getHandlerContext( E$Handler , func );

    that.$enq(function() {
      $_forEach( eventList , function( type , i ) {
        var evtHandler = that.__add( type , func , context , bindArgs );
        //evtHandler.events = $_ensureArray( eventList );
        callback( evtHandler );
      });
    });
  },

  __pvt: function( eventType , privateType , args ) {
    var that = this;
    if ($_has( that.__get() , privateType ) && eventType != privateType) {
      //console.log('emit private -> ' + privateType + ' (' + eventType + ')');
      that.$emit( privateType , args );
    }
  },

  __invoke: function( type , args ) {

    var that = this;
    var handlers = that.__get( type );
    var evt = new Event( that , type );
    
    $_forEach( handlers , function( evtHandler ) {
      evtHandler.invoke( evt , args );
    });

    that.__pvt( type , $_EVT.$emit , [ type , [ type , args ]]);
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

    that.__pvt( type , $_EVT.$when , [ type , [ type , args , func ]]);

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

    that.__pvt( type , $_EVT.$dispel , [ type , [ type , func , force ]]);
  }
};



















