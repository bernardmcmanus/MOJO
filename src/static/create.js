define([ 'proto' ] , function( prototype ) {

    return function( proto ) {

        var mojo_proto = $_create( prototype );

        for (var key in proto) {
            mojo_proto[key] = proto[key];
        }

        return mojo_proto;
    };
});



















