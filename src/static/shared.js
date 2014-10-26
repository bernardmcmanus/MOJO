
var $Array = Array;
var $Object = Object;
var $Date = Date;
var $Error = Error;

var $_PROTO = 'prototype';
var $_HANDLE_MOJO = 'handleMOJO';
var __$_HANDLE_MOJO = '__' + $_HANDLE_MOJO;
var $_UNDEFINED;

var $_EVT = {
    $set: '$$set',
    $unset: '$$unset',
    $when: '$$listener.added',
    $emit: '$$listener.triggered',
    $dispel: '$$listener.removed',
    $deref: '$$deref'
};

function $_length( subject ) {
    return subject.length;
}

function $_indexOf( subject , element ) {
    return subject.indexOf( element );
}

function $_isArray( subject ) {
    return $Array.isArray( subject );
}

function $_ensureArray( subject ) {
    return ($_isArray( subject ) ? subject : ( subject !== $_UNDEFINED ? [ subject ] : [] ));
}

function $_forEach( subject , callback ) {
    return $_ensureArray( subject ).forEach( callback );
}

function $_create( subject ) {
    return $Object.create( subject );
}

function $_defineProperty( subject , property , descriptor ) {
    $Object.defineProperty( subject , property , descriptor );
}

function $_delete( subject , key ) {
    delete subject[key];
}

function $_keys( subject ) {
    return $Object.keys( subject );
}

function $_shift( subject ) {
    return $Array[$_PROTO].shift.call( subject );
}

function $_pop( subject ) {
    return $Array[$_PROTO].pop.call( subject );
}

function $_slice( subject , start , end ) {
    return $Array[$_PROTO].slice.call( subject , start , end );
}

function $_last( subject ) {
    return subject[$_length( subject ) - 1];
}

function $_is( subject , test ) {
    return (typeof test === 'string') ? (typeof subject === test) : (subject instanceof test);
}

function $_has( subject , key ) {
    return subject.hasOwnProperty( key );
}

function $_ensureFunc( subject ) {
    return subject || function() {};
}

function $_getHandlerFunc( subject ) {
    return (subject || {})[ $_HANDLE_MOJO ] ? subject[ $_HANDLE_MOJO ] : subject;
}

function $_getHandlerContext( handler , func ) {
    return handler === func ? null : handler;
}



















