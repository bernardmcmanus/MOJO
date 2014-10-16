MOJO.Event = MOJO.inject(
[
    Date,
    'ensureArray',
    'getHandlerFunc',
    'PROTO'
],
function(
    Date,
    ensureArray,
    getHandlerFunc,
    PROTO
){


    var CANCEL_BUBBLE = 'cancelBubble';
    var DEFAULT_PREVENTED = 'defaultPrevented';


    function Event( target , type ) {
        var that = this;
        that.target = target;
        that.currentTarget = target;
        that.type = type;
        that[CANCEL_BUBBLE] = false;
        that[DEFAULT_PREVENTED] = false;
        that.timeStamp = Date.now();
    }


    Event.clone = function( originalEvent , currentTarget ) {
        
        var keys = Object.keys( originalEvent );
        var event = Object.create( originalEvent );
        
        keys.forEach(function( key ) {
            event[key] = originalEvent[key];
        });
        
        event.currentTarget = currentTarget;

        return event;
    };


    Event.isPrivate = function( type ) {
        return (/^\${2}/).test( type );
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



















