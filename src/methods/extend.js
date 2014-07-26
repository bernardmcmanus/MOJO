MOJO.Extend = (function() {


    /*
    **  Written by Luke "Famous" Wilson
    **  http://bootylist.com
    */


    function Extend() {
        var destination = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
        for(var i = 0; i < args.length; i++){
            for(var key in args[i]){
                var value = args[i][key];
                if(value !== undefined){
                    if(value !== null && typeof(value) == 'object' && !value.nodeType ){
                        if( value instanceof Array){
                            destination[key] = Extend([], value);
                        }else{
                            destination[key] = Extend({}, value);
                        }
                    }else{
                        destination[key] = value; 
                    }
                }
            }
        }
    }


    return Extend;

    
}());



























