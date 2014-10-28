module.exports = function( grunt ) {


  var fs = require( 'fs' );
  var exec = require( 'child_process' ).exec;
  var util = require( 'util' );
  var AMDFormatter = require( 'es6-module-transpiler-amd-formatter' );
  var transpiler = require( 'es6-module-transpiler' );
  var Container = transpiler.Container;
  var FileResolver = transpiler.FileResolver;
  var BundleFormatter = transpiler.formatters.bundle;


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

    clean: {
      'all': [ 'dist' , 'tmp' ],
      'tmp': [ 'tmp' ],
      'common-dev': [ 'dist/mojo-<%= pkg.version %>.js' ],
      'common-prod': [ 'dist/mojo-<%= pkg.version %>.min.js' ],
      'amd-dev': [ 'dist/mojo-<%= pkg.version %>.amd.js' ],
      'amd-prod': [ 'dist/mojo-<%= pkg.version %>.amd.min.js' ]
    },

    replace: [{
      options: {
        patterns: [
          {
            match: /(\"version\")(.*?)(\")(.{1,}?)(\")/i,
            replacement: '\"version\": \"<%= pkg.version %>\"'
          },
          {
            match: /(\"main\")(.*?)(\")(.{1,}?)(\")/i,
            replacement: '\"main\": \"dist/mojo-<%= pkg.version %>.min.js\"'
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

    // watch: {
    //   debug: {
    //     files: [ 'Gruntfile.js' , 'src/**/*.js' , 'test/*.js' ],
    //     tasks: [ 'test' ]
    //   },
    //   debugProd: {
    //     files: [ 'Gruntfile.js' , 'src/**/*.js' , 'test/*.js' ],
    //     tasks: [ 'testProd' ]
    //   }
    // },

    transpile: {
      amd: {
        type: 'amd',
        files: [{
          expand: true,
          cwd: 'src/',
          src: [ '**/*.js' ],
          dest: 'tmp/',
          ext: '.amd.js'
        }]
      }
    },

    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author.name %> - <%= grunt.config.get( \'git-branch\' ) %> - <%= grunt.config.get( \'git-hash\' ) %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n\n'
      },
      amd: {
        src: 'tmp/**/*.amd.js',
        dest: 'dist/mojo-<%= pkg.version %>.amd.js'
      },
      common: {
        src: 'tmp/mojo.common.js',
        dest: 'dist/mojo-<%= pkg.version %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - <%= pkg.version %> - <%= pkg.author.name %> - <%= grunt.config.get( \'git-branch\' ) %> - <%= grunt.config.get( \'git-hash\' ) %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      amd: {
        files: {
          'dist/mojo-<%= pkg.version %>.amd.min.js': 'tmp/**/*.amd.js'
        }
      },
      common: {
        files: {
          'dist/mojo-<%= pkg.version %>.min.js': 'tmp/**/*.js'
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
    'grunt-contrib-watch',
    'grunt-es6-module-transpiler'
  ]
  .forEach( grunt.loadNpmTasks );


  function transpile( out , amd ) {

    var container = new Container({
      resolvers: [new FileResolver([ 'src/' ])],
      formatter: new (amd ? AMDFormatter : BundleFormatter)()
    });

    container.getModule( '../build/mojo.umd' );
    container.write( out );

    /*var transpilerJS = fs.readFileSync( './src/vendor/transpiler.js' , 'utf-8' );
    var compiled = fs.readFileSync( './mojo.min.js.js' , 'utf-8' );
    fs.writeFileSync( './mojo.min.js.js' , ( transpilerJS + '\n\n' + compiled ));*/
  }


  grunt.registerTask( 'transpile:common' , function() {
    transpile( 'tmp/mojo.common.js' );
  });


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


  grunt.registerTask( 'runTests' , function() {
    var done = this.async();
    exec( 'npm test' , function( err , stdout , stderr ) {
      util.puts( err ? err: stdout );
      done();
    });
  });


  grunt.registerTask( 'always' , [
    //'jshint',
    'git-describe',
    'getHash',
    'getBranch'
  ]);


  grunt.registerTask( 'default' , [
    'build',
    'replace'
  ]);


  grunt.registerTask( 'build' , [
    'always',
    'build:amd-dev',
    'build:amd-prod',
    'build:common-dev',
    'build:common-prod'
  ]);


  grunt.registerTask( 'build:common' , [
    'build:common-dev',
    'build:common-prod'
  ]);


  grunt.registerTask( 'build:common-prod' , [
    'clean:common-prod',
    'transpile:common',
    'uglify:common',
    'clean:tmp'
  ]);


  grunt.registerTask( 'build:common-dev' , [
    'clean:common-dev',
    'transpile:common',
    'concat:common',
    'clean:tmp'
  ]);


  grunt.registerTask( 'build:amd' , [
    'build:amd-dev',
    'build:amd-prod'
  ]);


  grunt.registerTask( 'build:amd-prod' , [
    'clean:amd-prod',
    'transpile:amd',
    'uglify:amd',
    'clean:tmp'
  ]);


  grunt.registerTask( 'build:amd-dev' , [
    'clean:amd-dev',
    'transpile:amd',
    'concat:amd',
    'clean:tmp'
  ]);
  
};

















