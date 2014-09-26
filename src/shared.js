MOJO.shared = (function( Object , Array ) {


    var UNDEFINED;
    var PROTOTYPE = 'prototype';
    var HANDLE_MOJO = 'handleMOJO';


    function length( subject ) {
        return subject.length;
    }


    function shift( subject ) {
        return Array[PROTOTYPE].shift.call( subject );
    }


    function pop( subject ) {
        return Array[PROTOTYPE].pop.call( subject );
    }


    function is( subject , type ) {
        return typeof subject === type;
    }


    function has( subject , key ) {
        return subject.hasOwnProperty( key );
    }


    function isArray( subject ) {
        return Array.isArray( subject );
    }


    function ensureArray( subject ) {
        return (isArray( subject ) ? subject : ( subject !== UNDEFINED ? [ subject ] : [] ));
    }


    return {

        PROTO: PROTOTYPE,

        ocreate: function( subject ) {
            return Object.create( subject );
        },

        defProp: function( subject , property , descriptor ) {
            Object.defineProperty( subject , property , descriptor );
        },

        del: function( subject , key ) {
            delete subject[key];
        },

        length: length,

        keys: function( subject ) {
            return Object.keys( subject );
        },

        shift: shift,

        pop: pop,

        is: is,

        has: has,

        isArray: isArray,

        ensureArray: ensureArray,

        descriptor: function( getter , setter ) {
            return {
                get: getter,
                set: setter,
                configurable: true
            };
        },

        getHandlerFunc: function( subject ) {
            return (subject || {})[HANDLE_MOJO] ? subject[HANDLE_MOJO] : subject;
        }
    };

    
}( Object , Array ));



























