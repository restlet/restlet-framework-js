var assert = require('assert');
var restlet = require('../..');

describe('router', function() {
  // Simple attachments
  describe('simple attach', function() {
    it('attach a function', function() {
      var router = restlet.createRouter();
      var called = false;
      router.attach('/path', function(request, response) {
        called = true;
      });

      var request = {
        reference: {
          path: '/path'
        }
      };
      var response = {};
      router.handle(request, response);
      assert.equal(true, called);
    });

    it('attach a restlet', function() {
      var router = restlet.createRouter();
      var called = false;
      router.attach('/path', restlet.createRestlet(function(request, response) {
        called = true;
      }));

      var request = {
        reference: {
          path: '/path'
        }
      };
      var response = {};
      router.handle(request, response);
      assert.equal(true, called);
    });
  });

  // Attach with path variables

  // Attach with query parameters

  // Attach with matching mode
});