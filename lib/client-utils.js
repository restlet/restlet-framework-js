'use strict';

var http = require('http');
var urlApi = require('url');
var _ = require('lodash');
var debugResponse = require('debug')('response');
var debugConneg = require('debug')('conneg');

exports = module.exports;

var clientUtils = exports;

clientUtils.createRequest = function(url, configuration) {
  var urlElements = urlApi.parse(url);
  var request = {
  	resourceRef: {
      hostDomain: urlElements.hostname,
      hostPort: urlElements.port,
      path: urlElements.pathname,
      query: urlElements.query,
      scheme: urlElements.protocol.substr(0, urlElements.protocol.length-1)
    },
    method: configuration.method
  };

  if (configuration.accept != null) {
    request.clientInfo = {
      acceptedMediaTypes: [ { name: configuration.accept } ]
    }
  }

  request.queryParameters = configuration.queryParameters;

  return request;
};

clientUtils.createResponse = function(request, rawResponse) {
  // Status
  var status = {
    code: rawResponse.statusCode,
    message: rawResponse.statusMessage,
    isError: function() {
      return (this.code >= 400 && this.code < 600);
    }
  };

  // Content
  var contentTypeHeader = rawResponse.headers['content-type'];
  var contentLengthHeader = rawResponse.headers['content-length'];
  var entity = {
    on: function(event, callback) {
      rawResponse.on(event, callback);
    }
  };
  if (contentTypeHeader != null) {
    debugConneg('Received media type '
      + contentTypeHeader);
  	entity.mediaType = {
      name: contentTypeHeader
  	};
  }
  if (contentLengthHeader != null) {
  	entity.length = contentLengthHeader;
  }

  return {
    entity: entity,
    status: status,
    setStatus: function(code, message) {
      this.status.code = code;
      this.status.message = message;
    }
  };
};

// Errors

clientUtils.createRepresentation = function(text, mediaType) {
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
};

clientUtils.setNotSupportedMediaTypeInResponse = function(response) {
  response.setStatus(415, http.STATUS_CODES[415]);
  response.entity =
    createRepresentation(http.STATUS_CODES[415], 'text/plan');
};
