MOJO = (function( _MOJO ) {


	function MOJO( seed ) {

		seed = seed || {};

		var that = this;

		MOJO.Each( seed , function( val , key ) {
			that[key] = val;
		});

		MOJO.Construct( that );
	}


	var MOJO_prototype = (MOJO.prototype = Object.create( _MOJO.When ));


	MOJO_prototype.each = function( iterator ) {
		var that = this;
		MOJO.Each( that , iterator , that.keys );
		return that;
	};


	MOJO_prototype.set = function( key , value ) {
		var that = this;
		that[key] = value;
		that.happen( 'set' , key );
		return that;
	};


	MOJO_prototype.remove = function( key ) {
		var that = this;
		delete that[key];
		that.happen( 'remove' , key );
		return that;
	};


	return MOJO;


}( _MOJO ));




















