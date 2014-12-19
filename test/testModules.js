import {
  $EVT,
  $SET,
  $UNSET,
  $WHEN,
  $EMIT,
  $DISPEL,
  $DEREF
} from 'static/constants';
import EventHandler from 'eventHandler';
import {
  Event,
  isPrivate
} from 'event';


module.exports = {
  $SET: $SET,
  $UNSET: $UNSET,
  $WHEN: $WHEN,
  $EMIT: $EMIT,
  $DISPEL: $DISPEL,
  $DEREF: $DEREF,
  $EVT: $EVT,
  'Event': {
    constructor: Event,
    isPrivate: isPrivate
  },
  'EventHandler': EventHandler
};