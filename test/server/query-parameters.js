'use strict';

var assert = require('assert');
var serverUtils = require('../../lib/server-utils');
var testUtils = require('./test-utils');

describe('query parameters', function () {
  // Simple chaining
  describe('extracting query parameters', function () {
    it('simple query parameters', function () {
      var rawRequest = testUtils.createRawRequest('GET',
        '/path?param1=10&param2=un test', {});
      var request = serverUtils.createRequest(rawRequest, 'http');

      var queryParameters = request.queryParameters;
      assert.equal('10', queryParameters.param1);
      assert.equal('un test', queryParameters.param2);
    });

    it('encoded query parameters', function () {
      var rawRequest = testUtils.createRawRequest('GET',
        '/path?param1=10&param2=un%20test', {});
      var request = serverUtils.createRequest(rawRequest, 'http');

      var queryParameters = request.queryParameters;
      assert.equal('10', queryParameters.param1);
      assert.equal('un test', queryParameters.param2);
    });
  });

});