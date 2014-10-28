import MOJO from 'main';
import proto from 'proto';

import aggregate from 'static/aggregate';
import construct from 'static/construct';
import create from 'static/create';
import { $_EVT } from 'static/shared';

//import Event from 'event';
//import EventHandler from 'eventHandler';

MOJO.prototype = proto;
MOJO.create = create;
MOJO.construct = construct;
MOJO.aggregate = aggregate;
//MOJO.Event = Event;
//MOJO.EventHandler = EventHandler;
MOJO.$_EVT = $_EVT;

export default MOJO;