MOJO.inject( 'create' ,
[
    MOJO,
    'ocreate'
],
function(
    MOJO,
    ocreate
){

    function create( proto ) {

        var mojo_proto = ocreate( MOJO.prototype );

        for (var key in proto) {
            mojo_proto[key] = proto[key];
        }

        return mojo_proto;
    }

    return create;
});



















