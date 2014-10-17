(function( Object , MOJO ) {

    var when = MOJO.when;

    MOJO.Create = MOJO.create;
    MOJO.Construct = MOJO.construct;
    MOJO.Each = function( subject , iterator ) {
        Object.keys( subject ).forEach(function( key , i ) {
            iterator( subject[key] , key , i );
        });
    };

    when.when = when.$when;
    when.once = when.$once;
    when.happen = when.$emit;
    when.dispel = when.$dispel;

}( Object , MOJO ));