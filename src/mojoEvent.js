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
        that.type = type;
        that[CANCEL_BUBBLE] = false;
        that[DEFAULT_PREVENTED] = false;
        that.timeStamp = Date.now();
    }


    Event.validate = function( str ) {
        if (!str && str !== 0) {
            return false;
        }
        return !(/((\b\$+)|\b\*|[^\w,\*]$|^[^a-z]+.\.|\.[^a-z]+.$|(\.\d|\d\.)|[^\*\.,\$,a-z].*[^a-z]|(\.|\*)(.+)(\.|\*)|(.\*\.|\.\*.)|[^\w,\$,\.,\*])/i).test( str );
    };


    Event.parse = function( str ) {
        //var match = (/\.(?=(.*))/).exec( str );
        //var match = str.match( /\.(.*)/ );
        //var match = str.match( /\.(.*)/ );
        //return match /*? (match[1] || null) : null*/;

        /*var parts = str.replace( /./g , function( match ) {

        }).split( '.' );*/

        var parts = str
            .toString()
            .split( '.' )
            .map(function( part ) {
                return Event.escape( part );
                /*return part.replace( /./g , function( match ) {
                    MOJO.log(match);
                    return Event.escape( match );
                });*/
            });

        /*return {
            type: parts[0],
            namespace: parts[1] || null
        };*/
        return {
            type: new RegExp( parts[0] ),
            namespace: parts[1] ? new RegExp( parts[1] ) : null
        };
    };


    Event.escape = function( str ) {
        return str.replace( /\$|\*/g , function( match ) {
            return '\\' + match;
        });
    };


    Event.match = function( test , subject ) {
        return ensureArray( subject )
        .filter(function( str ) {
            MOJO.log(test,str,test.test( str ));
            return test.test( str );
        });
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



















