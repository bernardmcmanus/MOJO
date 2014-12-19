import {
  $Date,
  $CANCEL_BUBBLE,
  $DEFAULT_PREVENTED,
  $EVT,
  $PROTO
} from 'static/constants';
import { $_indexOf } from 'static/shared';


export default Event;


export function Event( target , type ) {
  var that = this;
  that.target = target;
  that.type = type;
  that[$CANCEL_BUBBLE] = false;
  that[$DEFAULT_PREVENTED] = false;
  that.timeStamp = $Date.now();
}


Event[$PROTO] = {

  preventDefault: function() {
    this[$DEFAULT_PREVENTED] = true;
  },

  stopPropagation: function() {
    this[$CANCEL_BUBBLE] = true;
  }
};


export function isPrivate( type ) {
  return $_indexOf( $EVT , type ) >= 0;
}



















