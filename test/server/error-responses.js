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

var assert = require('assert');
var serverUtils = require('../../lib/server-utils');
var testUtils = require('./test-utils');

describe('error response', function () {
  describe('not found', function () {
    it('function serverUtils.sendNotFound', function () {
      var request = testUtils.createMockRequest(
        'POST', '/path', 'octet/stream');
      var response = testUtils.createMockResponse(request);
      serverUtils.sendNotFound(response);

      var rawResponse = response.rawResponse;
      assert.equal(rawResponse.statusCode, 404);
      assert.equal(rawResponse.statusMessage, 'Not Found');
    });
  });

  describe('method not allowed', function () {
    it('function serverUtils.sendNotAllowedMethod', function () {
      var request = testUtils.createMockRequest(
        'POST', '/path', 'octet/stream');
      var response = testUtils.createMockResponse(request);
      serverUtils.sendNotAllowedMethod(response);

      var rawResponse = response.rawResponse;
      assert.equal(rawResponse.statusCode, 405);
      assert.equal(rawResponse.statusMessage, 'Method Not Allowed');
    });
  });

  describe('not supported media type', function () {
    it('function serverUtils.sendNotSupportedMediaType', function () {
      var request = testUtils.createMockRequest(
        'POST', '/path', 'octet/stream');
      var response = testUtils.createMockResponse(request);
      serverUtils.sendNotSupportedMediaType(response);

      var rawResponse = response.rawResponse;
      assert.equal(rawResponse.statusCode, 415);
      assert.equal(rawResponse.statusMessage, 'Unsupported Media Type');
    });
  });
});
