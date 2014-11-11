import {
  $_slice,
  $_ensureArray
} from 'static/shared';

export default function( func , context , bindArgs ) {

  var that = this;

  that.func = func;
  that.locked = false;
  that.active = true;
  that.events = [];
  that.before = function() {};
  that.after = function() {};

  bindArgs = $_ensureArray( bindArgs );

  that.invoke = function( event , invArgs ) {
    
    if (!that.active || event.cancelBubble) {
      return;
    }

    var args = $_slice( bindArgs ).concat(
      $_ensureArray( invArgs )
    );

    args.unshift( event );
    that.before( event , func );
    func.apply( context , args );
    that.after( event , func );
  };
}



















