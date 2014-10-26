(function() {

    var exclude = [];
    var build = 'mojo.min.js';

    return {
        baseUrl: '../src',
        paths: {
            MOJO: 'main',
            proto: 'proto',
            when: 'when',
            EventHandler: 'eventHandler',
            Event: 'event',
            shared: 'static/shared',
            create: 'static/create',
            construct: 'static/construct',
            aggregate: 'static/aggregate',
            transpiler: 'vendor/transpiler'
        },
        include: [ 'transpiler' , 'shared' , 'create' , 'construct' , 'aggregate' , 'proto' ],
        exclude: exclude,
        out: '../' + build,
        wrap: {
            startFile: 'wrap.start.js',
            endFile: 'wrap.end.js'
        }/*,
        optimize: 'none'*/
    };

}())