'use strict';

var http = require('http');
var urlApi = require('url');
var _ = require('lodash');
var converterApi = require('./converter');
var headers = require('./headers');
var stream = require('stream');

exports = module.exports;

var serverUtils = exports;

// See these links for more details about HTTP headers:
// - http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
// - https://msdn.microsoft.com/en-us/library/aa287673%28v=vs.71%29.aspx

// Create Restlet request object

function createRequestReference(rawRequest, protocol) {
  var hostHints = headers.getHost(rawRequest, protocol);
  var url = protocol + '://' + hostHints.host + ':'
       + hostHints.port + rawRequest.url;

  var urlElements = urlApi.parse(url);
  return {
    hostDomain: urlElements.hostname,
    hostPort: urlElements.port,
    path: urlElements.pathname,
    query: urlElements.query,
    scheme: urlElements.protocol
  };
}

function extractQueryParameters(rawRequest) {
  var urlParts = urlApi.parse(rawRequest.url, true);
  return urlParts.query;
}

/**
 * The Restlet request that maps the data received within the
 * HTTP request.
 *
 * This is typically what you do first to initialize your Restlet
 * application. The following code describes how to use this method:
 * 
 *     var component = restlet.createComponent();
 * 
 * A component allows then to add one or several servers, configure
 * virtual hosts and attach elements on them. Notice that a default
 * virtual host (reachable using the method `getDefaultHost`) is automatically
 * created and is used when any other virtual hosts match for the
 * request.
 *
 * The following code describes a typical way to create and configure
 * a Restlet component:
 *
 *     var restlet = require(restlet);
 *
 *     var component = restlet.createComponent();
 * 
 *     // Add a new HTTP server listening on port 3000.
 *     component.addServer('http', 3000);
 *
 *     // Create an application.
 *     var application = (...)
 *
 *     // Attach the sample application.
 *     component.getDefaultHost().attachDefault(application);
 *
 *     // Start the component.
 *     component.start();
 *
 * @object
 * @request
 * @api public
 */
serverUtils.createRequest = function(rawRequest, protocol) {
  var request = {};
  /**
   * The HTTP method.
   *
   * @member
   * @request
   * @api public
   */
  request.method = rawRequest.method;
  /**
   * The entity associated with the request.
   *
   * @member
   * @request
   * @api public
   */
  request.entity = {};
  request.entity.resume = function() {
    rawRequest.resume();
  };
  request.entity.on = function(event, handler) {
    rawRequest.on(event, handler);
  };
  /**
   * The request reference.
   *
   * @member
   * @request
   * @api public
   */
  request.reference = createRequestReference(rawRequest, protocol);
  headers.extractHeadersFromRequest(rawRequest, request);
  /**
   * The query parameters.
   *
   * @member
   * @request
   * @api public
   */
  request.queryParameters = extractQueryParameters(rawRequest);
  return request;
};

// Create Restlet response object

serverUtils.createResponse = function(rawResponse, request) {
  var response = {};
  response.setStatus = function(code, message) {
    rawResponse.statusCode = code;
    rawResponse.statusMessage = message;
  };
  response.writeObject = function(obj) {
    var converter = converterApi.findConverter(
      request.clientInfo.acceptedMediaTypes);

    converter.toString(obj, function(content, mediaType) {
      response.entity = {};
      response.entity.text = content;
      response.entity.mediaType = mediaType;
    });
  };
  response.writeRepresentation = function(entity) {
    response.entity = entity;
  };
  response.end = function() {
    // fill header
    headers.fillHeadersAndContentInResponse(rawResponse, response);
    rawResponse.end();
  };
  return response;
};

// Error responses

serverUtils.sendNotFound = function(response) {
  response.setStatus(404, http.STATUS_CODES[404]);
  response.writeRepresentation({
    text: http.STATUS_CODES[404],
    mediaType: { name: 'text/plan' }
  });
  response.end();
};

serverUtils.sendNotAllowedMethod = function(response) {
  response.setStatus(405, http.STATUS_CODES[405]);
  response.writeRepresentation({
    text: http.STATUS_CODES[405],
    mediaType: { name: 'text/plan' }
  });
  response.end();
};

serverUtils.sendNotSupportedMediaType = function(response) {
  response.setStatus(415, http.STATUS_CODES[415]);
  response.writeRepresentation({
    text: http.STATUS_CODES[415],
    mediaType: { name: 'text/plan' }
  });
  response.end();
};

