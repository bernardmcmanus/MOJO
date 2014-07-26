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
			var handlerFunc = that.handler;

			if (!that.active || event.isBreak || event.shouldSkip( handlerFunc )) {
				return;
			}

			var Args = that.args.concat( args !== undefined ? args : [] );
			Args.unshift( event );
			handlerFunc.apply( null , Args );
			that.callback( event , handlerFunc );
		}
	};


	return EventHandler;

	
}());



























