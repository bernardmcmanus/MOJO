/*! MOJO - 0.1.0 - Bernard McManus - 2014-06-09 */


window._MOJO = {};
window.MOJO = {};
_MOJO.CompareArray = (function() {

	function CompareArray( subject , array ) {
		
		if (subject.length != array.length) {
			return false;
		}

		for (var i = 0, l = subject.length; i < l; i++) {
			if (subject[i] instanceof Array && array[i] instanceof Array) {
				if (!CompareArray( subject[i] , array[i] )) {
					return false;
				}
			}
			else if (subject[i] != array[i]) {
				return false;
			}
		}

		return true;
	}

	return CompareArray;
	
}());




























_MOJO.ObjectOrder = (function() {


	function ObjectOrder() {
		this.order = [];
	}


	var ObjectOrder_prototype = (ObjectOrder.prototype = {});


	ObjectOrder_prototype.add = function( key ) {
		var order = this.order;
		var i = order.indexOf( key );
		if (i < 0) {
			order.push( key );
		}
	};


	ObjectOrder_prototype.remove = function( key ) {
		var order = this.order;
		var i = order.indexOf( key );
		if (i >= 0) {
			order.splice( i , 1 );
		}
	};


	ObjectOrder_prototype.update = function( keys ) {

		var that = this;
		var order = that.order;

		if (!_MOJO.CompareArray( order , keys )) {

			console.log('array compare failed');

			var addKeys = keys.filter(function( key , i ) {
				return order.indexOf( key ) < 0;
			});

			var removeKeys = order.filter(function( key , i ) {
				return keys.indexOf( key ) < 0;
			});

			order = order.concat( addKeys );

			order = order.filter(function( key , i ) {
				return removeKeys.indexOf( key ) < 0;
			});
		}

		that.order = order;
		return order;
	};


	return ObjectOrder;

	
}());




























_MOJO.When = (function() {


    function When() {
        this.handlers = new whenModule();
    }


    var When_prototype = (When.prototype = {});


    When_prototype.when = function( event , handler , args ) {

        if (!event || (!handler || typeof handler !== 'function')) {
            throw 'Error: Invalid when args.';
        }

        var _handler = new _MOJO.When.EventHandler( handler );
        _handler.bind( args );

        this._addHandler( event , _handler );
    };


    When_prototype.happen = function( event , args ) {

        var handlers = this._getHandlers( event );

        handlers.forEach(function( handler ) {
            handler.invoke( args );
        });
    };


    When_prototype.dispel = function( event , handler ) {

        var that = this;
        var handlers = that._getHandlers();

        if (handler) {
            that._removeHandler( event , handler );
        }
        else {
            delete handlers[event];
        }
    };


    When_prototype._addHandler = function( event , handler ) {
        var that = this;
        var handlers = that.handlers;
        (handlers[event] = handlers[event] || []).push( handler );
    };


    When_prototype._removeHandler = function( event , handler ) {

        var that = this;
        var eventHandlers = that._getHandlers( event );
            
        if (!eventHandlers || eventHandlers.length < 1) {
            return;
        }

        var i = 0, _handler;

        while (i < eventHandlers.length) {
            _handler = eventHandlers[i].handler;
            if (_handler === handler) {
                break;
            }
            i++;
        }

        if (i < 0 || i >= eventHandlers.length) {
            return;
        }

        eventHandlers = eventHandlers.splice( i , 1 );
    };


    When_prototype._getHandlers = function( event ) {
        var handlers = this.handlers;
        return (event ? (handlers[event] || []) : handlers);
    };


    function whenModule() {}


    return When;

    
}());




























_MOJO.When.EventHandler = (function() {


	function EventHandler( func ) {
		this.handler = func;
		this.context = null;
		this.args = [];
	}


	var EventHandler_prototype = (EventHandler.prototype = {});


	EventHandler_prototype.invoke = function( args ) {
		var that = this;
		var Args = that.getArgs().concat( args || [] );
		that.handler.apply( that.context , Args );
	};


	EventHandler_prototype.getArgs = function() {
		return this.args || [];
	};


	EventHandler_prototype.bind = function( args ) {
		this.args = args;
	};


	return EventHandler;

	
}());




























MOJO = (function( _MOJO ) {


	var Instances = (MOJO.instances = function() {
		// allow selecting instances with selectors
	});


	function MOJO( seed ) {

		seed = seed || {};

		if (seed instanceof MOJO) {
			return seed;
		}

		var that = this;
		var order = new _MOJO.ObjectOrder();

		for (var key in seed) {
			order.add( key );
			that[key] = seed[key];
		}

		Object.defineProperty( that , '_order' , {
			value: order
		});

		Object.defineProperty( that , 'order' , {
			get: function() {
				return order.update( that.keys );
			}
		});

		Object.defineProperty( that , 'keys' , {
			get: function() {
				return Object.keys( that );
			}
		});

		Object.defineProperty( that , 'values' , {
			get: function() {
				return that.keys.map(function( key , i ) {
					return that[key];
				});
			}
		});

		Object.defineProperty( that , 'length' , {
			get: function() {
				return that.keys.length;
			}
		});
	}


	var MOJO_prototype = (MOJO.prototype = Object.create( new _MOJO.When() ));


	MOJO_prototype.each = function() {

		var args = arguments;
		var length = args.length;
		var exposeIterator = (length > 1 ? args[0] : false);
		var callback = args[length - 1];

		MOJO.each( exposeIterator , this , callback );
		return this;
	};


	MOJO_prototype.hasKey = function( key ) {
		return this.keys.indexOf( key ) >= 0;
	};


	MOJO_prototype.indexOfKey = function( key ) {
		return this.order.indexOf( key );
	};


	MOJO_prototype.hasValue = function( val ) {
		return this.values.indexOf( val ) >= 0;
	};


	MOJO_prototype.indexOfValue = function( val ) {
		return this.values.indexOf( val );
	};


	MOJO_prototype.getNthKey = function( n ) {
		return this.order[n];
	};


	MOJO_prototype.set = function( key , value ) {
		var that = this;
		that[key] = value;
		that._order.add( key );
		var index = that.indexOfKey( key );
		that.happen( 'set' , [ key , index ] );
		return that[key];
	};


	MOJO_prototype.remove = function( key ) {
		var that = this;
		if (!that.hasKey( key )) {
			return;
		}
		var index = that.indexOfKey( key );
		delete that[key];
		that._order.remove( key );
		that.happen( 'remove' , [ key , index ] );
	};


	MOJO_prototype._getEach = function( key ) {
		// byval
		// bykey
		return this[key];
	};


	MOJO_prototype._setEach = function( key , value ) {
		// byval
		// bykey
		this[key] = value;
		return this[key];
	};


	MOJO_prototype._removeEach = function( key ) {
		// byval
		// bykey
		delete this[key];
	};


	return MOJO;


}( window._MOJO ));





















/*
**  Written by Luke "Famous" Wilson
**  http://bootylist.com/
*/

MOJO.Extend = (function() {


    function Extend() {
        var destination = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
        for(var i = 0; i < args.length; i++){
            for(var key in args[i]){
                var value = args[i][key];
                if(value !== 'undefined'){
                    if(value !== null && typeof(value) == 'object' && !value.nodeType ){
                        if( value instanceof Array){
                            destination[key] = this.extend([], value);
                        }else{
                            destination[key] = this.extend({}, value);
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




























MOJO.select = (function() {


    function select( selector ) {
        // allow selecting instances with selectors
    }


    return select;

    
}());




























MOJO.when = (function() {


    function when( event , handler ) {
        // bind events for all or selected instances
    }


    return when;

    
}());




























MOJO.happen = (function() {


    function happen( event , args ) {
        // trigger events for all or selected instances
    }


    return happen;

    
}());




























MOJO.dispel = (function() {


    function dispel( event , args ) {
        // remove listeners for all or selected instances
    }


    return dispel;

    
}());




























MOJO.Iterator = (function() {


	function Iterator( subject , expose ) {

		var that = this;

		that.isBreak = false;
		that.count = 0;
		that.expose = expose;

		subject.when( 'remove' , onRemove , [ that ] );
	}


	var Iterator_prototype = (Iterator.prototype = {});


	Iterator_prototype.hasNext = function( subject ) {
		
		var that = this;

		if (that.isBreak) {
			return false;
		}

		var next = false;

		if (that.count < subject.length) {
			next = that.getArgs( subject );
		}

		that.inc( 1 );

		return next;
	};


	Iterator_prototype.getArgs = function( subject ) {

		var that = this;

		var i = that.count;
		var key = subject.order[i];
		var value = subject[key];

		var args = [ value , key , i ];

		if (that.expose) {
			args.unshift( that );
		}

		return args;
	};


	Iterator_prototype.inc = function( val ) {
		this.count += val;
	};


	Iterator_prototype.break = function() {
		this.isBreak = true;
	};


	Iterator_prototype.garbage = function( subject ) {
		subject.dispel( 'remove' , onRemove );
	};


	function onRemove( iterator ) {
		iterator.inc( -1 );
	}


	return Iterator;


}());


























