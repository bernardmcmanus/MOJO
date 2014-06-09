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




















