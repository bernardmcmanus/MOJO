module.exports = function( grunt ) {


	var src = [
		'src/namespace.js',
		'src/private/when/when.js',
		'src/private/when/eventHandler.js',
		'src/private/when/eventFactory.js',
		'src/public/mojo.js',
		'src/public/methods/extend.js'
	];


	grunt.initConfig({

		pkg: grunt.file.readJSON( 'package.json' ),

		jshint : {
			all : [ 'Gruntfile.js' , 'src/prototypes/*.js' , 'src/*.js' ]
		},

		clean : [ 'mojo-*.js' ],

		replace: {

			dev: {
				options: {
					patterns: [
						{
							match : /(\.\.\/mojo\-)(.*?)(\.js)/,
							replacement : '../mojo-<%= pkg.version %>.js'
						}
					]
				},
				files: [{
					src: 'test/index.html',
					dest: 'test/index.html'
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

		watch: [{
			files: ([ 'package.json' ]).concat( src ),
			tasks: [ 'dev' ]
		}],

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
		'watch'
	]);
};
