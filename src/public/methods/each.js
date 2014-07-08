MOJO.Each = (function() {


    function Each( subject , iterator , keys ) {

        keys = keys || Object.keys( subject );

        for (var i = 0; i < keys.length; i++) {
            iterator( subject[keys[i]] , keys[i] , i );
        }
    }


    return Each;

    
}());



























