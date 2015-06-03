'use strict';

var http = require('http');
var urlApi = require('url');
var _ = require('lodash');
var converterApi = require('./converter');
var headers = require('./headers');
var stream = require('stream');
var debugResponse = require('debug')('response');
var debugConneg = require('debug')('conneg');

exports = module.exports;

var serverUtils = exports;

// See these links for more details about HTTP headers:
// - http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
// - https://msdn.microsoft.com/en-us/library/aa287673%28v=vs.71%29.aspx

// Create Restlet request object

/**
 * A reference.
 *
 * @reference
 * @object
 * @api public
 */
function createRequestReference(rawRequest, protocol) {
  var hostHints = headers.getHost(rawRequest, protocol);
  var url = protocol + '://' + hostHints.host + ':'
       + hostHints.port + rawRequest.url;

  var urlElements = urlApi.parse(url);
  return {
    /**
     * The host domain
     *
     * @reference
     * @member String
     * @api public
     */
    hostDomain: urlElements.hostname,
    /**
     * The host port
     *
     * @reference
     * @member String
     * @api public
     */
    hostPort: urlElements.port,
    /**
     * The path
     *
     * @reference
     * @member String
     * @api public
     */
    path: urlElements.pathname,
    /**
     * The query string
     *
     * @reference
     * @member String
     * @api public
     */
    query: urlElements.query,
    /**
     * The scheme
     *
     * @reference
     * @member String
     * @api public
     */
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
 * @object
 * @request
 * @api public
 */
serverUtils.createRequest = function(rawRequest, protocol) {
  var request = {};
  /**
   * The attributes associated with the request
   *
   * @request
   * @member Object
   * @api public
   */
  request.attributes = {};
  /**
   * The HTTP method
   *
   * @request
   * @member String
   * @api public
   */
  request.method = rawRequest.method;
  /**
   * The entity associated with the request
   *
   * @request
   * @member Representation
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
   * @request
   * @member Reference
   * @api public
   */
  request.reference = createRequestReference(rawRequest, protocol);
  headers.extractHeadersFromRequest(rawRequest, request);
  /**
   * The query parameters
   *
   * @request
   * @member Object
   * @api public
   */
  request.queryParameters = extractQueryParameters(rawRequest);
  return request;
};

// Create Restlet response object

serverUtils.HttpResponse = function(rawResponse, request) {
  //this.rawResponse, request
}

/**
 * The Restlet response that maps the data to send through the
 * HTTP response.
 *
 * @object
 * @response
 * @api public
 */
serverUtils.createResponse = function(rawResponse, request) {
  var response = {
    status: {
      code: 200,
      isError: function() {
        return (this.code >= 400 && this.code < 600);
      }
    }
  };
  response.setStatus = function(code, message) {
    this.status.code = code;
    this.status.message = message;
  };
  response.empty = function() {
    serverUtils.setEmptyInResponse(response);
  };
  response.writeObject = function(obj) {
    // Check if the parameter is null
    if (obj == null) {
      serverUtils.setEmptyInResponse(response);
      return;
    }

    debugConneg('Accepted media types: '
      + JSON.stringify(request.clientInfo.acceptedMediaTypes));

    var converter = converterApi.findConverter(
      request.clientInfo.acceptedMediaTypes);

    // If no converter found, send back a not supported
    // media type error
    if (converter == null) {
      serverUtils.setNotSupportedMediaTypeInResponse(response);
      return;
    }

    // Convert the object
    converter.toString(obj, function(err, content, mediaType) {
      if (err) {
        debugConneg('Error when trying to serialize entity - err = ' + err);
        serverUtils.setNotSupportedMediaTypeInResponse(response);
      } else {
        debugConneg('Output entity serialized to ' + mediaType.name);
        setEntityTextInResponse(response, content, mediaType);
      }
    });
  };
  response.writeRepresentation = function(entity) {
    response.entity = entity;
  };
  response.end = function() {
    // Fill status
    debugResponse('Filling raw response status - code = ' + this.status.code);
    rawResponse.statusCode = this.status.code;
    rawResponse.statusMessage = this.status.message;

    console.log('>> entity = '+JSON.stringify(response.entity));

    // Fill headers
    debugResponse('Filling raw response headers');
    headers.fillHeadersAndContentInResponse(rawResponse, response);

    // End response
    debugResponse('Ending raw response');
    rawResponse.end();
  };

  debugResponse('Created response');
  return response;
};

// Entity response

function setEntityTextInResponse(response, content, mediaType) {
  response.entity = {};
  response.entity.text = content;
  response.entity.mediaType = mediaType;
  response.entity.length = content.length;
}

// Success responses

serverUtils.setEmptyInResponse = function(response) {
  response.setStatus(204, http.STATUS_CODES[204]);
  response.writeRepresentation(
    createRepresentation(http.STATUS_CODES[204], 'text/plain'));
};

// Error responses

function createRepresentation(text, mediaType) {
  if (!_.isEmpty(text)) {
    return {
      text: text,
      length: text.length,
      mediaType: { name: mediaType }
    };
  } else {
    return {
      text: null,
      length: 0,
      mediaType: { name: mediaType }
    }
  }
}

serverUtils.sendNotFound = function(response) {
  serverUtils.setNotFoundInResponse(response);
  response.end();
};

serverUtils.setNotFoundInResponse = function(response) {
  response.setStatus(404, http.STATUS_CODES[404]);
  response.writeRepresentation(
    createRepresentation(http.STATUS_CODES[404], 'text/plain'));
};

serverUtils.sendNotAllowedMethod = function(response) {
  serverUtils.setNotAllowedMethodInResponse(response);
  response.end();
};

serverUtils.setNotAllowedMethodInResponse = function(response) {
  response.setStatus(405, http.STATUS_CODES[405]);
  response.writeRepresentation(
    createRepresentation(http.STATUS_CODES[405], 'text/plain'));
};

serverUtils.sendNotSupportedMediaType = function(response) {
  serverUtils.setNotSupportedMediaTypeInResponse(response);
  response.end();
};

serverUtils.setNotSupportedMediaTypeInResponse = function(response) {
  response.setStatus(415, http.STATUS_CODES[415]);
  response.writeRepresentation(
    createRepresentation(http.STATUS_CODES[415], 'text/plain'));
};

