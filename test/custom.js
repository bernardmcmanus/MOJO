(function() {


	//var MOJO = require( '../mojo-0.1.4.js' );


	handleMOJOTest();


	function handleMOJOTest() {

        function CoolMOJO( name ) {
            this.name = name;
            this.isCool = true;
            MOJO.Construct( this );
            this.when( 'stuffHappens' , this );
        }

        CoolMOJO.prototype = MOJO.Create({

            handleMOJO: function( e ) {
                
                console.log('handleMOJO');
                console.log(e);

                this.dispel( 'stuffHappens' , this );
            }
        });

        var cool1 = new CoolMOJO( 'cool1' );

        //console.log(cool1);

        cool1.happen( 'stuffHappens' );
        cool1.happen( 'stuffHappens' );
    }


	function dispelTest() {

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
			console.log('master ' + e.type);
			master.dispel( 'stuff2' );
		});

		slaves.forEach(function( slave ) {
			master.once( 'stuff stuff2' , function( e ) {
				console.log(slave.name + ' ' + e.type);
			});
		});

		console.log(master);
		console.log(slaves);

		master.happen( 'stuff' );
		console.log('----- happen stuff2 -----');
		master.happen( 'stuff2' );
	}


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
			console.log('master ' + e.type);
		});

		slaves.forEach(function( slave ) {
			master.once( 'stuff stuff2' , function( e ) {
				console.log(slave.name + ' ' + e.type);
			});
		});

		console.log(master);
		console.log(slaves);

		master.happen( 'stuff' );
		console.log('----- happen again -----');
		master.happen( 'stuff stuff2' );
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
			//e.skip( stuffHappens2 );
		}

		function stuffHappens2( e ) {
			// even though this function was dispelled in
			// stuffHappens1, it should still run because
			// the event had already been triggered
			// -----
			// if e.skip( stuffHappens2 ) is called in
			// stuffHappens1, this shouldn't run
			console.log('stuffHappens2');
		}

		function stuffHappens3( e ) {
			console.log('stuffHappens3');
			// this dispel call shouldn't do anything
			// because the listener was already removed
			cool1.dispel( 'stuffHappens' , stuffHappens2 );
			e.break();
		}

		function stuffHappens4( e ) {
			// this function shouldn't run because e.break
			// was called in stuffHappens3
			console.log('stuffHappens4');
		}

		cool1.when( 'stuffHappens' , stuffHappens1 );
		cool1.when( 'stuffHappens' , stuffHappens2 );
		cool1.when( 'stuffHappens' , stuffHappens3 );
		cool1.when( 'stuffHappens' , stuffHappens4 );

		cool1.happen( 'stuffHappens' );
		console.log('----- happen again -----');
		cool1.happen( 'stuffHappens' );
	}


	function jqueryEventTest() {

		$(window).on( 'testEvent' , func1 );
		$(window).on( 'testEvent' , func2 );

		function func1( e ) {
			console.log('func1');
			$(window).off( 'testEvent' , func2 );
		}

		function func2( e ) {
			// func2 is still run when the listener is
			// removed after the event is triggered.
			console.log('func2');
		}

		$(window).trigger( 'testEvent' );
	}


}());






















