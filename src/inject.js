define([ 'MOJO' , 'shared' ] , function( MOJO , shared ) {

    var is = shared.is;

    function inject( dependencies , callback ) {

        var that = this;

        dependencies = dependencies.map(function( subject ) {
            
            var out;

            if (is( subject , 'string' )) {
                out = shared[subject];
            }
            else {
                out = subject;
            }

            return out;
        });

        return callback.apply( null , dependencies );
    }

    return inject;
});



















