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


    function Event( target , type ) {
        var that = this;
        that.isBreak = false;
        that.cancelBubble = false;
        that.defaultPrevented = false;
        that.skipHandlers = [];
        that.target = target;
        that.type = type;
        that.timeStamp = Date.now();
    }


    Event[ PROTO ] = {

        skip: function( handlers ) {
            var skipHandlers = this.skipHandlers;
            ensureArray( handlers ).forEach(function( handler ) {
                skipHandlers.push(
                    getHandlerFunc( handler )
                );
            });
        },

        isSkip: function( handler ) {
            return this.skipHandlers.indexOf( handler ) >= 0;
        },

        break: function() {
            this.isBreak = true;
        },

        preventDefault: function() {
            this.defaultPrevented = true;
        },

        stopPropagation: function() {
            this.cancelBubble = true;
        }
    };


    return Event;

});



















