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
var querystring = require('querystring');
var _ = require('lodash');
var clientUtils = require('./client-utils');
var debugHttp = require('debug')('http');
var debugConneg = require('debug')('conneg');
var debugResource = require('debug')('resource');

exports = module.exports;

var transport = exports;

function createQueryParameters (request) {
  if (request.queryParameters != null) {
    return (_.map(request.queryParameters, function (value, name) {
      return querystring.escape(name) + '='
        + querystring.escape(value);
    })).join('&');
  } else {
    return null;
  }
}

function createRequestOptions (request) {
  var options = {
    hostname: request.resourceRef.hostDomain,
    port: request.resourceRef.hostPort,
    path: request.resourceRef.path,
    method: request.method,
    query: createQueryParameters(request),
    headers: {},
    withCredentials: false
  };

  if (request.clientInfo != null) {
    if (!_.isEmpty(request.clientInfo.acceptedMediaTypes)) {
      debugConneg('Accepted media types: '
        + JSON.stringify(request.clientInfo.acceptedMediaTypes));

      options.headers.accept = [];
      _.forEach(request.clientInfo.acceptedMediaTypes,
        function (acceptedMediaType) {
          options.headers.accept.push(acceptedMediaType.name);
        });
    }
  }

  if (request.entity != null) {
    if (request.entity.mediaType != null
      && !_.isEmpty(request.entity.mediaType.name)) {
      options.headers[ 'content-type' ] = request.entity.mediaType.name;
      debugResource('Sent media type: '
        + request.entity.mediaType.name);
    }
  }

  return options;
}

function createHttpClient (request, handler) {
  var options = createRequestOptions(request);
  debugHttp('Sending HTTP request with options: [ hostname=' + options.hostname
    + ',port=' + options.port + ',path=' + options.path + ',method='
    + options.method + ']');
  debugHttp('With query string : ' + options.query);
  return http.request(options, function (rawResponse) {
    debugHttp('Received HTTP response');
    var res = clientUtils.createResponse(request, rawResponse);

    handler(res);
  });
}

transport.createClient = function (request, handler) {
  if (request.resourceRef.scheme == 'http') {
    var client = createHttpClient(request, handler);

    return client;
  } else {
    throw new Error('The protocol '
      + request.resourceRef.scheme
      + ' isn\'t supported.');
  }
};
