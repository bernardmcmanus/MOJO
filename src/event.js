import {
    $Date,
    $_keys,
    $_create,
    $_forEach,
    $_PROTO
} from 'static/shared';


var PRIVATE_REGEXP = /^\${2}/;
var CURRENT_TARGET = 'currentTarget';
var CANCEL_BUBBLE = 'cancelBubble';
var DEFAULT_PREVENTED = 'defaultPrevented';


export default Event;


export function Event( target , type ) {
    var that = this;
    that.target = target;
    that.type = type;
    that[CURRENT_TARGET] = target;
    that[CANCEL_BUBBLE] = false;
    that[DEFAULT_PREVENTED] = false;
    that.timeStamp = $Date.now();
}


Event[$_PROTO] = {

    preventDefault: function() {
        this[DEFAULT_PREVENTED] = true;
    },

    stopPropagation: function() {
        this[CANCEL_BUBBLE] = true;
    }
};


Event.clone = function( originalEvent , currentTarget ) {
    
    var evtKeys = $_keys( originalEvent );
    var event = $_create( originalEvent );
    
    $_forEach( evtKeys , function( key ) {
        event[key] = originalEvent[key];
    });
    
    event[CURRENT_TARGET] = currentTarget;

    return event;
};


export function isPrivate( type ) {
    return PRIVATE_REGEXP.test( type );
};


export function getPublic( type ) {
    return type.replace( PRIVATE_REGEXP , '' );
};



















