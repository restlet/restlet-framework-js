var restlet = require("../../../build/nodejs/index.js");
var utils = require("../../lib/utils.js");

exports['simple client resource tests'] = function(test) {
	try {
  var cr = new restlet.resource.ClientResource('http://restlet.org');
  cr.get(function(representation) {
    console.log(representation.getText().toString());
    test.done();
  });
	} catch(err) {
		console.log(err.stack);
	}
};