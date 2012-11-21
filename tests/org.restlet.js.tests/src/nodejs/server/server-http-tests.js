var restlet = require("restlet");
var commons = restlet.commons;

var component = new restlet.Component();
component.getServers().addProtocol(restlet.data.Protocol.HTTP, 8182);

/*var r = new commons.Class(restlet.Filter, {
	handle: function(request, response) {
		console.log("#### call ####");
	}
});
component.getDefaultHost().attach("/test",r);*/
var application = new restlet.Application();
application.createInboundRoot = function() {
	var router = new restlet.Router();
	router.appRouter = true;
	//r1
	var r1 = new restlet.Filter();
	r1.handle = function(request, response) {
		console.log("---> r1.handle");
		var repr = new restlet.representation.StringRepresentation("test");
		repr.setAvailable(true);
		response.setEntity(repr);
		//response.end();
	};
	router.attach("/test1", r1);
	//r2
	var r2 = new restlet.Filter();
	r2.handle = function(request, response) {
		console.log("---> r2.handle");
		//response.end();
	};
	router.attach("/test2", r2);
	return router;
};
component.getDefaultHost().attachDefault(application);

component.start();
