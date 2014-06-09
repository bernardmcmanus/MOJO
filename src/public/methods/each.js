MOJO.each = (function() {


    function each() {

        var eachArgs = arguments;
        var pop = Array.prototype.pop;

        var callback = pop.call( eachArgs );
        var subject = pop.call( eachArgs );
        var exposeIterator = eachArgs.length > 0 ? eachArgs[0] : false;       

        subject = new MOJO( subject );

        var iterator = new MOJO.Iterator( subject , exposeIterator );
        var callbackArgs;

        while (callbackArgs = iterator.hasNext( subject )) {
            callback.apply( subject , callbackArgs );
        }

        iterator.garbage( subject );
    }


    return each;

    
}());



























