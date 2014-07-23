_MOJO.EventHandler = (function() {


	function EventHandler( func , args ) {

		var that = this;

		that.handler = func;
		that.active = true;
		that.callback = function() {};

		that.args = (function( args ) {
			args = (args !== undefined ? args : []);
			return (args instanceof Array ? args : [ args ]);
		}( args ));
	}


	EventHandler.prototype = {

		invoke: function( event , args ) {
			
			var that = this;

			if (!that.active) {
				return;
			}

			var Args = that.args.concat( args || [] );
			var handler = that.handler;
			Args.unshift( event );
			handler.apply( null , Args );
			that.callback( event , handler );
		}
	};


	return EventHandler;

	
}());



























