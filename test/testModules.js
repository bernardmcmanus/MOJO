import { $_EVT , $_EVT_ARRAY } from 'static/shared';
import EventHandler from 'eventHandler';
import {
  Event,
  isPrivate
} from 'event';


module.exports = {
  '$_EVT': $_EVT,
  '$_EVT_ARRAY': $_EVT_ARRAY,
  'Event': {
    constructor: Event,
    isPrivate: isPrivate
  },
  'EventHandler': EventHandler
};