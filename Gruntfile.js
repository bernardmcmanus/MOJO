module.exports = function( grunt ) {


    var exec = require( 'child_process' ).exec;
    var util = require( 'util' );


    var Build = [
        'src/namespace.js',
        'src/shared/shared.js',
        'src/when/eventHandler.js',
        'src/when/mojoEvent.js',
        'src/when/when.js',
        'src/mojo.js',
        'src/methods/each.js',
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
            dist: {}
        },

        jshint: {
            all: [ 'Gruntfile.js' , 'src/**/*.js' ]
        },

        clean: [ '<%= pkg.name %>-*.js' ],

        replace: [{
            options: {
                patterns: [
                    {
                        match: /(\"version\")(.*?)(\")(.{1,}?)(\")/i,
                        replacement: '\"version\": \"<%= pkg.version %>\"'
                    },
                    {
                        match: /(\"main\")(.*?)(\")(.{1,}?)(\")/i,
                        replacement: '\"main\": \"<%= BUILD %>\"'
                    }
                ]
            },
            files: [
                {
                    src: 'package.json',
                    dest: 'package.json'
                },
                {
                    src: 'bower.json',
                    dest: 'bower.json'
                }
            ]
        }],

        watch: {
            debug: {
                files: [ 'Gruntfile.js' , 'src/**/*.js' , 'test/*.js' ],
                tasks: [ 'test' ]
            },
            debugProd: {
                files: [ 'Gruntfile.js' , 'src/**/*.js' , 'test/*.js' ],
                tasks: [ 'testProd' ]
            }
        },

        concat: {
            options: {
                banner: '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author.name %> - <%= grunt.config.get( \'git-branch\' ) %> - <%= grunt.config.get( \'git-hash\' ) %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n\n'
            },
            build: {
                src: Build,
                dest: '<%= BUILD %>'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author.name %> - <%= grunt.config.get( \'git-branch\' ) %> - <%= grunt.config.get( \'git-hash\' ) %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            release: {
                files: {
                    '<%= BUILD %>': Build
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


    grunt.registerTask( 'getHash' , function() {

        grunt.task.requires( 'git-describe' );

        var rev = grunt.config.get( 'git-version' );
        var matches = rev.match( /\-?([A-Za-z0-9]{7})\-?/ );

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


    grunt.registerTask( 'getBranch' , function() {
        var done = this.async();
        exec( 'git status' , function( err , stdout , stderr ) {
            if (!err) {
                var branch = stdout
                    .split( '\n' )
                    .shift()
                    .replace( /on\sbranch\s/i , '' );
                grunt.config.set( 'git-branch' , branch );
            }
            done();
        });
    });


    grunt.registerTask( 'setBuildName' , function() {
        var name = grunt.config.get( 'pkg.name' );
        var version = grunt.config.get( 'pkg.version' );
        var ext = (/(dev|test|debug)$/).test( process.argv[2] ) ? '.js': '.min.js';
        var build = name + '-' + version + ext;
        grunt.config.set( 'BUILD' , build );
    });


    grunt.registerTask( 'runTests' , function() {
        var done = this.async();
        exec( 'npm test' , function( err , stdout , stderr ) {
            util.puts( err ? err: stdout );
            done();
        });
    });


    grunt.registerTask( 'always' , [
        'clean',
        'jshint',
        'git-describe',
        'setBuildName',
        'getHash',
        'getBranch'
    ]);


    grunt.registerTask( 'default' , [
        'always',
        'replace',
        'uglify'
    ]);


    grunt.registerTask( 'dev' , [
        'always',
        'concat'
    ]);


    grunt.registerTask( 'test' , [
        'dev',
        'replace',
        'runTests'
    ]);


    grunt.registerTask( 'testProd' , [
        'default',
        'runTests'
    ]);


    grunt.registerTask( 'debug' , [
        'test',
        'watch:debug'
    ]);


    grunt.registerTask( 'debugProd' , [
        'testProd',
        'watch:debugProd'
    ]);
};



















