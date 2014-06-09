(function() {

	
	var mojo = new MOJO({
		whoa: true,
		cool: 'awesome',
		gnarly: 'sweet',
		dude: 'rad',
		awesome: {bro: 'guy', rad: 5},
		cray: [ 0 , 1 , 2 , 3 ],
		rad: function () {
			console.log(that);
		}
	});

	function rad() {
		console.log(arguments);
	}

	function onchange( type , key ) {
		Render();
		console.log('change: type = ' + type + ', key = ' + key );
	}

	mojo.when( 'cool' , rad );
	mojo.when( 'change' , onchange );

	setTimeout(function() {
		mojo.set( 'nutzo' , 'yeah brah' );
	}, 1000);

	setTimeout(function() {
		mojo.happen( 'cool' , 'cool!' );
		//mojo.dispel( 'change' , onchange );
	}, 2000);

	setTimeout(function() {
		delete mojo.gnarly;
		delete mojo.rad;
		mojo.remove( 'cray' );
		mojo.sup = 'g';
		Render();
	}, 3000);

	setTimeout(function() {
		console.log(mojo.order);
	}, 4000);

	console.log(mojo);


	Render( '.hierarchy' , mojo );


}());






















