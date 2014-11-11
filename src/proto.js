import $MOJO from 'main';
import { isPrivate , getPublic } from 'event';
import when from 'when';
import isMOJO from 'static/isMOJO';
import construct from 'static/construct';
import {
  $Error,
  $_create,
  $_delete,
  $_is,
  $_ensureBranch,
  $_indexOf,
  $_slice,
  $_shift,
  $_pop,
  $_forEach,
  $_length,
  $_EVT,
  __$_HANDLE_MOJO
} from 'static/shared';


export default Proto();


function Proto() {

  var proto = $_create( when );

  proto.__init = function( that , seed ) {
    for (var key in seed) {
      that[key] = seed[key];
    }
    construct( that );
  };

  proto[ __$_HANDLE_MOJO ] = function() {

    var that = this;
    var args = $_slice( arguments );
    var e = $_shift( args );
    var type = $_shift( args );
    var pubArgs = $_pop( args );
    var shouldEmit = (type && getPublic( e.type ) !== type);

    if (shouldEmit) {
      that.$emit( getPublic( e.type ) , pubArgs );
    }

    if (e.type === $_EVT.$emit && !isPrivate( type )) {
      $_forEach( that.watchers , function( watcher ) {
        watcher.$emit.apply( watcher , pubArgs );
      });
    }

    if (e.type === $_EVT.$emit && isPrivate( type )) {
      that.$emit( getPublic( type ) , pubArgs[1] );
    }
  };

  proto.$get = function( path ) {
    var that = this;
    return that.__modBranch( null , path );
  };

  proto.$set = function( path , value ) {
    var that = this;
    that.__modBranch( $_EVT.$set , path , value );
    that.$emit( $_EVT.$set , [ path , [ path ]]);
    return that;
  };

  proto.$unset = function( path ) {
    var that = this;
    var target = that.$get( path );
    if (isMOJO( target )) {
      target.$deref();
    }
    that.__modBranch( $_EVT.$unset , path );
    that.$emit( $_EVT.$unset , [ path , [ path ]]);
    return that;
  };

  proto.$spawn = function( path , seed ) {

    var that = this;
    var child = new $MOJO( seed );

    that
      .$watch( child )
      .$set( path , child );

    return child;
  };

  proto.$watch = function( child ) {
    
    var that = this;

    if (!isMOJO( child )) {
      throw new $Error( 'child must be a $MOJO' );
    }

    var childWatchers = child.watchers;
    var childMax = child.__maxWatchers;
    var index = $_indexOf( childWatchers , that );

    function onParentDeref() {
      child.$deref();
    }

    function onChildDeref() {
      that.$dispel( $_EVT.$deref , onParentDeref , true );
    }

    if (index < 0 && (!childMax || $_length( childWatchers ) < childMax)) {
      childWatchers.push( that );
      that.$once( $_EVT.$deref , onParentDeref );
      child.$once( $_EVT.$deref , onChildDeref );
    }

    return that;
  };

  /*proto.$ignore = function( child ) {
    
    var that = this;

    return that;
  };*/

  proto.$deref = function() {
    var that = this;
    that.watchers = [];
    that.$emit( $_EVT.$deref );
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

    while ($_length( stack ) > 0) {
      $_shift( stack )();
    }
    
    that.__inprog = false;
  };

  proto.maxWatchers = function( value ) {
    var that = this;
    if ($_is( value , 'number' ) && value >= 0) {
      that.__maxWatchers = value;
    }
    return that.__maxWatchers;
  };

  proto.__modBranch = function( evt , path , value ) {
    var that = this;
    var func = $_ensureBranch( that , path , evt );
    return func( value );
  };

  return proto;
}



















