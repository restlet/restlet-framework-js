var restlet = require("restlet");
var assert = require("assert");

function testGet() {
	var clientResource = new restlet.resource.ClientResource("http://localhost:8182/contact/1");
	clientResource.get(function(representation) {
		console.log("representation media type = "+representation.getMediaType().toString());
		console.log("representation text = "+representation.getText());
		var jsonRepresentation = new restlet.representation.JsonRepresentation(representation);
		var obj = jsonRepresentation.getObject();
		assert.ok(obj.id, "1");
		assert.ok(obj.lastName, "lastName");
		assert.ok(obj.firstName, "firstName");
	}, restlet.data.MediaType.APPLICATION_JSON);
}

function testPut() {
	/*restlet.core.Engine.getInstance().setDebugHandler({
		beforeSendingRequest: function(url, method, headers, data) {
			console.log("data = "+data);
		}
	});*/
	//restlet.core.Engine.getInstance().enableDebug();
	
	var clientResource = new restlet.resource.ClientResource("http://localhost:8182/contact/1");
	var contact = {
			id: "1",
			lastName: "lastName",
			firstName: "firstName"
	};
	var jsonRepresentation = new restlet.representation.JsonRepresentation(contact);
	clientResource.put(jsonRepresentation, function(representation) {
		console.log("representation.getText() = "+representation.getText());
		var jsonRepresentation = new restlet.representation.JsonRepresentation(representation);
		var obj = jsonRepresentation.getObject();
		assert.ok(obj.id, "1");
		assert.ok(obj.lastName, "lastName");
		assert.ok(obj.firstName, "firstName");
	}, restlet.data.MediaType.APPLICATION_JSON);
}

function testDelete() {
	var clientResource = new restlet.resource.ClientResource("http://localhost:8182/contact/1");
	clientResource.delete(function() {
	});
}

testGet();
testPut();
testDelete();