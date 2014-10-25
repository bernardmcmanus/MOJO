(function ( root , factory ) {
    if (typeof define === 'function' && define.amd) {
        define([] , factory );
    }
    else {
        root.MOJO = factory();
    }
}( this , function() {