import $MOJO from 'main';
import proto from 'proto';
import aggregate from 'static/aggregate';
import construct from 'static/construct';
import create from 'static/create';
import {
  $_defineProto,
  $_PROTO
} from 'static/shared';

$MOJO[$_PROTO] = $_defineProto( proto );
$MOJO.create = create;
$MOJO.construct = construct;
$MOJO.aggregate = aggregate;

export default $MOJO;