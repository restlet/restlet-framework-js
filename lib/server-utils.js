'use strict';

var  http = require('http');
var urlApi = require('url');
var _ = require('lodash');
var converter = require('./converter');
var headers = require('./headers');
var stream = require('stream');

exports = module.exports;

var serverUtils = exports;

var converters = converter.builtinConverters();

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

serverUtils.createRequest = function(rawRequest, protocol) {
  var request = {};
  request.method = rawRequest.method;
  request.entity = {};
  request.entity.resume = function() {
    rawRequest.resume();
  };
  request.entity.on = function(event, handler) {
    rawRequest.on(event, handler);
  };
  request.reference = createRequestReference(rawRequest, protocol);
  headers.extractHeadersFromRequest(rawRequest, request);
  return request;
};

// Create Restlet response object

serverUtils.createResponse = function(rawResponse) {
  var response = {};
  response.setStatus = function(code, message) {
    rawResponse.statusCode = code;
    rawResponse.statusMessage = message;
  };
  response.writeObject = function(obj) {
    converters[0].toString(obj, function(string) {
      rawResponse.write(string);
      rawResponse.end();
    });
  };
  response.writeRepresentation = function(elt) {
    rawResponse.setHeader('content-type', elt.mediaType.name);
    rawResponse.write(elt.text);
  };
  response.end = function() {
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


