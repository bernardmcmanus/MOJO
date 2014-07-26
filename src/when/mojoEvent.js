_MOJO.Event = (function() {


	function Event( target , type ) {
		var that = this;
		var f = false;
		that.isBreak = f;
		that.cancelBubble = f;
		that.defaultPrevented = f;
		that.skipHandlers = [];
		that.target = target;
		that.type = type;
		that.timeStamp = Date.now();
	}


	Event.prototype = {

		skip: function( handler ) {
			this.skipHandlers.push( handler );
		},

		shouldSkip: function( handler ) {
			return this.skipHandlers.indexOf( handler ) >= 0;
		},

		break: function() {
			this.isBreak = true;
		},

		preventDefault: function() {
			this.defaultPrevented = true;
		},

		stopPropagation: function() {
			this.cancelBubble = true;
		}
	};


	return Event;

	
}());



























