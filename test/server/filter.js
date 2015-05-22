var assert = require('assert');
var restlet = require('../..');

describe('filter', function() {
  // Simple creations
  describe('simple creation', function() {
    it('with a function', function() {
      var called = false;
      var serverResource = restlet.createServerResource(
                             function(request, response) {
        called = true;
      });

      var request = {
        method: 'GET',
        reference: {
          path: '/path'
        }
      };
      var response = {};
      serverResource.handle(request, response);
      assert.equal(true, called);
    });
  });
});
