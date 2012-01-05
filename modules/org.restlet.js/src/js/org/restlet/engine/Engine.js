var Engine = new Class({
	createHelper: function(restlet) {
		// [ifndef nodejs]
		return new XhrHttpClientHelper();
		// [enddef]
		// [ifdef nodejs] uncomment
		//return new NodeJsHttpClientHelper();
		// [enddef]
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
