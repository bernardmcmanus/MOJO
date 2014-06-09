_MOJO.When = (function() {


    function When() {
        this.handlers = new whenModule();
    }


    var When_prototype = (When.prototype = {});


    When_prototype.when = function( event , handler , args ) {

        if (!event || (!handler || typeof handler !== 'function')) {
            throw 'Error: Invalid when args.';
        }

        var _handler = new _MOJO.When.EventHandler( handler );
        _handler.bind( args );

        this._addHandler( event , _handler );
    };


    When_prototype.happen = function( event , args ) {

        var handlers = this._getHandlers( event );

        handlers.forEach(function( handler ) {
            handler.invoke( args );
        });
    };


    When_prototype.dispel = function( event , handler ) {

        var that = this;
        var handlers = that._getHandlers();

        if (handler) {
            that._removeHandler( event , handler );
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


    When_prototype._removeHandler = function( event , handler ) {

        var that = this;
        var eventHandlers = that._getHandlers( event );
            
        if (!eventHandlers || eventHandlers.length < 1) {
            return;
        }

        var i = 0, _handler;

        while (i < eventHandlers.length) {
            _handler = eventHandlers[i].handler;
            if (_handler === handler) {
                break;
            }
            i++;
        }

        if (i < 0 || i >= eventHandlers.length) {
            return;
        }

        eventHandlers = eventHandlers.splice( i , 1 );
    };


    When_prototype._getHandlers = function( event ) {
        var handlers = this.handlers;
        return (event ? (handlers[event] || []) : handlers);
    };


    function whenModule() {}


    return When;

    
}());



























