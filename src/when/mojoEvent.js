_MOJO.Event = (function( Date , _MOJO ) {


	var T = true;
	var F = false;


	var Shared = _MOJO.Shared;


	var EnsureArray = Shared.ensureArray;
	var getHandlerFunc = Shared.getHandlerFunc;


	function Event( target , type ) {
		var that = this;
		that.isBreak = F;
		that.cancelBubble = F;
		that.defaultPrevented = F;
		that.skipHandlers = [];
		that.target = target;
		that.type = type;
		that.timeStamp = Date.now();
	}


	Event.prototype = {

		skip: function( handlers ) {
			var skipHandlers = this.skipHandlers;
			EnsureArray( handlers ).forEach(function( handler ) {
				skipHandlers.push(
					getHandlerFunc( handler )
				);
			});
		},

		shouldSkip: function( handler ) {
			return this.skipHandlers.indexOf( handler ) >= 0;
		},

		break: function() {
			this.isBreak = T;
		},

		preventDefault: function() {
			this.defaultPrevented = T;
		},

		stopPropagation: function() {
			this.cancelBubble = T;
		}
	};


	return Event;

	
}( Date , _MOJO ));



























