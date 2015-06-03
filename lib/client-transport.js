'use strict';

var http = require('http');
var clientUtils = require('./client-utils');
var debug = require('debug')('http');

exports = module.exports;

var transport = exports;

function createRequestOptions(request) {
  return {
    hostname: request.resourceRef.domainName,
    port: request.resourceRef.domainPort,
    path: request.resourceRef.path,
    method: request.method/*,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }*/
  };
}

function createHttpClient(request, handler) {
  var options = createRequestOptions(request);
  return http.request(createRequestOptions, function(rawResponse) {
    debug('>> received HTTP response');
    var res = clientUtils.createResponse(request, rawResponse);

    handler(res);
  });
}

transport.createClient = function(request, handler) {
  if (request.resourceRef.scheme == 'http') {
    var client = createHttpClient(request, handler);

    return client;
  } else {
    throw new Error('The protocol '
      + request.resourceRef.scheme
      + ' isn\'t supported.');
  }
};
