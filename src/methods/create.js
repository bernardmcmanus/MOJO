MOJO.Create = (function() {


    function Create( proto ) {

        var mojo_proto = Object.create( MOJO.prototype );

        MOJO.Each( proto , function( method , name ) {
            mojo_proto[name] = method;
        });

        return mojo_proto;
    }


    return Create;

    
}());



























