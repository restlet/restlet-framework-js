'use strict';

var assert = require('assert');
var restlet = require('../..');
var testUtils = require('./test-utils');

describe('filter', function () {
  // Simple creations
  describe('simple creation', function () {
    it('with a function', function () {
      var called = false;
      var serverResource = restlet.createServerResource(
        function () {
          called = true;
        });

      var request = testUtils.createMockRequest('GET', '/path');
      var response = testUtils.createMockResponse();
      serverResource.handle(request, response);
      request.trigger('end');
      assert.equal(true, called);
    });
  });
});
