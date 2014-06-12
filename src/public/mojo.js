MOJO = (function( _MOJO ) {


	function MOJO( seed ) {

		seed = seed || {};

		var that = this;
		var keys = Object.keys( seed );
		var length = keys.length;

		for (var i = 0; i < length; i++) {
			var key = keys[i];
			that[key] = seed[key];
		}

		var handlers = {};

		Object.defineProperty( that , 'handlers' , {
			get: function() {
				return handlers;
			},
			set: function( value ) {
				handlers = value;
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


	var MOJO_prototype = (MOJO.prototype = new _MOJO.When());


	MOJO_prototype.hasValue = function( val ) {
		return this.values.indexOf( val ) >= 0;
	};


	MOJO_prototype.indexOfValue = function( val ) {
		return this.values.indexOf( val );
	};


	MOJO_prototype.set = function( key , value ) {
		var that = this;
		that[key] = value;
		that.happen( 'set' , key );
		return that[key];
	};


	MOJO_prototype.remove = function( key ) {
		var that = this;
		if (!that.hasOwnProperty( key )) {
			return;
		}
		delete that[key];
		that.happen( 'remove' , key );
	};


	return MOJO;


}( window._MOJO ));




















