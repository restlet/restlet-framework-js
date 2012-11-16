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
	var r = new restlet.Filter();
	r.handle = function(request, response) {
		console.log("r.handle");
		response.end();
	};
	router.attach("/test", r);
	return router;
};
component.getDefaultHost().attachDefault(application);

component.start();
