'use strict';

var assert = require('assert');
var testUtils = require('./test-utils');
var serverUtils = require('../../lib/server-utils');

// See the following RFC for more details:
// http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html

describe('general headers', function () {
  // Simple creations
  describe('date header', function () {
    it('no date header', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path', {});

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(null, request.date);
    });

    it('date header with correct format', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { date: 'Tue, 11 Jul 2000 18:23:51 GMT' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(963339831000, request.date);
    });

    it('date header with wrong format', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { date: 'Tue, 11 XXXXXXJul 2000 18:23:51 GMT' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(null, request.date);
    });
  });
});
