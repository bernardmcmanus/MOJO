(function() {


	//var MOJO = require( '../mojo-0.1.2.js' );


	instanceTest();


	function instanceTest() {

		function CoolMOJO() {
			MOJO.Hoist( this );
		}

		CoolMOJO.prototype = new MOJO({

			test: function() {
				console.log(this);
			}
		});

		var cool1 = new CoolMOJO();
		console.log(cool1);

		function stuffHappens1( e ) {
			console.log('stuffHappens1');
			cool1.dispel( 'stuffHappens' );
		}

		function stuffHappens2( e ) {
			console.log('stuffHappens2');
		}

		function stuffHappens3( e ) {
			console.log('stuffHappens3');
		}

		cool1.when( 'stuffHappens' , stuffHappens1 );
		cool1.when( 'stuffHappens' , stuffHappens2 );
		cool1.when( 'stuffHappens' , stuffHappens3 );

		cool1.happen( 'stuffHappens' );
	}


}());






















