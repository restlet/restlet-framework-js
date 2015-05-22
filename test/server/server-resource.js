var assert = require('assert');
var restlet = require('../..');

describe('server resource', function() {
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

    it('with a function and configuration (called)', function() {
      var called = false;
      var serverResource = restlet.createServerResource({ method: 'GET' },
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

    it('with a function and configuration (not called)', function() {
      var called = false;
      var notAllowedCalled = false;
      var serverResource = restlet.createServerResource({ method: 'POST' },
                                      function(request, response) {
        called = true;
      });

      var request = {
        method: 'GET',
        reference: {
          path: '/path'
        }
      };
      var response = {
        setStatus: function(code) {
          if (code == 405) {
            notAllowedCalled = true;
          }
        },
        writeRepresentation: function() {

        },
        end: function() {

        }
      };
      serverResource.handle(request, response);
      assert.equal(false, called);
      assert.equal(true, notAllowedCalled);
    });
  });

  // Explicit handler creations
  describe('handler creation', function() {
    it('with function only', function() {
      var called = false;
      var serverResource = restlet.createServerResource().handler(
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

    it('with function and configuration (called)', function() {
      var called = false;
      var serverResource = restlet.createServerResource().handler(
                   { method: 'GET' }, function(request, response) {
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

    it('with a function and configuration (not called)', function() {
      var called = false;
      var notAllowedCalled = false;
      var serverResource = restlet.createServerResource().handler(
                   { method: 'POST' }, function(request, response) {
        called = true;
      });

      var request = {
        method: 'GET',
        reference: {
          path: '/path'
        }
      };
      var response = {
        setStatus: function(code) {
          if (code == 405) {
            notAllowedCalled = true;
          }
        },
        writeRepresentation: function() {

        },
        end: function() {

        }
      };
      serverResource.handle(request, response);
      assert.equal(false, called);
      assert.equal(true, notAllowedCalled);
    });
  });

  // Shortcut handler creations for get method
  describe('get shortcut handler creation', function() {
    it('with function only (called)', function() {
      var called = false;
      var serverResource = restlet.createServerResource()
                                  .get(function(request, response) {
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

    it('with function only (not called)', function() {
      var called = false;
      var notAllowedCalled = false;
      var serverResource = restlet.createServerResource()
                                  .get(function(request, response) {
        called = true;
      });

      var request = {
        method: 'POST',
        reference: {
          path: '/path'
        }
      };
      var response = {
        setStatus: function(code) {
          if (code == 405) {
            notAllowedCalled = true;
          }
        },
        writeRepresentation: function() {

        },
        end: function() {

        }
      };
      serverResource.handle(request, response);
      assert.equal(false, called);
      assert.equal(true, notAllowedCalled);
    });
  });

  // Shortcut handler creations for post method
  describe('post shortcut handler creation', function() {
    it('with function only (called)', function() {
      var called = false;
      var serverResource = restlet.createServerResource()
                                  .post(function(request, response) {
        called = true;
      });

      var request = {
        method: 'POST',
        reference: {
          path: '/path'
        }
      };
      var response = {};
      serverResource.handle(request, response);
      assert.equal(true, called);
    });

    it('with function only (not called)', function() {
      var called = false;
      var notAllowedCalled = false;
      var serverResource = restlet.createServerResource()
                                  .post(function(request, response) {
        called = true;
      });

      var request = {
        method: 'GET',
        reference: {
          path: '/path'
        }
      };
      var response = {
        setStatus: function(code) {
          if (code == 405) {
            notAllowedCalled = true;
          }
        },
        writeRepresentation: function() {

        },
        end: function() {

        }
      };
      serverResource.handle(request, response);
      assert.equal(false, called);
      assert.equal(true, notAllowedCalled);
    });
  });
});
