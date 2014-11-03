import MOJO from 'main';

export var $Array = Array;
export var $Object = Object;
export var $Date = Date;
export var $Error = Error;

export var $_PROTO = 'prototype';
export var $_HANDLE_MOJO = 'handleMOJO';
export var __$_HANDLE_MOJO = '__' + $_HANDLE_MOJO;
export var $_UNDEFINED;

export var $_EVT = {
  $set: '$$set',
  $unset: '$$unset',
  $when: '$$listener.added',
  $emit: '$$listener.triggered',
  $dispel: '$$listener.removed',
  $deref: '$$deref'
};

export function $_length( subject ) {
  return subject.length;
}

export function $_indexOf( subject , element ) {
  return subject.indexOf( element );
}

export function $_isArray( subject ) {
  return $Array.isArray( subject );
}

export function $_ensureArray( subject ) {
  return ($_isArray( subject ) ? subject : ( subject !== $_UNDEFINED ? [ subject ] : [] ));
}

export function $_forEach( subject , callback ) {
  return $_ensureArray( subject ).forEach( callback );
}

export function $_create( subject ) {
  return $Object.create( subject );
}

export function $_defineProperty( subject , property , descriptor ) {
  $Object.defineProperty( subject , property , descriptor );
}

export function $_delete( subject , key ) {
  delete subject[key];
}

export function $_keys( subject ) {
  return $Object.keys( subject );
}

export function $_shift( subject ) {
  return $Array[$_PROTO].shift.call( subject );
}

export function $_pop( subject ) {
  return $Array[$_PROTO].pop.call( subject );
}

export function $_slice( subject , start , end ) {
  return $Array[$_PROTO].slice.call( subject , start , end );
}

export function $_last( subject ) {
  return subject[$_length( subject ) - 1];
}

export function $_is( subject , test ) {
  return (typeof test === 'string') ? (typeof subject === test) : (subject instanceof test);
}

export function $_has( subject , key ) {
  return subject.hasOwnProperty( key );
}

export function $_parseRoute( path ) {
  return path.split( '.' );
}

export function $_ensureBranch( subject , path , action ) {
  
  var route = $_parseRoute( path );
  var lastKey = $_pop( route );
  
  $_forEach( route , function( key ) {
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

    return action === $_EVT.$set ? 
      subject[lastKey] = value :
      (
        action === $_EVT.$unset ?
          $_delete( subject , lastKey ) :
          (subject || {})[lastKey]
      );
  };
}

export function $_ensureFunc( subject ) {
  return subject || function() {};
}

export function $_defineProto( proto ) {
  var nonEnumerableProto = {};
  for (var key in proto) {
    $_defineProperty( nonEnumerableProto , key , {
      value: proto[key]
    });
  }
  return nonEnumerableProto;
}

export function $_getHandlerFunc( subject ) {
  return (subject || {})[ $_HANDLE_MOJO ] ? subject[ $_HANDLE_MOJO ] : subject;
}

export function $_getHandlerContext( handler , func ) {
  return handler === func ? null : handler;
}



















