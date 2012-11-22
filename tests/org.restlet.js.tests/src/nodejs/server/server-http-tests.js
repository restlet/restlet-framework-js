var xmldom = require("xmldom");
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
var application = restlet.Application.create(function() {
	var router = new restlet.Router();
	router.appRouter = true;
	//r1
	router.attach("/test1/{id}", function(request, response) {
		console.log("---> r1.handle");
		var repr = new restlet.representation.StringRepresentation("test");
		response.endWithRepresentation(repr);
	});
	//r2
	router.attach("/test2", function(request, response) {
		console.log("---> r2.handle");
		var repr = new restlet.representation.JsonRepresentation({id:"testid",name:"testname"});
		response.endWithRepresentation(repr);
	});
	//r3
	router.attach("/test3", function(request, response) {
		console.log("---> r3.handle");
		  var doc = new xmldom.DOMParser().parseFromString("<person/>");
		  var personElement = doc.documentElement;
		  var idElement = doc.createElement("id");
		  personElement.appendChild(idElement);
		  var textIdElement = doc.createTextNode("testid");
		  idElement.appendChild(textIdElement);
		  var nameElement = doc.createElement("name");
		  personElement.appendChild(nameElement);
		  var textNameElement = doc.createTextNode("testname");
		  nameElement.appendChild(textNameElement);
		
		  var repr = new restlet.representation.DomRepresentation(doc);
		  response.endWithRepresentation(repr);
	});
	return router;
});
component.getDefaultHost().attachDefault(application);

component.start();
