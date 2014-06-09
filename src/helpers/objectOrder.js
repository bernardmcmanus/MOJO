_MOJO.ObjectOrder = (function() {


	function ObjectOrder() {
		this.order = [];
	}


	//var ObjectOrder_prototype = (ObjectOrder.prototype = Object.create( Array.prototype ));


	var ObjectOrder_prototype = (ObjectOrder.prototype = {});


	ObjectOrder_prototype.add = function( key ) {
		var order = this.order;
		var i = order.indexOf( key );
		if (i < 0) {
			order.push( key );
		}
	};


	ObjectOrder_prototype.remove = function( key ) {
		var order = this.order;
		var i = order.indexOf( key );
		if (i >= 0) {
			order.splice( i , 1 );
		}
	};


	ObjectOrder_prototype.update = function( keys ) {

		var that = this;
		var order = that.order;

		if (!_MOJO.CompareArray( order , keys )) {

			console.log('array compare failed');

			var addKeys = keys.filter(function( key , i ) {
				return order.indexOf( key ) < 0;
			});

			console.log(addKeys);

			var removeKeys = order.filter(function( key , i ) {
				return keys.indexOf( key ) < 0;
			});

			console.log(removeKeys);

			order = ([]).concat( order.slice() ).concat( addKeys );

			order = order.filter(function( key , i ) {
				return removeKeys.indexOf( key ) < 0;
			});
		}

		that.order = order;
		return order;
	};


	return ObjectOrder;

	
}());



























