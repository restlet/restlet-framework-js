var restlet = require("restlet");
var assert = require("assert");

var ref = new restlet.data.Reference("http://localhost:8182/contact/1");
console.log(ref.getScheme());
assert.ok(ref.getScheme(), "http");
assert.ok(ref.getHost(), "localhost");
assert.ok(ref.getPort(), "8182");
assert.ok(ref.getPath(), "/contact/1");