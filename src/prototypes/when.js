_MOJO.When = (function() {


    function When() {
        this.handlers = new whenModule();
    }


    var When_prototype = (When.prototype = {});


    When_prototype.when = function( event , handler , args ) {

        if (!event || (!handler || typeof handler !== 'function')) {
            throw 'Error: Invalid when args.';
        }

        //context = context || null;
        //var _handler = handler.bind( context );
        //var _handler = handler;

        var _handler = new EventHandler( handler );
        _handler.setArgs( args );

        this._addHandler( event , _handler );
    };


    When_prototype.happen = function( event , args ) {

        var handlers = this._getHandlers( event );

        handlers.forEach(function( handler ) {
            handler.concatArgs( args );
            handler.invoke();
            handler.purge();
            //func.apply( null , args );
        });
    };


    When_prototype.dispel = function( event , handler ) {

        var that = this;
        var handlers = that._getHandlers();

        if (handler) {

            var eventHandlers = handlers[event];
            
            if (!eventHandlers || eventHandlers.length < 1) {
                return;
            }
            
            var i = eventHandlers.indexOf( handler );

            if (i < 0) {
                return;
            }

            eventHandlers = eventHandlers.splice( i , 1 );
        }
        else {
            delete handlers[event];
        }
    };


    When_prototype._addHandler = function( event , handler ) {
        var that = this;
        var handlers = that.handlers;
        (handlers[event] = handlers[event] || []).push( handler );
    };


    When_prototype._getHandlers = function( event ) {
        var handlers = this.handlers;
        return (event ? (handlers[event] || []) : handlers);
    };


    function whenModule() {}


    function EventHandler( func ) {

        //func.handler = func;
        func.context = null;
        func.args = [];

        func.invoke = function() {
            var that = this;
            var args = that.getArgs();
            that.apply( that.context , args );
        };

        func.getArgs = function() {
            return this.args || [];
        };

        func.setArgs = function( args ) {
            this.args = args;
        };

        func.concatArgs = function( args ) {
            var that = this;
            var thisargs = that.getArgs();
            that.args = thisargs.concat( args );
        };

        func.purge = function() {
            this.setArgs( [] );
        };

        return func;
    }


    /*function EventHandler( func ) {
        this.handler = func;
        this.context = null;
        this.args = [];
    }


    EventHandler.prototype = {

        invoke: function() {
            var that = this;
            var args = that.getArgs();
            that.handler.apply( that.context , args );
        },

        getArgs: function() {
            return this.args || [];
        },

        setArgs: function( args ) {
            this.args = args;
        },

        concatArgs: function( args ) {
            var that = this;
            var thisargs = that.getArgs();
            that.args = thisargs.concat( args );
        },

        purge: function() {
            this.setArgs( [] );
        }
    };*/


    return When;

    
}());



























