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

var _ = require('lodash');
var serverUtils = require('../../lib/server-utils');

exports = module.exports;

var testUtils = exports;

testUtils.createRawRequest = function (method, path, headers, handlers) {
  return {
    method: method,
    headers: headers,
    connection: {
      remoteAddress: 'localhost',
      remotePort: '35034'
    },
    resume: function () {
    },
    url: path != null ? path : '/path',
    on: function (event, handler) {
      if (handlers[ event ] == null) {
        handlers[ event ] = [];
      }
      handlers[ event ].push(handler);
    }
  };
};

testUtils.createMockRequest = function (method, path, contentType, acceptType) {
  var handlers = {};
  var rawRequest = testUtils.createRawRequest(method, path, {}, handlers);

  if (contentType != null) {
    rawRequest.headers[ 'content-type' ] = contentType;
  }

  if (acceptType != null) {
    rawRequest.headers.accept = acceptType;
  }

  var request = serverUtils.createRequest(rawRequest);

  request.trigger = function (event, data) {
    if (handlers[ event ] != null) {
      var eventHandlers = handlers[ event ];
      _.forEach(eventHandlers, function (eventHandler) {
        eventHandler(data);
      });
    }
  };

  return request;
};

testUtils.createMockResponse = function (request, listeners) {
  var rawResponse = {
    headers: {},
    text: '',
    raw: [],
    statusCode: '',
    statusMessage: '',
    setHeader: function (name, value) {
      this.headers[ name ] = value;
    },
    write: function (c) {
      if (_.isString(c)) {
        this.text += c;
      } else {
        this.raw.push(c);
      }
    },
    end: function () {
      if (listeners != null && !_.isEmpty(listeners.end)) {
        _.forEach(listeners.end, function (callback) {
          callback();
        });
      }
    }
  };

  var response = serverUtils.createResponse(rawResponse, request);
  response.rawResponse = rawResponse;
  return response;
};
