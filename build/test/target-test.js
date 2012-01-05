//var jsclass = require("./jsclass/core");
var util = require("util");
var http = require("http");
var libxmljs = require("libxmljs");

// OOP and generic stuff

function copyElements(obj1, obj2) {
	for (var elt in obj1) {
		if (elt!="initialize" || typeof obj1[elt] != "function") {
			obj2[elt] = obj1[elt];
		} else {
			obj2["_"+elt] = obj1[elt];
		}
	}

}

var Class = function() {
	var parent = null;
	var content = null;
	if (arguments.length==1) {
		content = arguments[0];
	} else if (arguments.length==2) {
		parent = arguments[0];
		content = arguments[1];
	}
	
	var clazz = function() {
		if (clazz.initializeExtend!=null && clazz.initializeExtend==true) {
			return;
		}
		if (content!=null && content["initialize"]!=null) {
			content["initialize"].apply(this, arguments);
		}
	}
	if (parent!=null) {
		copyElements(parent, clazz);
		parent.initializeExtend = true;
		clazz.prototype = new parent();
		clazz.parent = parent.prototype;
		parent.initializeExtend = null;
		copyElements(content, clazz.prototype);
		clazz.prototype["callSuper"] = function() {
			if (clazz.parent["_initialize"]!=null) {
				var superInitialize = clazz.parent["_initialize"];
				superInitialize.apply(this);
			}
		};
	} else {
		clazz.prototype = {};
		copyElements(content, clazz.prototype);
	}
	clazz.extend = function(content) {
		copyElements(content, this);
	};
	return clazz;
};

String.prototype.equalsIgnoreCase = function(arg) {               
    return (new String(this.toLowerCase())
             ==(new String(arg)).toLowerCase());
};
String.prototype.equals = function(arg) {
	return (this.toString()==arg.toString());
};

//End OOP and generic stuff

// Restlet

var Connector = new Class(Restlet, {
	initialize: function(context, protocols) {
		this.context = context;
		if (typeof protocols != "undefined" && protocols!=null) {
			this.protocols = protocols;
		} else {
			this.protocols = [];
		}
	},
	getProtocols: function() {
		return this.protocols;
	}
});

// End Restlet

// Module exports

exports = {
	ClientResource: ClientResource,
	MediaType: MediaType
};