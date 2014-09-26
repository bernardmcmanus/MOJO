MOJO.create = MOJO.inject(
[
    MOJO,
    'ocreate',
    'PROTO'
],
function(
    MOJO,
    ocreate,
    PROTO
){

    function create( proto ) {

        var mojo_proto = ocreate( MOJO[ PROTO ] );

        for (var key in proto) {
            mojo_proto[key] = proto[key];
        }

        return mojo_proto;
    }

    return create;
});



















