import MOJO from 'main';
import { isPrivate } from 'event';
import {
    $Error,
    $_forEach,
    $_keys,
    $_EVT
} from 'static/shared';


export default function( arr ) {

    var aggregator = new MOJO();

    $_forEach( arr , function( aggregatee ) {
        $_forEach( $_keys( $_EVT ) , function( key ) {
            aggregator.$when( $_EVT[key] , function( e , type , args ) {
                if (isPrivate( type )) {
                    throw new $Error( 'private events cannot be aggregated' );
                }
                aggregatee[key].apply( aggregatee , args );
            });
        });
    });

    return aggregator;
};



















