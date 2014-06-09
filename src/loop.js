MOJO.Iterator = (function() {


	function Iterator() {
		this.isBreak = false;
		this.isContinue = false;
		this._incrementor = function() {};
		this._decrementor = function() {};
		this._updater = function() {};
	}


	var Iterator_prototype = (
		Iterator.prototype = Object.create( Number.prototype )
	);


	Iterator_prototype.setIncrementor = function( func ) {
		this._incrementor = func;
	};


	Iterator_prototype.inc = function() {
		this._incrementor();
	};


	Iterator_prototype.setDecrementor = function( func ) {
		this._decrementor = func;
	};


	Iterator_prototype.dec = function() {
		this._decrementor();
	};


	Iterator_prototype.setUpdater = function() {
		this._updater = func;
	};


	Iterator_prototype.update = function( val ) {
		this._updater( val );
	};


	Iterator_prototype.break = function() {
		this.isBreak = true;
	};


	return Iterator;


}());


























