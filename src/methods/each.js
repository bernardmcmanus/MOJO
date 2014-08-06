MOJO.Each = (function( Keys ) {


    function Each( subject , iterator , keys ) {

        (keys || Keys( subject )).forEach(function( key , i ) {
            iterator( subject[key] , key , i );
        });
    }


    return Each;

    
}( _MOJO.Shared.keys ));



























