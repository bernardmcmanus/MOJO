(function( Object , MOJO ) {

    var When = MOJO.when;

    MOJO.Create = MOJO.create;
    MOJO.Construct = MOJO.construct;
    MOJO.Each = function( subject , iterator ) {
        Object.keys( subject ).forEach(function( key , i ) {
            iterator( subject[key] , key , i );
        });
    };

    When.when = When.$when;
    When.once = When.$once;
    When.happen = When.$emit;
    When.dispel = When.$dispel;

}( Object , MOJO ));