(function() {


	//var MOJO = require( '../mojo-0.1.2.js' );


	onceTest();


	function onceTest() {

		function CoolMOJO( name ) {
			this.name = name;
			this.isCool = true;
			MOJO.Construct( this );
		}

		CoolMOJO.prototype = MOJO.Create({

			test: function() {
				console.log(this);
			}
		});

		var master = new CoolMOJO( 'master' );

		var slaves = [ 'slave' , 'slave' , 'slave' ].map(function( name , i ) {
			return new CoolMOJO( name + i );
		});

		master.once( 'stuff stuff2' , function( e ) {
			console.log('master stuff');
		});

		slaves.forEach(function( slave ) {
			master.once( 'stuff stuff2' , function( e ) {
				console.log(slave.name + ' ' + e.type);
			});
		});

		console.log(master);
		console.log(slaves);

		master.happen( 'stuff' );
		master.happen( 'stuff' );
	}


	function prototypeTest() {

		function CoolMOJO( name ) {
			this.name = name;
			this.isCool = true;
			MOJO.Construct( this );
		}

		CoolMOJO.prototype = MOJO.Create({

			test: function() {
				console.log(this);
			}
		});

		var cool1 = new CoolMOJO( 'cool1' );
		var cool2 = new CoolMOJO( 'cool2' );

		console.log(cool1);
		console.log(cool2);

		cool1.when( 'stuffHappens' , function stuffHappens( e ) {
			console.log(e);
			cool1.dispel( 'stuffHappens' , stuffHappens );
		});

		cool1.when( 'set' , function set( e ) {
			console.log(e);
			cool1.dispel( 'set' , set );
		});

		cool1.when( 'remove' , function remove( e ) {
			console.log(e);
			cool1.dispel( 'remove' , remove );
		});

		cool1.happen( 'stuffHappens' );

		cool1.set( 'gnarly' , true );

		cool1.remove( 'gnarly' );
	}


	function instanceTest() {

		var cool1 = new MOJO({
			rad: true
		});

		var cool2 = new MOJO({
			gnar: true
		});

		console.log(cool1);
		console.log(cool2);

		function stuffHappens1( e ) {
			console.log('stuffHappens1');
			cool1.dispel( 'stuffHappens' , stuffHappens2 );
		}

		function stuffHappens2( e ) {
			console.log('stuffHappens2');
		}

		function stuffHappens3( e ) {
			console.log('stuffHappens3');
			// this dispel call shouldn't do anything
			// because the handler was already removed
			cool1.dispel( 'stuffHappens' , stuffHappens2 );
		}

		function stuffHappens4( e ) {
			console.log('stuffHappens4');
		}

		cool1.when( 'stuffHappens' , stuffHappens1 );
		cool1.when( 'stuffHappens' , stuffHappens2 );
		cool1.when( 'stuffHappens' , stuffHappens3 );
		cool1.when( 'stuffHappens' , stuffHappens4 );

		cool1.happen( 'stuffHappens' );
	}


}());






















