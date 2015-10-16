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