define([], function() {

    /*var Array = Array;
    var Object = Object;*/
    var UNDEFINED;
    var PROTO = 'prototype';
    var HANDLE_MOJO = 'handleMOJO';


    function length( subject ) {
        return subject.length;
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

        EVENTS: {
            $set: '$$set',
            $unset: '$$unset',
            $when: '$$listener.added',
            $emit: '$$listener.triggered',
            $dispel: '$$listener.removed',
            $deref: '$$deref'
        },

        length: length,

        isArray: isArray,

        ensureArray: ensureArray,

        forEach: forEach,

        ocreate: function( subject ) {
            return Object.create( subject );
        },

        defProp: function( subject , property , descriptor ) {
            Object.defineProperty( subject , property , descriptor );
        },

        del: function( subject , key ) {
            delete subject[key];
        },

        keys: function( subject ) {
            return Object.keys( subject );
        },

        shift: function( subject ) {
            return Array[PROTO].shift.call( subject );
        },

        pop: function( subject ) {
            return Array[PROTO].pop.call( subject );
        },

        slice: function( subject , start , end ) {
            return Array[PROTO].slice.call( subject , start , end );
        },

        last: function( subject ) {
            return subject[length( subject ) - 1];
        },

        is: function( subject , test ) {
            return (typeof test === 'string') ? (typeof subject === test) : (subject instanceof test);
        },

        has: function( subject , key ) {
            return subject.hasOwnProperty( key );
        },

        ensureFunc: function( subject ) {
            return subject || function() {};
        },

        getHandlerFunc: function( subject ) {
            return (subject || {})[HANDLE_MOJO] ? subject[HANDLE_MOJO] : subject;
        }
    };
});



























