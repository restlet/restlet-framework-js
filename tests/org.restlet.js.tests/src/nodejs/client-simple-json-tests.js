var restlet = require("../../../../modules/org.restlet.js/target/nodejs");

var clientResource = new restlet.resource.ClientResource("/contact/1");
clientResource.get(function(representation) {
	console.log("representation media type = "+representation.getMediaType().toString());
	var jsonRepresentation = new restlet.representation.JsonRepresentation(representation);
	var obj = jsonRepresentation.getObject();
	ok(obj.id, "1");
	ok(obj.lastName, "lastName");
	ok(obj.firstName, "firstName");
}, restlet.data.MediaType.APPLICATION_JSON);
