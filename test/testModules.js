import { $_EVT } from 'static/shared';
import EventHandler from 'eventHandler';
import {
  Event,
  isPrivate,
  getPublic
} from 'event';


module.exports = {
  '$_EVT': $_EVT,
  'Event': {
    constructor: Event,
    isPrivate: isPrivate,
    getPublic: getPublic
  },
  'EventHandler': EventHandler
};