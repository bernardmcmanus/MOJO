_MOJO.Event = (function() {


	function Event( target , type ) {
		var that = this;
		var f = false;
		that.bubbles = f;
		that.cancelBubble = f;
		that.cancelable = f;
		that.defaultPrevented = f;
		that.target = target;
		that.type = type;
		that.timeStamp = Date.now();
	}


	Event.prototype = {

		preventDefault: function() {
			this.defaultPrevented = true;
		},

		stopPropagation: function() {
			this.cancelBubble = true;
		}
	};


	return Event;

	
}());



























