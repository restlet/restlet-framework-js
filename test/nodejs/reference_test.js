var restlet = require("../../build/nodejs/index.js");

exports['simple representation with text'] = function (test) {
	var reference = new restlet.data.Reference('http://localhost:8000/test?param1=10&param2=11');
	test.equal(reference.getScheme(), 'http');
	test.equal(reference.getHostPort(), 8000);
	test.equal(reference.getHostDomain(), 'localhost');
	test.equal(reference.getPath(), '/test');
	test.equal(reference.getQuery(), 'param1=10&param2=11');
	var form = reference.getQueryAsForm();
	test.equal(form.getFirstValue('param1'), '10');
	test.equal(form.getFirstValue('param2'), '11');
	test.done();
};