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

var urlApi = require('url');
var _ = require('lodash');
var debugConneg = require('debug')('conneg');
var data = require('./data');
var headers = require('./headers');

exports = module.exports;

var clientUtils = exports;

clientUtils.createRequest = function (url, configuration) {
  var urlElements = urlApi.parse(url);
  var request = {
    resourceRef: {
      hostDomain: urlElements.hostname,
      hostPort: urlElements.port,
      path: urlElements.pathname,
      query: urlElements.query,
      scheme: urlElements.protocol.substr(0, urlElements.protocol.length - 1)
    },
    method: configuration.method
  };

  if (configuration.accept != null) {
    request.clientInfo = {
      acceptedMediaTypes: [ new data.MediaType(configuration.accept) ]
    };
  }

  request.queryParameters = configuration.queryParameters;

  return request;
};

clientUtils.createResponse = function (request, rawResponse) {
  // Status
  var status = new data.Status(
    rawResponse.statusCode,
    rawResponse.statusMessage);

  // Content
  var contentTypeHeader = rawResponse.headers[ 'content-type' ];
  var contentLengthHeader = rawResponse.headers[ 'content-length' ];
  var entity = {
    on: function (event, callback) {
      rawResponse.on(event, callback);
    }
  };
  if (contentTypeHeader != null) {
    debugConneg('Received media type '
      + contentTypeHeader);
    entity.mediaType = headers.parser.readPreferenceHeaderValue(
      contentTypeHeader);
  }
  if (contentLengthHeader != null) {
    entity.length = contentLengthHeader;
  }

  return {
    entity: entity,
    status: status
  };
};

// Errors

clientUtils.createRepresentation = function (text, mediaType) {
  if (!_.isEmpty(text)) {
    return {
      text: text,
      length: text.length,
      mediaType: new data.MediaType(mediaType)
    };
  } else {
    return {
      text: null,
      length: 0,
      mediaType: new data.MediaType(mediaType)
    };
  }
};

clientUtils.setNotSupportedMediaTypeInResponse = function (response) {
  response.status = new data.Status(415);
  response.entity =
    clientUtils.createRepresentation(response.status.description, 'text/plan');
};
