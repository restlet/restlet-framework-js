var Engine = new [class Class]({
	initialize: function() {
	},

	createHelper: function(restlet) {
		// [ifndef nodejs]
		//return new XhrHttpClientHelper();
		return new [class BrowserHttpClientHelper]();
		// [enddef]
		// [ifdef nodejs] uncomment
		//return new [class NodeJsHttpClientHelper]();
		// [enddef]
	},

	getDebugHandler: function() {
		return this.debugHandler;
	},

	setDebugHandler: function(debugHandler) {
		this.debugHandler = debugHandler;
	}
});

Engine.extend({
	getInstance: function() {
		if (Engine.instance==null) {
			Engine.instance = new Engine();
		}
		return Engine.instance;
	}
});