_MOJO.EventHandler = (function() {


	function EventHandler( func , args ) {

		var that = this;

		that.handler = func;
		that.callback = function() {};

		that.args = (function( args ) {
			args = (args !== undefined ? args : []);
			return (args instanceof Array ? args : [ args ]);
		}( args ));
	}


	EventHandler.prototype = {

		invoke: function( event , args ) {
			var that = this;
			var Args = that.args.concat( args || [] );
			Args.unshift( event );
			that.handler.apply( null , Args );
			that.callback( event , that.handler );
		}
	};


	return EventHandler;

	
}());



























