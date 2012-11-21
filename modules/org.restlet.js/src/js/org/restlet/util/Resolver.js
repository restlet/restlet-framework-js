var Resolver = new [class Class]({
    resolve: function(name) {
    	throw new Error("Must be implemented!");
    }
});

Resolver.extend({
    createResolver: function(map) {
    	if (arguments.length==1) {
    		var map = arguments[0];
    		return new MapResolver(map);
    	} else if (arguments.length==2) {
    		var request = arguments[0];
    		var response = arguments[1];
            return new CallResolver(request, response);
    	}
    }
});