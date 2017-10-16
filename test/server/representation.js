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

describe('representation', function () {
  describe('empty representation', function () {
    it('function serverUtils.setNoContentInResponse', function () {
      var request = testUtils.createMockRequest(
        'POST', '/path', 'octet/stream');
      var response = testUtils.createMockResponse(request);
      serverUtils.setNoContentInResponse(response);
      response.end();

      var rawResponse = response.rawResponse;
      assert.equal(rawResponse.statusCode, 204);
      assert.equal(rawResponse.statusMessage, 'No Content');
    });
  });

  describe('write representation using response', function () {
    it('function response.writeObject', function () {
      var request = testUtils.createMockRequest(
        'GET', '/path', null, 'application/json');
      var response = testUtils.createMockResponse(request);
      response.writeObject({ message: 'this is a test' });
      response.end();

      var rawResponse = response.rawResponse;
      assert.equal(rawResponse.statusCode, 200);
      assert.equal(rawResponse.statusMessage, 'OK');
      assert.equal(rawResponse.headers[ 'Content-Type' ], 'application/json');
      assert.equal(rawResponse.headers[ 'Content-Length' ], 28);
      assert.equal(rawResponse.text, '{\"message\":\"this is a test\"}');
    });

    it('function response.writeRepresentation', function () {
      var request = testUtils.createMockRequest(
        'GET', '/path', null, 'application/json');
      var response = testUtils.createMockResponse(request);
      response.writeRepresentation({
        text: 'this is a test', length: 14, mediaType: { name: 'text/plain' }
      });
      response.end();

      var rawResponse = response.rawResponse;
      assert.equal(rawResponse.statusCode, 200);
      assert.equal(rawResponse.statusMessage, 'OK');
      assert.equal(rawResponse.headers[ 'Content-Type' ], 'text/plain');
      assert.equal(rawResponse.headers[ 'Content-Length' ], 14);
      assert.equal(rawResponse.text, 'this is a test');
    });

    it('function response.writeText', function () {
      var request = testUtils.createMockRequest(
        'GET', '/path', null, 'application/json');
      var response = testUtils.createMockResponse(request);
      response.writeText('this is a test', 'text/plain');
      response.end();

      var rawResponse = response.rawResponse;
      assert.equal(rawResponse.statusCode, 200);
      assert.equal(rawResponse.statusMessage, 'OK');
      assert.equal(rawResponse.headers[ 'Content-Type' ], 'text/plain');
      assert.equal(rawResponse.headers[ 'Content-Length' ], 14);
      assert.equal(rawResponse.text, 'this is a test');
    });
  });
});
