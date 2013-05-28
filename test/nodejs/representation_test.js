var restlet = require("../../build/nodejs/index.js");

exports['simple representation with text'] = function (test) {
	var repr = new restlet.representation.Representation();
    test.ok(!repr.isAvailable());
	repr.write("A simple text");
    test.equal(repr.getText(), "A simple text");
    test.equal(repr.getSize(), "A simple text".length);
    test.ok(repr.isAvailable());
    test.done();
};

/*exports['simple representation with XML'] = function (test) {
};*/

exports['empty representation'] = function (test) {
	var repr = new restlet.representation.EmptyRepresentation();
    test.ok(repr.getText()==null);
    test.done();
};

//TODO: check JsonRepresentation class to match processing
exports['json representation'] = function (test) {
	var repr = new restlet.representation.JsonRepresentation("{\"id\": \"myid\",\"value\":10,\"inner\":{\"id\":\"myid1\",\"value\":11}}");
	//repr.write("{\"id\": \"myid\",\"value\":10},\"inner\":{\"id\": \"myid1\",\"value\":11}}");
    //test.equal(repr.getText(), "{\"id\": \"myid\",\"value\":10,\"inner\":{\"id\":\"myid1\",\"value\":11}}");
    var obj = repr.getObject();
    test.ok(obj!=null);
    test.equal(obj.id, 'myid');
    test.equal(obj.value, 10);
    test.equal(obj.inner.id, 'myid1');
    test.equal(obj.inner.value, 11);
    test.done();
};