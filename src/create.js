define([ 'inject' , 'proto' ] , function( inject , prototype ) {

    return inject([ 'ocreate' ] , function( ocreate ){

        function create( proto ) {

            var mojo_proto = ocreate( prototype );

            for (var key in proto) {
                mojo_proto[key] = proto[key];
            }

            return mojo_proto;
        }

        return create;
    });
});



















