MOJO.Each = (function() {


    function Each( subject , iterator , keys ) {

        (keys || Object.keys( subject )).forEach(function( key , i ) {
            iterator( subject[key] , key , i );
        });
    }


    return Each;

    
}());



























