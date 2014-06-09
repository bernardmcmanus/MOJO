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




















