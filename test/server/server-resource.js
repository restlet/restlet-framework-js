var assert = require('assert');
var restlet = require('../..');
var testUtils = require('./test-utils');

describe('server resource', function() {
  // Simple creations
  describe('simple creation', function() {
    it('with a function', function() {
      var called = false;
      var serverResource = restlet.createServerResource(
                                      function(request, response) {
        called = true;
      });

      var request = testUtils.createRequest('GET', '/path');
      var response = {};
      serverResource.handle(request, response);
      request.trigger('end');
      assert.equal(true, called);
    });

    it('with a function and configuration (called)', function() {
      var called = false;
      var serverResource = restlet.createServerResource({ method: 'GET' },
                                      function(request, response) {
        called = true;
      });

      var request = testUtils.createRequest('GET', '/path');
      var response = {};
      serverResource.handle(request, response);
      request.trigger('end');
      assert.equal(true, called);
    });

    it('with a function and configuration (not called)', function() {
      var called = false;
      var notAllowedCalled = false;
      var serverResource = restlet.createServerResource({ method: 'POST' },
                                      function(request, response) {
        called = true;
      });

      var request = testUtils.createRequest('GET', '/path');
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
      request.trigger('end');
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

      var request = testUtils.createRequest('GET', '/path');
      var response = {};
      serverResource.handle(request, response);
      request.trigger('end');
      assert.equal(true, called);
    });

    it('with function and configuration (called)', function() {
      var called = false;
      var serverResource = restlet.createServerResource().handler(
                   { method: 'GET' }, function(request, response) {
        called = true;
      });

      var request = testUtils.createRequest('GET', '/path');
      var response = {};
      serverResource.handle(request, response);
      request.trigger('end');
      assert.equal(true, called);
    });

    it('with a function and configuration (not called)', function() {
      var called = false;
      var notAllowedCalled = false;
      var serverResource = restlet.createServerResource().handler(
                   { method: 'POST' }, function(request, response) {
        called = true;
      });

      var request = testUtils.createRequest('GET', '/path');
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
      request.trigger('end');
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

      var request = testUtils.createRequest('GET', '/path');
      var response = {};
      serverResource.handle(request, response);
      request.trigger('end');
      assert.equal(true, called);
    });

    it('with function only (not called)', function() {
      var called = false;
      var notAllowedCalled = false;
      var serverResource = restlet.createServerResource()
                                  .get(function(request, response) {
        called = true;
      });

      var request = testUtils.createRequest('POST', '/path');
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
      request.trigger('end');
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

      var request = testUtils.createRequest('POST', '/path');
      var response = {};
      serverResource.handle(request, response);
      request.trigger('end');
      assert.equal(true, called);
    });

    it('with function only (not called)', function() {
      var called = false;
      var notAllowedCalled = false;
      var serverResource = restlet.createServerResource()
                                  .post(function(request, response) {
        called = true;
      });

      var request = testUtils.createRequest('GET', '/path');
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
      request.trigger('end');
      assert.equal(false, called);
      assert.equal(true, notAllowedCalled);
    });

    it('with function and text payload', function() {
      var called = false;
      var notAllowedCalled = false;
      var textPayload = null;
      var serverResource = restlet.createServerResource()
                                  .post(function(request, response) {
        called = true;
        textPayload = request.entity.text;
      });

      var request = testUtils.createRequest('POST', '/path', 'application/xml');
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
      request.trigger('data', 'chunk1');
      request.trigger('data', 'chunk2');
      request.trigger('end');
      assert.equal(true, called);
      assert.equal(false, notAllowedCalled);
      assert.equal('chunk1chunk2', textPayload);
    });

    it('with function and byte payload', function() {
      var called = false;
      var notAllowedCalled = false;
      var bytePayload = null;
      var serverResource = restlet.createServerResource()
                                  .post(function(request, response) {
        called = true;
        bytePayload = request.entity.raw;
      });

      var request = testUtils.createRequest('POST', '/path');
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
      request.trigger('data', new Buffer('chunk1', 'utf-8'));
      request.trigger('data', new Buffer('chunk2', 'utf-8'));
      request.trigger('end');
      assert.equal(true, called);
      assert.equal(false, notAllowedCalled);
      assert.equal(new Buffer('chunk1chunk2', 'utf-8').toString(),
        bytePayload.toString());
    });
  });
});
