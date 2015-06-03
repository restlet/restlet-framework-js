'use strict';

var urlApi = require('url');
var debugResponse = require('debug')('response');

exports = module.exports;

var clientUtils = exports;

clientUtils.createRequest = function(url, configuration) {
  var urlElements = urlApi.parse(url);
  return {
  	resourceRef: {
      hostDomain: urlElements.hostname,
      hostPort: urlElements.port,
      path: urlElements.pathname,
      query: urlElements.query,
      scheme: urlElements.protocol.substr(0, urlElements.protocol.length-1)
    },
    method: configuration.method
  };
};

clientUtils.createResponse = function(request, rawResponse) {
	console.log('>> headers = '+JSON.stringify(rawResponse.headers));
  var contentTypeHeader = rawResponse.headers['content-type'];
  var contentLengthHeader = rawResponse.headers['content-length'];
  var entity = {
    on: function(event, callback) {
      rawResponse.on(event, callback);
    }
  };
  console.log('>> contentTypeHeader = '+contentTypeHeader);
  if (contentTypeHeader != null) {
  	entity.mediaType = {
      name: contentTypeHeader
  	};
  }
  console.log('>> contentLengthHeader = '+contentLengthHeader);
  if (contentLengthHeader != null) {
  	entity.length = contentLengthHeader;
  }

  return {
    entity: entity
  };
};