import E$ from 'main';
import proto from 'proto';
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

export default E$;