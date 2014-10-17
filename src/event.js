MOJO.inject( 'Event' ,
[
    Date,
    'forEach',
    'getHandlerFunc',
    'keys',
    'ocreate',
    'PROTO'
],
function(
    Date,
    forEach,
    getHandlerFunc,
    keys,
    ocreate,
    PROTO
){


    var PRIVATE_REGEXP = /^\${2}/;
    var CURRENT_TARGET = 'currentTarget';
    var CANCEL_BUBBLE = 'cancelBubble';
    var DEFAULT_PREVENTED = 'defaultPrevented';


    function Event( target , type ) {
        var that = this;
        that.target = target;
        that.type = type;
        that[CURRENT_TARGET] = target;
        that[CANCEL_BUBBLE] = false;
        that[DEFAULT_PREVENTED] = false;
        that.timeStamp = Date.now();
    }


    Event.clone = function( originalEvent , currentTarget ) {
        
        var evtKeys = keys( originalEvent );
        var event = ocreate( originalEvent );
        
        forEach( evtKeys , function( key ) {
            event[key] = originalEvent[key];
        });
        
        event[CURRENT_TARGET] = currentTarget;

        return event;
    };
    

    Event.isPrivate = function( type ) {
        return PRIVATE_REGEXP.test( type );
    };


    Event.getPublic = function( type ) {
        return type.replace( PRIVATE_REGEXP , '' );
    };


    Event[ PROTO ] = {

        preventDefault: function() {
            this[DEFAULT_PREVENTED] = true;
        },

        stopPropagation: function() {
            this[CANCEL_BUBBLE] = true;
        }
    };


    return Event;

});



















