window.Render = (function() {


	var Selector, Mojo;


	function Render( selector , mojo ) {

		Selector = selector || Selector;
		Mojo = mojo || Mojo;

		// select the hierarchy element
		var hierarchy = document.querySelector( Selector );
		
		// clear any exising children
		$(hierarchy).children().remove();
		
		// add a key-value pair for each property
		Mojo.each(function( val , key ) {
			
			var li = _createLI( '' , 1 );
			var type = _getType( val );
			var value = _getValueByType( val , type );

			li = _createPair( li , value , key , type );
			$(hierarchy).append( li );
		});
		
		// add the length property
		var len = _createLI( '' , 1 );
		len = _createPair( len , Mojo.length , 'length' , 'number' , true );
		$(hierarchy).append( len );

		// add the keys property
		var keys = _createLI( '' , 1 );
		var keysString = _getValueByType( Mojo.keys , 'array' );
		keys = _createPair( keys , keysString , 'keys' , 'array' , true );
		$(hierarchy).append( keys );

		// add the vals property
		var vals = _createLI( '' , 1 );
		var valsString = _getValueByType( Mojo.values , 'array' );
		vals = _createPair( vals , valsString , 'values' , 'array' , true );
		$(hierarchy).append( vals );
		
		// prepend the opening bracket
		$(hierarchy).prepend(
			_createLI( '{' )
		);
		
		// append the closing bracket
		$(hierarchy).append(
			_createLI( '}' )
		);

		addListeners( hierarchy );
	}


	function _getType( subject ) {
		if (subject instanceof Array) {
			return 'array';
		}
		return typeof subject;
	}


	function _getValueByType( subject , type ) {

		switch (type) {

			case 'string':
				return ('\'' + subject.toString() + '\'');

			case 'number':
			case 'boolean':
				return subject.toString();

			case 'object':
			case 'array':
				var str = JSON.stringify( subject );
				str = str.replace( /\"/g , '\'' );
				str = str.replace( /\{\'/g , '\{' );
				str = str.replace( /\,\'/g , '\, ' );
				str = str.replace( /\:/g , '\: ' );
				str = str.replace( /\'\:/g , '\: ' );
				return str;

			case 'function':
				var func;
				try {
					func = subject.toString();
				}
				catch( err ) {
					func = 'function () { [native code] }';
				}
				return func;
		}
	}


	function _createArraySpan( array ) {

		var valSpan = document.createElement( 'span' );
		$(valSpan).addClass( 'array toggle' );

		array = array.replace( /\,/g , ' , ' );
		array = array.replace( /\[/g , '[ ' );
		array = array.replace( /\]/g , ' ]' );

		var collapsed = document.createElement( 'span' );
		$(collapsed)
		.addClass( 'off' )
		.html( '[ ... ]' )
		.appendTo( valSpan );

		var expanded = document.createElement( 'span' );
		$(expanded)
		.addClass( 'on' )
		.html( array )
		.appendTo( valSpan );

		return valSpan;
	}


	function _createObjectSpan( object ) {

		var valSpan = document.createElement( 'span' );
		$(valSpan).addClass( 'object toggle' );

		var collapsed = document.createElement( 'span' );
		$(collapsed)
		.addClass( 'off' )
		.html( '{ ... }' )
		.appendTo( valSpan );

		var expanded = document.createElement( 'span' );
		$(expanded)
		.addClass( 'on' )
		.html( object )
		.appendTo( valSpan );

		return valSpan;
	}


	function _createFunctionSpan( func ) {

		var valSpan = document.createElement( 'span' );
		$(valSpan).addClass( 'function toggle' );

		var collapsed = document.createElement( 'span' );
		$(collapsed)
		.addClass( 'off' )
		.html( 'function () { ... }' )
		.appendTo( valSpan );

		var expanded = document.createElement( 'span' );
		$(expanded)
		.addClass( 'on' )
		.html( func )
		.appendTo( valSpan );

		return valSpan;
	}

	
	function _createPair( container , val , key , type , private ) {
		
		private = private || false;

		var content = document.createElement( 'span' );
		content.className = 'content';
		
		var keySpan = document.createElement( 'span' );
		keySpan.className = (private ? 'key private' : 'key');
		keySpan.innerHTML = key + ': ';
		content.appendChild( keySpan );

		var valSpan;

		switch (type) {

			case 'array':
				valSpan = _createArraySpan( val );
			break;

			case 'object':
				valSpan = _createObjectSpan( val );
			break;

			case 'function':
				valSpan = _createFunctionSpan( val );
			break;

			default:
				valSpan = document.createElement( 'span' );
				valSpan.className = type;
				valSpan.innerHTML = val;
			break;
		}

		content.appendChild( valSpan );

		var remove = document.createElement( 'span' );
		remove.className = 'remove';
		remove.innerHTML = 'x';
		container.appendChild( remove );
		
		$(remove).on( 'click' , function( e ) {
			Mojo.remove( key );
			Render();
		});
				
		if (!private) {
			$(container).addClass( 'removeable' );
		}

		container.appendChild( content );
		
		return container;
	}
	
	
	function _createLI( content , level ) {
		level = level || 0;
		var levelClass = 'level-' + level;
		var li = document.createElement( 'li' );
		li.innerHTML = content;
		li.className = levelClass;
		return li;
	}


	function addListeners( hierarchy ) {

		$(hierarchy).find( '.toggle' )
			.off( 'click' , _toggle )
			.on( 'click' , _toggle );
	}


	function _toggle( e ) {
		$(this).toggleClass( 'expanded' );
	}
	
	
	// $('button').on( 'click' , function( e ) {
		
	// 	var key = document.querySelector( 'input.key' );
	// 	var val = document.querySelector( 'input.val' );
		
	// 	if (key.value && val.value) {
	// 		leno[key.value] = val.value;
	// 		key.value = '';
	// 		val.value = '';
	// 	}
		
	// 	updateHierarchy();
	// });
	
	
	return Render;
    

}());






















