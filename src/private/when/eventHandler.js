_MOJO.EventHandler = (function() {


	function EventHandler( func ) {
		var that = this;
		that.handler = func;
		that.args = [];
	}


	var EventHandler_prototype = (EventHandler.prototype = {});


	EventHandler_prototype.invoke = function( event , args ) {
		var that = this;
		var Args = that.getArgs().concat( args || [] );
		Args.unshift( event );
		that.handler.apply( null , Args );
	};


	EventHandler_prototype.getArgs = function() {
		return this.args || [];
	};


	EventHandler_prototype.bind = function( args ) {
		if (args === undefined) {
			return;
		}
		this.args = args instanceof Array ? args : [ args ];
	};


	return EventHandler;

	
}());



























