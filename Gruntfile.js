module.exports = function( grunt ) {


	var src = [
		'src/namespace.js',
		'src/when/eventHandler.js',
		'src/when/mojoEvent.js',
		'src/when/when.js',
		'src/mojo.js',
		'src/methods/each.js',
		//'src/methods/extend.js',
		'src/methods/create.js',
		'src/methods/construct.js',
		'src/definition.js'
	];


	grunt.initConfig({

		pkg: grunt.file.readJSON( 'package.json' ),

		'git-describe': {
			'options': {
				prop: 'git-version'
			},
			dist : {}
		},

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
				banner : '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author.name %> - <%= grunt.config.get( \'git-hash\' ) %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n\n'
			},
			build: {
				src: src,
				dest: 'mojo-<%= pkg.version %>.js'
			}
		},

		uglify: {
			options: {
				banner : '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author.name %> - <%= grunt.config.get( \'git-hash\' ) %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			release : {
				files : {
					'mojo-<%= pkg.version %>.min.js' : src
				}
			}
		}
	});

	
	[
		'grunt-contrib-jshint',
		'grunt-contrib-clean',
		'grunt-git-describe',
		'grunt-replace',
		'grunt-contrib-concat',
		'grunt-contrib-uglify',
		'grunt-contrib-watch'
	]
	.forEach( grunt.loadNpmTasks );


	grunt.registerTask( 'createHash' , function() {

        grunt.task.requires( 'git-describe' );

        var rev = grunt.config.get( 'git-version' );
        var matches = rev.match( /(\-{0,1})+([A-Za-z0-9]{7})+(\-{0,1})/ );

        var hash = matches
            .filter(function( match ) {
                return match.length === 7;
            })
            .pop();

        if (matches && matches.length > 1) {
            grunt.config.set( 'git-hash' , hash );
        }
        else{
            grunt.config.set( 'git-hash' , rev );
        }
    });


	grunt.registerTask( 'default' , [
		'jshint',
		'git-describe',
		'createHash',
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
