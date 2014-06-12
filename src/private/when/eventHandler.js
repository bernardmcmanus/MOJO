_MOJO.EventHandler = (function() {


	function EventHandler( func ) {
		var that = this;
		that.handler = func;
		that.args = [];
	}


	EventHandler.prototype = {

		invoke: function( event , args ) {
			var that = this;
			var Args = that.getArgs().concat( args || [] );
			Args.unshift( event );
			that.handler.apply( null , Args );
		},

		getArgs: function() {
			return this.args || [];
		},

		bind: function( args ) {
			if (args === undefined) {
				return;
			}
			this.args = args instanceof Array ? args : [ args ];
		}
	};


	return EventHandler;

	
}());



























