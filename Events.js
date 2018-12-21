// @context - your application object:
//  pass in this as the default context
//  ex: events = new Events(Application);
//  or on it's own ... var Event_Manager = new Events();
function createEventsManager(context) {
    const listeners = {};

    // @target - the scope where the @callback is defined
    // @evt_name - string
    // @callback - function
    // @opt_current_context – alternate context
    function listenTo(target, evt_name, callback, opt_current_context) {
        const scope = opt_current_context != null ? opt_current_context : context;
        const new_listener = {
            target,
            callback,
            context: scope
        };
        if (listeners[evt_name]) {
            listeners[evt_name].push(new_listener);
        } else {
            listeners[evt_name] = [new_listener];
        }
    }
    // @target - the scope where the @callback is defined
    // @evt_name - string
    // @callback - function
    function stopListening(target, evt_name, callback) {
        const current_listeners = listeners[evt_name];
        const leftovers = [];
        if (current_listeners != null) {
            current_listeners.forEach((listener) => {
                if ((listener.target === target
                    && listener.callback === callback) === false) {
                    leftovers.push(listener);
                }
            });
            listeners[evt_name] = leftovers;
            // should I delete the [evt_name] property from listeners too?
        }
    }
    // @target - the scope where the @callback is defined
    // @evt_name - string
    // @callback - function
    function isListening(target, evt_name, callback) {
        const current_listeners = listeners[evt_name];
        let confirmed = [];
        if (current_listeners != null) {
            confirmed = current_listeners.filter(function (item) {
                return item.target === target && item.callback === callback;
            });
        }
        console.log("isListening", listeners);
        return confirmed.length > 0;
    }
    // @evt_name - string
    // @caller - the caller
    // @params - pass as many arguments as you want
    function dispatch(evt_name, caller, params) {
        const [...args] = [caller, params];
        const current_listeners = listeners[evt_name];
        if (current_listeners != null) {
            current_listeners.forEach((lsnr) => {
                if (lsnr.target === caller) {
                    lsnr.callback.apply(lsnr.context, args);
                }
            });
        }
    }

    return {
        listenTo,
        stopListening,
        isListening,
        dispatch
    }
}

export default createEventsManager;