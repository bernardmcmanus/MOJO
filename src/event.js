define([ 'inject' ] , function( inject ) {

    return inject(
    [
        Date,
        'forEach',
        'getHandlerFunc',
        'keys',
        'ocreate'
    ],
    function(
        Date,
        forEach,
        getHandlerFunc,
        keys,
        ocreate
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


        Event.prototype = {

            preventDefault: function() {
                this[DEFAULT_PREVENTED] = true;
            },

            stopPropagation: function() {
                this[CANCEL_BUBBLE] = true;
            }
        };


        return Event;

    });
});



















