'use strict';

var http = require('http');
var serverUtils = require('./server-utils');
var debug = require('debug')('http');

exports = module.exports;

var transport = exports;

function createHttpServer (handler) {
  return http.createServer(function (rawRequest, rawResponse) {
    debug('Received HTTP request');
    rawRequest.pause();
    var request = serverUtils.createRequest(rawRequest, 'http');
    var response = serverUtils.createResponse(rawResponse, request);
    handler(request, response);
  });
}

transport.createServer = function (serverConfiguration, handler) {
  if (serverConfiguration.protocol == 'http') {
    var server = createHttpServer(handler);

    server.listen(serverConfiguration.port, function () {
      console.log('Server listening on port '
        + serverConfiguration.port + '.');
    });

    return server;
  } else {
    throw new Error('The protocol '
      + serverConfiguration.protocol
      + ' isn\'t supported.');
  }
};
