MOJO.shared = (function( Object , Array ) {


    var UNDEFINED;
    var PROTOTYPE = 'prototype';
    var HANDLE_MOJO = 'handleMOJO';
    var $$LISTENER = '$$listener';


    function length( subject ) {
        return subject.length;
    }


    function shift( subject ) {
        return Array[PROTOTYPE].shift.call( subject );
    }


    function pop( subject ) {
        return Array[PROTOTYPE].pop.call( subject );
    }


    function slice( subject , start , end ) {
        return Array[PROTOTYPE].slice.call( subject , start , end );
    }


    function is( subject , test ) {
        if (typeof test === 'string') {
            return typeof subject === test;
        }
        else {
            return subject instanceof test;
        }
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


    function forEach( subject , callback ) {
        return ensureArray( subject ).forEach( callback );
    }


    return {

        PROTO: PROTOTYPE,

        EVENTS: {
            set: '$$set',
            unset: '$$unset',
            $when: $$LISTENER + '.added',
            $emit: $$LISTENER + '.triggered',
            $dispel: $$LISTENER + '.removed'
        },

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

        slice: slice,

        is: is,

        has: has,

        isArray: isArray,

        ensureArray: ensureArray,

        forEach: forEach,

        ensureFunc: function( subject ) {
            return subject || function() {};
        },

        getHandlerFunc: function( subject ) {
            return (subject || {})[HANDLE_MOJO] ? subject[HANDLE_MOJO] : subject;
        }
    };

    
}( Object , Array ));



























