'use strict';

var assert = require('assert');
var testUtils = require('./test-utils');
var serverUtils = require('../../lib/server-utils');

// See the following RFC for more details:
// http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html

describe('client info creation', function () {
  // Simple creations
  describe('warning header', function () {
    it('no accept header', function () {
      var rawRequest = testUtils.createRawRequest(
        'GET', '/path', { warning: '' });
      var request = serverUtils.createRequest(rawRequest, 'http');
      var clientInfo = request.clientInfo;

      assert.equal(1, clientInfo.acceptedMediaTypes.length);
      assert.equal('*/*', clientInfo.acceptedMediaTypes[ 0 ].name);
    });
  });
});