_MOJO.Shared = (function( Object , Array ) {


    var UNDEFINED;
    var HANDLE_MOJO = 'handleMOJO';


    function length( subject ) {
        return subject.length;
    }


    function keys( subject ) {
        return Object.keys( subject );
    }


    function shift( subject ) {
        return Array.prototype.shift.call( subject );
    }


    function ensureArray( subject ) {
        return (subject instanceof Array ? subject : ( subject !== UNDEFINED ? [ subject ] : [] ));
    }


    function descriptor( getter , setter ) {
        return {
            get: getter,
            set: setter,
            configurable: true
        };
    }


    function getHandlerFunc( subject ) {
        return (subject || {})[HANDLE_MOJO] ? subject[HANDLE_MOJO] : subject;
    }


    return {
        length: length,
        keys: keys,
        shift: shift,
        ensureArray: ensureArray,
        descriptor: descriptor,
        getHandlerFunc: getHandlerFunc
    };

    
}( Object , Array ));



























