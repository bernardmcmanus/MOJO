//import E$ from 'main';
import when from 'when';
import construct from 'static/construct';
import {
  $SET,
  $UNSET
} from 'static/constants';
import {
  $_create,
  $_delete,
  $_shift,
  $_length
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

  proto.$set = function( key , value ) {
    var that = this;
    that[key] = value;
    that.$emit( $SET , [ key , [ key ]]);
    return that;
  };

  proto.$unset = function( key ) {
    var that = this;
    $_delete( that , key );
    that.$emit( $UNSET , [ key , [ key ]]);
    return that;
  };

  proto.$enq = function( task ) {
    var that = this;
    that.__stack.push( task );
  };

  proto.$flush = function() {
    
    var that = this;
    var stack = that.__stack;

    if (that.__inprog) {
      //E$.log('inprog');
      return;
    }

    that.__inprog = true;

    while ($_length( stack )) {
      $_shift( stack )();
    }
    
    that.__inprog = false;
  };

  return proto;
}



















