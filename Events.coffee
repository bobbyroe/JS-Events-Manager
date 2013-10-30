# GLOBAL EVENT DISPATCHER
###
#
# USAGE, as a member of your application object:
# pass in this as the default context
# ex: @events = new Events @
#
# or on it's own ... Event_Manager = new Events()
#
###
class Events

	constructor: (context) ->
		@context = context
		@listeners = {}

	listenTo: (target, evt_name, callback, context) ->
		scope = if context? then context else @context
		new_listener = 
			target: target, 
			callback: callback, 
			context: scope

		if @listeners[evt_name]? then @listeners[evt_name].push new_listener
		else @listeners[evt_name] = [ new_listener ]
		return

	stopListening: (target, evt_name, callback) ->
		listeners = @listeners[evt_name]
		leftovers = []
		
		if listeners?
			leftovers.push listener for listener in listeners when not (listener.target is target and listener.callback is callback)
			@listeners[evt_name] = leftovers
		return

	isListening: (target, evt_name, callback) ->
		listeners = @listeners[evt_name]
		confirmed = []
		if listeners? 
			confirmed = listeners.filter (lsnr) -> lsnr.target is target and lsnr.callback is callback
		return confirmed isnt []
		

	dispatch: (evt_name, caller, params) ->
		args = Array.prototype.slice.call arguments, 1
		listeners = @listeners[evt_name]
		doCallback = (listener) ->
			listener.callback.apply listener.context, args
			return

		if listeners? 
			doCallback listener for listener in listeners when listener.target is caller
		return
# END
