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

		MOJO.Hoist( that );
	}


	var MOJO_prototype = (MOJO.prototype = new _MOJO.When());


	MOJO_prototype.indexOfValue = function( val ) {
		return this.values.indexOf( val );
	};


	MOJO_prototype.keyOfValue = function( val ) {
		var that = this;
		if (that.hasValue( val )) {
			return that.keys[ that.indexOfValue( val ) ];
		}
		return false;
	};


	MOJO_prototype.hasValue = function( val ) {
		return this.indexOfValue( val ) >= 0;
	};


	MOJO_prototype.nextKey = function( key ) {
		if (!key) {
			return this.keys[0];
		}
		var keys = this.keys;
		var index = keys.indexOf( key );
		return index < keys.length - 1 ? keys[index+1] : false;
	};


	MOJO_prototype.set = function( key , value ) {
		var that = this;
		that[key] = value;
		that.happen( 'set' , key );
		return that[key];
	};


	MOJO_prototype.remove = function( key ) {
		var that = this;
		delete that[key];
		that.happen( 'remove' , key );
	};


	return MOJO;


}( window._MOJO ));




















