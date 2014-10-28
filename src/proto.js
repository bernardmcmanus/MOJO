import MOJO from 'main';
import { isPrivate , getPublic } from 'event';
import when from 'when';
import construct from 'static/construct';
import {
    $_create,
    $_delete,
    $_is,
    $_indexOf,
    $_slice,
    $_shift,
    $_pop,
    $_forEach,
    $_length,
    $_EVT,
    __$_HANDLE_MOJO
} from 'static/shared';


export default Proto();


function Proto() {

    var proto = $_create( when );

    proto.__init = function( that , seed ) {
        for (var key in seed) {
            that[key] = seed[key];
        }
        construct( that );
    };

    proto[__$_HANDLE_MOJO] = function() {

        var that = this;
        var args = $_slice( arguments );
        var e = $_shift( args );

        /*var shouldEmit = false;
        var pubArgs, type;

        switch (e.type) {

            case $_EVT.$when:
            case $_EVT.$emit:
            case $_EVT.$dispel:
                type = shift( args );
                pubArgs = pop( args );
                shouldEmit = (getPublic( e.type ) !== type);
            break;

            case $_EVT.$set:
            case $_EVT.$unset:
                shouldEmit = true;
            break;
        }*/

        var type = $_shift( args );
        var pubArgs = $_pop( args );
        var shouldEmit = (getPublic( e.type ) !== type);

        /*if (e.type === '$$listener.triggered' && type === '$$gnarly') {
            MOJO.log(pubArgs);
        }*/

        //MOJO.log(e.type + ' -> ' + type);
        //MOJO.log(e.type,pubArgs);

        if (shouldEmit) {
            that.$emit( getPublic( e.type ) , pubArgs );
        }

        if (e.type === $_EVT.$emit && !isPrivate( type )) {
            //MOJO.log(pubArgs);
            $_forEach( that.watchers , function( watcher ) {
                //MOJO.log(watcher);
                watcher.$emit.apply( watcher , pubArgs );
            });
        }

        if (e.type === $_EVT.$emit && isPrivate( type )) {
            /*var pubArgs2 = pubArgs.slice( 0 );
            pubArgs2[0] = getPublic( type );
            //that.$emit.apply( that , pubArgs );
            MOJO.log(pubArgs2);
            MOJO.log(pubArgs);*/
            that.$emit( getPublic( type ) , pubArgs[1] );
        }
    };

    proto.$set = function( key , value ) {
        var that = this;
        that[key] = value;
        that.$emit( $_EVT.$set , [ key , [ key ]]);
        return that;
    };

    proto.$unset = function( key ) {
        var that = this;
        $_delete( that , key );
        that.$emit( $_EVT.$unset , [ key , [ key ]]);
        return that;
    };

    proto.$watch = function( parent ) {
        
        var that = this;

        if (!$_is( parent , MOJO )) {
            throw new $Error( 'parent must be a MOJO' );
        }

        var watchers = parent.watchers;
        var index = $_indexOf( watchers , that );

        if (index < 0) {
            watchers.push( that );
            that.$once( $_EVT.$deref , function( e ) {
                if (index >= 0) {
                    watchers.splice( index , 1 );
                }
            });
        }

        return that;
    };

    proto.$deref = function() {
        var that = this;
        that.$emit( $_EVT.$deref );
        //that.$dispel( null , null , true );
    };

    proto.$enq = function( task ) {
        var that = this;
        that.__stack.push( task );
    };

    proto.$digest = function() {
        
        var that = this;
        var stack = that.__stack;

        if (that.__inprog) {
            //MOJO.log('--- INPROG ---',stack.length);
            return;
        }

        that.__inprog = true;

        while ($_length( stack ) > 0) {
            $_shift( stack )();
        }
        
        that.__inprog = false;
    };

    return proto;
}



















