import proto from 'proto';
import {
    $_create
} from 'static/shared';


export default function( subject ) {

    var mojo_proto = $_create( proto );

    for (var key in subject) {
        mojo_proto[key] = subject[key];
    }

    return mojo_proto;
}



















