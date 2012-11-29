var xmldom = require("xmldom");
var restlet = require("restlet");

var component = new restlet.Component();
component.getServers().addProtocol(restlet.data.Protocol.HTTP, 8182);

var application = restlet.Application.create(function() {
	var router = new restlet.Router();
	//r1
	var r1 = restlet.resource.ServerResource.createSubServerResource();
	r1.addMethod("get", "json", function() {
		console.log("---> r1.handle");
		var repr = new restlet.representation.StringRepresentation("test");
		response.endWithRepresentation(repr);
	}),
	router.attach("/test1/{id}", r1);
	return router;
});
component.getDefaultHost().attachDefault(application);

component.start();
