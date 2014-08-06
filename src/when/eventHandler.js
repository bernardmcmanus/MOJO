_MOJO.EventHandler = (function( Shared ) {


	var EnsureArray = Shared.ensureArray;


	function EventHandler( handler , context , args ) {

		var that = this;

		that.handler = handler;
		that.context = context;
		that.active = true;
		that.callback = function() {};

		that.args = EnsureArray( args );
	}


	EventHandler.prototype = {

		invoke: function( event , args ) {
			
			var that = this;
			var handlerFunc = that.handler;

			if (!that.active || event.isBreak || event.shouldSkip( handlerFunc )) {
				return;
			}

			var Args = that.args.concat(
				EnsureArray( args )
			);

			Args.unshift( event );
			handlerFunc.apply( that.context , Args );
			that.callback( event , handlerFunc );
		}
	};


	return EventHandler;

	
}( _MOJO.Shared ));



























