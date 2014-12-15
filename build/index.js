import E$ from 'main';
import proto from 'proto';
//import aggregate from 'static/aggregate';
import construct from 'static/construct';
import create from 'static/create';
import isE$ from 'static/is-emoney';
import {
  $_defineProto,
  $_PROTO
} from 'static/shared';

E$[$_PROTO] = $_defineProto( proto );
E$.isE$ = isE$;
E$.create = create;
E$.construct = construct;
//E$.aggregate = aggregate;

export default E$;