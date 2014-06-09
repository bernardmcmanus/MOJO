MOJO.Iterator = (function() {


	function Iterator( subject , expose ) {

		var that = this;

		that.isBreak = false;
		that.count = 0;
		that.expose = expose;

		subject.when( 'remove' , onRemove , [ that ] );
	}


	var Iterator_prototype = (Iterator.prototype = {});


	Iterator_prototype.hasNext = function( subject ) {
		
		var that = this;

		if (that.isBreak) {
			return false;
		}

		var next = false;

		if (that.count < subject.length) {
			next = that.getArgs( subject );
		}

		that.inc( 1 );

		return next;
	};


	Iterator_prototype.getArgs = function( subject ) {

		var that = this;

		var i = that.count;
		var key = subject.order[i];
		var value = subject[key];

		var args = [ value , key , i ];

		if (that.expose) {
			args.unshift( that );
		}

		return args;
	};


	Iterator_prototype.inc = function( val ) {
		this.count += val;
	};


	Iterator_prototype.break = function() {
		this.isBreak = true;
	};


	Iterator_prototype.garbage = function( subject ) {
		subject.dispel( 'remove' , onRemove );
	};


	function onRemove( iterator ) {
		iterator.inc( -1 );
	}


	return Iterator;


}());


























