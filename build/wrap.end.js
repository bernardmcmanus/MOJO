    
    var MOJO = require( 'MOJO' );
    
    MOJO.prototype = require( 'proto' );
    MOJO.create = require( 'create' );
    MOJO.construct = require( 'construct' );
    MOJO.aggregate = require( 'aggregate' );
    MOJO.Event = require( 'Event' );
    MOJO.EventHandler = require( 'EventHandler' );
    MOJO.$_EVT = $_EVT;
    
    return MOJO;
}));