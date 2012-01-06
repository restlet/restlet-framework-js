//var jsclass = require("./jsclass/core");
var util = require("util");
var http = require("http");
var libxmljs = require("libxmljs");

//Utils

#include org/restlet/js/utils/Class.js#

#include org/restlet/js/utils/String.js#

#include org/restlet/js/utils/StringBuilder.js#

#include org/restlet/js/utils/Array.js#

#include org/restlet/js/utils/Number.js#

#include org/restlet/js/utils/DateFormat.js#

//End Utils

// Restlet

#include org/restlet/Context.js#

#include org/restlet/data/Protocol.js#

#include org/restlet/data/ClientInfo.js#

#include org/restlet/data/ServerInfo.js#

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

#include org/restlet/engine/adapter/NodeJsHttpClientCall.js#

#include org/restlet/engine/adapter/ClientAdapter.js#

#include org/restlet/engine/adapter/HttpClientHelper.js#

#include org/restlet/engine/adapter/NodeJsHttpClientHelper.js#

#include org/restlet/Client.js#

#include org/restlet/data/MediaType.js#

#include org/restlet/representation/Variant.js#

#include org/restlet/representation/RepresentationInfo.js#

#include org/restlet/representation/Representation.js#

#include org/restlet/representation/EmptyRepresentation.js# 

#include org/restlet/representation/JsonRepresentation.js# 

#include org/restlet/representation/DomRepresentation.js# 

#include org/restlet/resource/ClientResource.js#

// End Restlet

// Module exports

exports = {
	ClientResource: ClientResource,
	MediaType: MediaType
};
