_MOJO.Event = (function() {


	var T = true;
	var F = false;


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

		skip: function( handler ) {
			this.skipHandlers.push( handler );
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

	
}());



























