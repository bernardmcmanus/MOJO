(function() {


	var notMojo = {
		whoa: true,
		cool: 'awesome',
		gnarly: 'sweet',
		dude: 'rad',
		awesome: {bro: 'guy', rad: 5},
		cray: [ 0 , 1 , 2 , 3 ],
		rad: function () {
			console.log(that);
		}
	};


	var mojo = new MOJO( notMojo );


	/*console.log( '----- NON-MOJO STATIC EACH -----' );
	MOJO.each( true , notMojo , function( iterator , val , key ) {
		if (key === 'gnarly') {
			return iterator.break();
		}
		console.log(key);
	});
	console.log( '--------------------------------' );
	console.log( '' );

	
	
	
	var flag = true;

	mojo.when( 'remove' , function( key , index ) {
		console.log('remove: key = ' + key + ', index = ' + index );
	});

	console.log( '----- MOJO INSTANCE EACH -----' );
	mojo.each( true , function( iterator , val , key , i ) {
		if (i > 2) {
			mojo.remove( key );
		}

		if (flag && i === 1) {
			mojo.set( 'nutzo' , 'chyah brah' );
			flag = false;
		}
	});
	console.log( '------------------------------' );
	console.log(mojo.keys);
	mojo.remove( 'gnarly' );


	return;*/


	function rad() {
		console.log(arguments);
	}

	function onchange( type , key , index ) {
		Render();
		console.log('change: type = ' + type + ', key = ' + key + ', index = ' + index );
	}

	mojo.when( 'cool' , rad );
	mojo.when( 'set' , onchange , [ 'set' ] );
	mojo.when( 'remove' , onchange , [ 'remove' ] );

	setTimeout(function() {
		mojo.set( 'nutzo' , 'chyah brah' );
	}, 1000);

	setTimeout(function() {
		mojo.happen( 'cool' , 'cool!' );
		//mojo.dispel( 'remove' , onchange );
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






















