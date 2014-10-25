(function() {

    return {
        baseUrl: '../src',
        paths: {
            transpiler: '../vendor/transpiler',
            MOJO: 'main',
            proto: 'proto',
            shared: 'shared',
            inject: 'inject',
            create: 'create',
            construct: 'construct',
            when: 'when',
            aggregate: 'aggregate',
            EventHandler: 'eventHandler',
            Event: 'event'
        },
        include: [ 'transpiler' , 'create' , 'construct' , 'aggregate' , 'proto' ],
        exclude: [],
        out: '../mojo.min.js',
        wrap: {
            startFile: 'wrap.start.js',
            endFile: 'wrap.end.js'
        },
        optimize: 'none'
    };

}())