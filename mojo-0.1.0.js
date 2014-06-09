/*! MOJO - 0.1.0 - Bernard McManus - 2014-06-08 */


window._MOJO = {};
window.MOJO = {};
_MOJO.CompareArray = (function() {

	function CompareArray( subject , array ) {
		
		if (subject.length != array.length) {
			return false;
		}

		for (var i = 0, l = subject.length; i < l; i++) {
			if (subject[i] instanceof Array && array[i] instanceof Array) {
				if (!subject[i].compare( array[i] )) {
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


	//var ObjectOrder_prototype = (ObjectOrder.prototype = Object.create( Array.prototype ));


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

			console.log(addKeys);

			var removeKeys = order.filter(function( key , i ) {
				return keys.indexOf( key ) < 0;
			});

			console.log(removeKeys);

			order = ([]).concat( order.slice() ).concat( addKeys );

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

        //context = context || null;
        //var _handler = handler.bind( context );
        //var _handler = handler;

        var _handler = new EventHandler( handler );
        _handler.setArgs( args );

        this._addHandler( event , _handler );
    };


    When_prototype.happen = function( event , args ) {

        var handlers = this._getHandlers( event );

        handlers.forEach(function( handler ) {
            handler.concatArgs( args );
            handler.invoke();
            handler.purge();
            //func.apply( null , args );
        });
    };


    When_prototype.dispel = function( event , handler ) {

        var that = this;
        var handlers = that._getHandlers();

        if (handler) {

            var eventHandlers = handlers[event];
            
            if (!eventHandlers || eventHandlers.length < 1) {
                return;
            }
            
            var i = eventHandlers.indexOf( handler );

            if (i < 0) {
                return;
            }

            eventHandlers = eventHandlers.splice( i , 1 );
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


    When_prototype._getHandlers = function( event ) {
        var handlers = this.handlers;
        return (event ? (handlers[event] || []) : handlers);
    };


    function whenModule() {}


    function EventHandler( func ) {
        this.handler = func;
        this.context = null;
        this.args = [];
    }


    EventHandler.prototype = {

        invoke: function() {
            var that = this;
            var args = that.getArgs();
            that.handler.apply( that.context , args );
        },

        getArgs: function() {
            return this.args || [];
        },

        setArgs: function( args ) {
            this.args = args;
        },

        concatArgs: function( args ) {
            var that = this;
            var thisargs = that.getArgs();
            that.args = thisargs.concat( args );
        },

        purge: function() {
            this.setArgs( [] );
        }
    };


    return When;

    
}());




























MOJO = (function( _MOJO ) {


	var Instances = (MOJO.instances = function() {
		// allow selecting instances with selectors
	});


	MOJO.select = function() {
		// allow selecting instances with selectors
	};


	MOJO.trigger = function() {
		// trigger events for all or selected instances
	};


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


	MOJO_prototype.each = function(/* exposeIterator , callback */) {

		var exposeIterator, callback;

		if (arguments.length > 1) {
			exposeIterator = arguments[0];
			callback = arguments[1];
		}
		else {
			callback = arguments[0];
		}

		var that = this;
		var keys = that.keys;
		var iterator = {};
		var i;

		if (exposeIterator) {

			iterator = new MOJO.Iterator();

			iterator.setIncrementor(function() {
				i++;
			});

			iterator.setDecrementor(function() {
				i--;
			});
		}

		for (i = 0; i < keys.length; i++) {

			var key = keys[i];

			if (exposeIterator) {
				/*iterator.setUpdater(function( val ) {
					that[key] = val;
				});*/
			}

			var args = [ iterator , that[key] , key , i ];

			if (!exposeIterator) {
				args.shift();
			}

			callback.apply( that , args );

			if (iterator.isBreak) {
				break;
			}
		}
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


	MOJO_prototype.set = function( key , value ) {
		var that = this;
		that[key] = value;
		that._order.add( key );
		that.happen( 'change' , [ 'set' , key ] );
		return that[key];
	};


	MOJO_prototype.remove = function( key ) {
		var that = this;
		if (!that.hasKey( key )) {
			return;
		}
		delete that[key];
		that._order.remove( key );
		that.happen( 'change' , [ 'remove' , key ] );
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





















MOJO.Iterator = (function() {


	function Iterator() {
		this.isBreak = false;
		this.isContinue = false;
		this._incrementor = function() {};
		this._decrementor = function() {};
		this._updater = function() {};
	}


	var Iterator_prototype = (
		Iterator.prototype = Object.create( Number.prototype )
	);


	Iterator_prototype.setIncrementor = function( func ) {
		this._incrementor = func;
	};


	Iterator_prototype.inc = function() {
		this._incrementor();
	};


	Iterator_prototype.setDecrementor = function( func ) {
		this._decrementor = func;
	};


	Iterator_prototype.dec = function() {
		this._decrementor();
	};


	Iterator_prototype.setUpdater = function() {
		this._updater = func;
	};


	Iterator_prototype.update = function( val ) {
		this._updater( val );
	};


	Iterator_prototype.break = function() {
		this.isBreak = true;
	};


	return Iterator;


}());


























