_MOJO.CompareArray = (function() {

	function CompareArray( subject , array ) {
		
		if (subject.length != array.length) {
			return false;
		}

		for (var i = 0, l = subject.length; i < l; i++) {
			if (subject[i] instanceof Array && array[i] instanceof Array) {
				if (!CompareArray( subject[i] , array[i] )) {
					return false;
				}
			}
			else if (subject[i] != array[i]) {
				return false;
			}
		}

		return true;
	}

	return CompareArray;
	
}());



























