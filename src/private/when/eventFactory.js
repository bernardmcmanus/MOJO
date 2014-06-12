_MOJO.EventFactory = (function() {


	function EventFactory( target , type ) {
		return new MOJOEvent( target , type );
	}


	function MOJOEvent( target , type ) {
		var that = this;
		that.bubbles = false;
		that.cancelBubble = false;
		that.cancelable = false;
		that.defaultPrevented = false;
		that.target = target;
		that.type = type;
		that.timeStamp = new Date().getTime();
	}


	MOJOEvent.prototype = {

		preventDefault: function() {
			this.defaultPrevented = true;
		},

		stopPropagation: function() {
			this.cancelBubble = true;
		}
	};


	return EventFactory;

	
}());



























