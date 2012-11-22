var restlet = require("restlet");
var commons = restlet.commons;

var component = new restlet.Component();
component.getServers().addProtocol(restlet.data.Protocol.HTTP, 8182);

var application = restlet.Application.create(function() {
	var router = new restlet.Router();
	//r1
	router.attach("/test1/{id}", function(request, response) {
		console.log("---> r1.handle");
		var attributes = request.getAttributes();
		for (var elt in attributes) {
			console.log("elt = "+elt+" - value = "+attributes[elt]);
		}
		var repr = new restlet.representation.JadeRepresentation("./templates/test.jade", {title: "A title"}, restlet.data.MediaType.TEXT_HTML);
		response.endWithRepresentation(repr);
	});
	//r2
	router.attach("/test2", function(request, response) {
		console.log("---> r2.handle");
		response.end();
	});
	return router;
});

component.getDefaultHost().attachDefault(application);

component.start();
