MOJO.inject = (function( MOJO ) {


    var shared = MOJO.shared;
    var pop = shared.pop;
    var has = shared.has;
    var is = shared.is;


    function inject() {

        var that = this;
        var args = arguments;
        var callback = pop( args );
        var dependencies = pop( args );
        var id = pop( args );

        dependencies = dependencies.map(function( subject ) {
            
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

        MOJO[id] = callback.apply( null , dependencies );
    }


    return inject;


}( MOJO ));



















