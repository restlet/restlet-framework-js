// Common types

#include org/restlet/js/utils/String.js#

#include org/restlet/js/utils/Array.js#

#include org/restlet/js/utils/Number.js#

// Restlet

var core = require('./lib/restlet-core');
var data = require('./lib/restlet-data');
var engine = require('./lib/restlet-engine');
var representation = require('./lib/restlet-representation');
var resource = require('./lib/restlet-resource');
var util = require('./lib/restlet-util');

module.exports = {
	data: data,
	engine: engine,
	representation: representation,
	resource: resource,
	util: util
};

for (var elt in core) {
	module.exports[elt] = core[elt];
}