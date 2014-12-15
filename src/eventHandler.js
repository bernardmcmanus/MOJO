import {
  $_slice,
  $_ensureArray,
  $_PROTO
} from 'static/shared';

/*export default function( func , context , bindArgs ) {

  var that = this;

  that.func = func;
  //that.locked = false;
  that.active = true;
  //that.events = [];
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
}*/

export default function EventHandler( func , context , bindArgs ) {

  var that = this;

  that.func = func;
  that.context = context;
  //that.locked = false;
  //that.active = true;
  //that.events = [];
  that.before = function() {};
  that.after = function() {};

  that.bindArgs = $_ensureArray( bindArgs );
}

EventHandler[$_PROTO] = {

  invoke: function( evt , invArgs ) {

    var that = this;

    if (/*!that.active ||*/ evt.cancelBubble) {
      return;
    }

    var func = that.func;
    var args = $_slice( that.bindArgs ).concat(
      $_ensureArray( invArgs )
    );

    args.unshift( evt );
    that.before( evt , func );
    func.apply( that.context , args );
    that.after( evt , func );
  }

};



















