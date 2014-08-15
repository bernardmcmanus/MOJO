MOJO.Each = (function( _MOJO ) {


    var Shared = _MOJO.Shared;


    var Keys = Shared.keys;


    function Each( subject , iterator , keys ) {

        (keys || Keys( subject )).forEach(function( key , i ) {
            iterator( subject[key] , key , i );
        });
    }


    return Each;

    
}( _MOJO ));



























