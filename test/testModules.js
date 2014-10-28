import { $_EVT } from 'shared';
import EventHandler from 'eventHandler';
import {
    Event,
    isPrivate,
    getPublic
} from 'event';


Event.isPrivate = isPrivate;
Event.getPublic = getPublic;


module.exports = {
    '$_EVT': $_EVT,
    'Event': Event,
    'EventHandler': EventHandler
};