import {
  $Date,
  $_indexOf,
  $_EVT_ARRAY,
  $_PROTO
} from 'static/shared';


var CANCEL_BUBBLE = 'cancelBubble';
var DEFAULT_PREVENTED = 'defaultPrevented';


export default Event;


export function Event( target , type ) {
  var that = this;
  that.target = target;
  that.type = type;
  that[CANCEL_BUBBLE] = false;
  that[DEFAULT_PREVENTED] = false;
  that.timeStamp = $Date.now();
}


Event[$_PROTO] = {

  preventDefault: function() {
    this[DEFAULT_PREVENTED] = true;
  },

  stopPropagation: function() {
    this[CANCEL_BUBBLE] = true;
  }
};


export function isPrivate( type ) {
  return $_indexOf( $_EVT_ARRAY , type ) >= 0;
}



















