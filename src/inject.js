MOJO.inject = (function( MOJO ) {


    var shared = MOJO.shared;
    var pop = shared.pop;
    var has = shared.has;
    var is = shared.is;


    function inject() {

        var that = this;
        var args = arguments;
        var callback = pop( args );
        var imports = pop( args );

        imports = imports.map(function( subject ) {
            
            var out;

            if (is( subject , 'string' )) {
                if (has( shared , subject )) {
                    out = shared[subject];
                }
                else {
                    out = MOJO[subject];
                }
            }
            else {
                out = subject;
            }

            return out;
        });

        return callback.apply( null , imports );
    }


    return inject;


}( MOJO ));



















