/*
 * Copyright 2005-2017 Restlet
 *
 * The contents of this file are subject to the terms of one of the following
 * open source licenses: Apache 2.0 or or EPL 1.0 (the "Licenses"). You can
 * select the license that you prefer but you may not use this file except in
 * compliance with one of these Licenses.
 *
 * You can obtain a copy of the Apache 2.0 license at
 * http://www.opensource.org/licenses/apache-2.0
 *
 * You can obtain a copy of the EPL 1.0 license at
 * http://www.opensource.org/licenses/eclipse-1.0
 *
 * See the Licenses for the specific language governing permissions and
 * limitations under the Licenses.
 *
 * Alternatively, you can obtain a royalty free commercial license with less
 * limitations, transferable or non-transferable, directly at
 * http://restlet.com/products/restlet-framework
 *
 * Restlet is a registered trademark of Restlet S.A.S.
 */

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
