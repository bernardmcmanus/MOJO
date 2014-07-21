module.exports = function( grunt ) {


	var src = [
		'src/namespace.js',
		'src/when/when.js',
		'src/when/eventHandler.js',
		'src/when/mojoEvent.js',
		'src/mojo.js',
		'src/methods/each.js',
		//'src/methods/extend.js',
		'src/methods/hoist.js',
		'src/definition.js'
	];


	grunt.initConfig({

		pkg: grunt.file.readJSON( 'package.json' ),

		jshint : {
			all : [ 'Gruntfile.js' ].concat( src )
		},

		clean : [ 'mojo-*.js' ],

		replace: {

			dev: {
				options: {
					patterns: [{
						match : /(\.\.\/mojo\-)(.*?)(\.js)/,
						replacement : '../mojo-<%= pkg.version %>.js'
					}]
				},
				files: [{
					src: 'test/index.html',
					dest: 'test/index.html'
				}]
			},

			debugProd: {
				options: {
					patterns: [{
						match : /(\.\.\/mojo\-)(.*?)(\.js)/,
						replacement : '../mojo-<%= pkg.version %>.min.js'
					}]
				},
				files: [{
					src: 'test/index.html',
					dest: 'test/index.html'
				}]
			},

			pkg: {
				options: {
					patterns: [{
						match: /(\"main\")(.*?)(\")(.{1,}?)(\")/i,
						replacement: '\"main\": \"mojo-<%= pkg.version %>.min.js\"'
					}]
				},
				files: [{
					src: 'package.json',
					dest: 'package.json'
				}]
			},

			bower: {
				options: {
					patterns: [
						{
							match: /(\"name\")(.*?)(\")(.{1,}?)(\")/i,
							replacement: '\"name\": \"<%= pkg.name %>\"'
						},
						{
							match: /(\"version\")(.*?)(\")(.{1,}?)(\")/i,
							replacement: '\"version\": \"<%= pkg.version %>\"'
						},
						{
							match: /(\"homepage\")(.*?)(\")(.{1,}?)(\")/i,
							replacement: '\"homepage\": \"<%= pkg.repository.url %>\"'
						},
						{
							match: /(\"description\")(.*?)(\")(.{1,}?)(\")/i,
							replacement: '\"description\": \"<%= pkg.description %>\"'
						},
						{
							match: /(\"main\")(.*?)(\")(.{1,}?)(\")/i,
							replacement: '\"main\": \"mojo-<%= pkg.version %>.min.js\"'
						}
					]
				},
				files: [{
					src: 'bower.json',
					dest: 'bower.json'
				}]
			}
		},

		watch: {
			dev: {
				files: ([ 'package.json' ]).concat( src ),
				tasks: [ 'dev' ]
			},
			debugProd: {
				files: ([ 'package.json' ]).concat( src ),
				tasks: [ 'default' ]
			}
		},

		concat: {
			options: {
				banner : '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n\n'
			},
			build: {
				src: src,
				dest: 'mojo-<%= pkg.version %>.js'
			}
		},

		uglify: {
			options: {
				banner : '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			release : {
				files : {
					'mojo-<%= pkg.version %>.min.js' : src
				}
			}
		}
	});


	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-replace' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );


	grunt.registerTask( 'default' , [
		'jshint',
		'clean',
		'replace:pkg',
		'replace:bower',
		'uglify'
	]);

	grunt.registerTask( 'dev' , [
		'jshint',
		'clean',
		'replace:dev',
		'concat'
	]);

	grunt.registerTask( 'debug' , [
		'dev',
		'watch:dev'
	]);

	grunt.registerTask( 'debugProd' , [
		'default',
		'replace:debugProd',
		'watch:debugProd'
	]);
};
