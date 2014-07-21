MOJO = (function( _MOJO ) {


	function MOJO( seed ) {

		seed = seed || {};

		var that = this;

		MOJO.Each( seed , function( val , key ) {
			that[key] = val;
		});

		MOJO.Hoist( that );
	}


	var MOJO_prototype = (MOJO.prototype = new _MOJO.When());


	MOJO_prototype.each = function( iterator ) {
		var that = this;
		MOJO.Each( that , iterator , that.keys );
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


}( _MOJO ));




















