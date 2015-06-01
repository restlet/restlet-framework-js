var assert = require('assert');
var restlet = require('../..');
var testUtils = require('./test-utils');

describe('filter', function() {
  // Simple creations
  describe('simple creation', function() {
    it('with a function', function() {
      var called = false;
      var serverResource = restlet.createServerResource(
                             function(request, response) {
        called = true;
      });

      var request = testUtils.createRequest('GET', '/path');
      var response = testUtils.createResponse();
      serverResource.handle(request, response);
      request.trigger('end');
      assert.equal(true, called);
    });
  });
});
