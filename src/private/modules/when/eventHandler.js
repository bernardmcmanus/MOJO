_MOJO.When.EventHandler = (function() {


	function EventHandler( func ) {
		this.handler = func;
		this.context = null;
		this.args = [];
	}


	var EventHandler_prototype = (EventHandler.prototype = {});


	EventHandler_prototype.invoke = function( args ) {
		var that = this;
		var Args = that.getArgs().concat( args || [] );
		that.handler.apply( that.context , Args );
	};


	EventHandler_prototype.getArgs = function() {
		return this.args || [];
	};


	EventHandler_prototype.bind = function( args ) {
		this.args = args;
	};


	return EventHandler;

	
}());



























