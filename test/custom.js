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

	mojo.when( 'cool' , rad );

	mojo.when( 'change' , onchange );

	function onchange( type , key ) {
		Render();
		console.log('change: type = ' + type + ', key = ' + key );
		console.log(mojo.order);
	}

	setTimeout(function() {
		mojo.set( 'nutzo' , 'yeah brah' );
		mojo.dispel( 'change' , onchange );
	}, 1000);

	setTimeout(function() {
		delete mojo.gnarly;
		delete mojo.rad;
		mojo.sup = 'g';
		console.log(mojo.order);
		Render();
	}, 3000);

	console.log(mojo);


	Render( '.hierarchy' , mojo );


}());






















