/* jshint -W093 */

export var $Array = Array;
export var $Object = Object;
export var $Date = Date;
export var $Error = Error;

export var $_PROTO = 'prototype';
export var $_UNDEFINED;

export var $_EVT = {
  $set: '$$set',
  $unset: '$$unset',
  $when: '$$when',
  $emit: '$$emit',
  $dispel: '$$dispel'
  //$deref: '$$deref'
};

export var $_EVT_ARRAY = $_keys( $_EVT ).map(function( key ) {
  return $_EVT[key];
});

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
  return $Array[$_PROTO].slice.call( subject , start || 0 , end );
}

export function $_last( subject ) {
  return subject[$_length( subject ) - 1];
}

export function $_is( subject , test ) {
  return (typeof test == 'string') ? (typeof subject == test) : (subject instanceof test);
}

export function $_has( subject , key ) {
  return subject.hasOwnProperty( key );
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
  return (subject || {}).handleE$ ? subject.handleE$ : subject;
}

export function $_getHandlerContext( handler , func ) {
  return handler === func ? null : handler;
}



















