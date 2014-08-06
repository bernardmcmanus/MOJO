_MOJO.Shared = (function( Object , Array ) {


    var UNDEFINED;


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
            configurable: true,
            enumerable: false
        };
    }


    return {
        length: length,
        keys: keys,
        shift: shift,
        ensureArray: ensureArray,
        descriptor: descriptor
    };

    
}( Object , Array ));



























