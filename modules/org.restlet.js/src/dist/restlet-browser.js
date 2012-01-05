// OOP and generic stuff

function copyElements(obj1, obj2) {
	var elt = null;
	for (elt in obj1) {
		if (elt != "initialize" || typeof obj1[elt] != "function") {
			obj2[elt] = obj1[elt];
		} else {
			obj2["_"+elt] = obj1[elt];
		}
	}
}

var Class = function () {
	var parent = null;
	var content = null;
	if (arguments.length == 1) {
		content = arguments[0];
	} else if (arguments.length == 2) {
		parent = arguments[0];
		content = arguments[1];
	}
	
	var clazz = function () {
		if (clazz.initializeExtend != null && clazz.initializeExtend == true) {
			return;
		}
		if (content != null && content["initialize"] != null) {
			content["initialize"].apply(this, arguments);
		}
	}
	if (parent != null) {
		copyElements(parent, clazz);
		parent.initializeExtend = true;
		clazz.prototype = new parent();
		clazz.parent = parent.prototype;
		parent.initializeExtend = null;
		copyElements(content, clazz.prototype);
		clazz.prototype["callSuper"] = function() {
			if (clazz.parent["_initialize"] != null) {
				var superInitialize = clazz.parent["_initialize"];
				superInitialize.apply(this);
			}
		};
	} else {
		clazz.prototype = {};
		copyElements(content, clazz.prototype);
	}
	clazz.extend = function (content) {
		copyElements(content, this);
	};
	return clazz;
};

String.prototype.equalsIgnoreCase = function (arg) {               
    return (new String(this.toLowerCase())
             == (new String(arg)).toLowerCase());
};
String.prototype.equals = function (arg) {
	return (this.toString() == arg.toString());
};

//End OOP and generic stuff

// Restlet

#include org/restlet/Context.js#

#include org/restlet/data/Protocol.js#

#include org/restlet/data/ClientInfo.js#

#include org/restlet/Message.js#

#include org/restlet/data/Reference.js#

#include org/restlet/Request.js#

#include org/restlet/Response.js#

#include org/restlet/data/Method.js#

#include org/restlet/engine/headers/HeaderConstants.js#

#include org/restlet/data/CharacterSet.js#

#include org/restlet/engine/headers/ContentType.js#

#include org/restlet/data/Parameter.js#

#include org/restlet/engine/headers/HeaderReaderUtils.js#

#include org/restlet/engine/headers/HeaderWriterUtils.js#

#include org/restlet/engine/headers/HeaderUtils.js#

#include org/restlet/data/Status.js#

#include org/restlet/Restlet.js#

#include org/restlet/Connector.js#

#include org/restlet/engine/Engine.js#

#include org/restlet/engine/adapter/Call.js#

#include org/restlet/engine/adapter/ClientCall.js#

#include org/restlet/engine/adapter/XhrHttpClientCall.js#

#include org/restlet/engine/adapter/ClientAdapter.js#

#include org/restlet/engine/adapter/HttpClientHelper.js#

#include org/restlet/engine/adapter/XhrHttpClientHelper.js#

#include org/restlet/Client.js#

#include org/restlet/data/MediaType.js#

#include org/restlet/representation/Variant.js#

#include org/restlet/representation/RepresentationInfo.js#

#include org/restlet/representation/Representation.js#

#include org/restlet/representation/EmptyRepresentation.js# 

#include org/restlet/representation/JsonRepresentation.js# 

#include org/restlet/representation/DomRepresentation.js# 

#include org/restlet/representation/XmlRepresentation.js#

#include org/restlet/resource/ClientResource.js#

// End Restlet