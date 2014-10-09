MOJO.aggregate = MOJO.inject(
[
    MOJO,
    'ensureArray',
],
function(
    MOJO,
    ensureArray
){

    function aggregate( arr ) {

        var aggregator = new MOJO();

        ensureArray( arr ).forEach(function() {

        });
    }

    return aggregate;
});



















