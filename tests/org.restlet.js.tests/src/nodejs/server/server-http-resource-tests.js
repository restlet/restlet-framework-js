var xmldom = require("xmldom");
var restlet = require("restlet");

var component = new restlet.Component();
component.getServers().addProtocol(restlet.data.Protocol.HTTP, 8182);

var application = restlet.Application.create(function() {
	var router = new restlet.Router();
	//r1
	var r1 = restlet.resource.ServerResource.createSubServerResource();
	r1.addMethod("get", "json", function() {
		console.log("---> r1.handle get (1)");
		console.log("---> "+restlet.data.MediaType.TEXT_HTML);
		var repr = new restlet.representation.StringRepresentation("{test:1}", restlet.data.MediaType.TEXT_HTML);
		console.log("> commit");
		this.commit(repr);
		console.log("< commit");
	}),
	r1.addMethod("get", "html", function() {
 		console.log("---> r1.handle get (2)");
		console.log("---> "+restlet.data.MediaType.TEXT_HTML);
		var repr = new restlet.representation.StringRepresentation("<html><body>test</body></html>", restlet.data.MediaType.TEXT_HTML);
		this.commit(repr);
	}),
	r1.addMethod("put", "json", function(representation) {
 		console.log("---> r1.handle put (1)");
		console.log("---> "+restlet.data.MediaType.TEXT_HTML);
		var repr = new restlet.representation.StringRepresentation("<html><body>ok put (1)</body></html>", restlet.data.MediaType.TEXT_HTML);
		this.commit(repr);
	});
	r1.addMethod("put", "txt", function(representation) {
 		console.log("---> r1.handle put (2)");
		console.log("---> "+restlet.data.MediaType.TEXT_HTML);
		var repr = new restlet.representation.StringRepresentation("<html><body>ok put (2)</body></html>", restlet.data.MediaType.TEXT_HTML);
		this.commit(repr);
	});
	router.attach("/test1/{id}", r1);
	return router;
});
component.getDefaultHost().attachDefault(application);

component.start();
