var assert = require('assert');
var restlet = require('../..');
var testUtils = require('./test-utils');

describe('server resource parameters', function() {
  describe('server resource with parameter '
    + '"request" and "response"', function() {
    it('with function and text payload', function() {
      var handleCalled = false;
      var endCalled = false;
      var notAllowedCalled = false;
      var textPayload = null;
      var serverResource = restlet.createServerResource()
                                  .post({
                                    parameters: [ 'request', 'response' ]
                                  }, function(request, response) {
        handleCalled = true;
        textPayload = request.entity.text;
        response.end();
      });

      var request = testUtils.createRequest(
        'POST', '/path', 'application/xml');
      var response = {
        setStatus: function(code) {
          if (code == 405) {
            notAllowedCalled = true;
          }
        },
        writeRepresentation: function() {

        },
        end: function() {
          endCalled = true;
        }
      };
      serverResource.handle(request, response);
      request.trigger('data', 'chunk1');
      request.trigger('data', 'chunk2');
      request.trigger('end');
      assert.equal(true, handleCalled);
      assert.equal(false, notAllowedCalled);
      assert.equal('chunk1chunk2', textPayload);
      assert.equal(true, endCalled);
    });
  });

  describe('server resource with parameter "entity"', function() {
    it('with entity', function() {
      var called = false;
      var notAllowedCalled = false;
      var textPayload = null;
      var serverResource = restlet.createServerResource()
                                  .post({
                                    parameters: [ 'entity' ]
                                  }, function(entity) {
        called = true;
        textPayload = entity.text;
      });

      var request = testUtils.createRequest('POST',
        '/path', 'application/xml');
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

    it('with entity and conversion', function() {
      var called = false;
      var objEntity = null;
      var serverResource = restlet.createServerResource()
                                  .post({
                                    convertInputEntity: true,
                                    parameters: [ 'entity' ]
                                  }, function(entity) {
        called = true;
        objEntity = entity;
      });

      var request = testUtils.createRequest('POST',
        '/path', 'application/xml');
      request.clientInfo = {
        acceptedMediaTypes: [ 'application/json' ]
      }
      var response = {
        setStatus: function(code) {

        },
        writeRepresentation: function() {

        },
        end: function() {

        }
      };
      serverResource.handle(request, response);
      request.trigger('data', '{"attr1":');
      request.trigger('data', '10,"attr2":"a string"}');
      request.trigger('end');
      assert.equal(true, called);
      assert.equal(10, objEntity.attr1);
      assert.equal('a string', objEntity.attr2);
    });
  });

  describe('server resource with parameter "reference"', function() {
    it('with reference', function() {
      var called = false;
      var savedReference = null;
      var serverResource = restlet.createServerResource()
                                  .post({
                                    parameters: [ 'reference' ]
                                  }, function(reference) {
        called = true;
        savedReference = reference;
      });

      var request = testUtils.createRequest('POST',
        '/path?test=10', 'application/xml');
      var response = {
        setStatus: function(code) {

        },
        writeRepresentation: function() {

        },
        end: function() {

        }
      };
      serverResource.handle(request, response);
      request.trigger('end');
      assert.equal(true, called);
      assert.equal('/path?test=10', savedReference.path);
    });
  });

  describe('server resource with parameter "queryParameters"', function() {
    it('with query parameters globally', function() {
      var called = false;
      var savedQueryParameters = null;
      var serverResource = restlet.createServerResource()
                                  .post({
                                    parameters: [ 'queryParameters' ]
                                  }, function(queryParameters) {
        called = true;
        savedQueryParameters = queryParameters;
      });

      var request = testUtils.createRequest('POST',
        '/path?param1=10&param2=un%20test', 'application/xml');
      var response = {
        setStatus: function(code) {
        },
        writeRepresentation: function() {

        },
        end: function() {

        }
      };
      serverResource.handle(request, response);
      request.trigger('end');
      assert.equal(true, called);
      assert.equal('10', savedQueryParameters.param1);
      assert.equal('un test', savedQueryParameters.param2);
    });

    it('with single query parameters', function() {
      var called = false;
      var savedParam1 = null;
      var savedParam2 = null;
      var serverResource = restlet.createServerResource()
                                  .post({
                                    parameters: [ 'queryParameters["param1"]',
                                      'queryParameters["param2"]' ]
                                  },
                                  function(param1, param2) {
        called = true;
        savedParam1 = param1;
        savedParam2 = param2;
      });

      var request = testUtils.createRequest('POST',
        '/path?param1=10&param2=un%20test', 'application/xml');
      var response = {
        setStatus: function(code) {
        },
        writeRepresentation: function() {

        },
        end: function() {

        }
      };
      serverResource.handle(request, response);
      request.trigger('end');
      assert.equal(true, called);
      assert.equal('10', savedParam1);
      assert.equal('un test', savedParam2);
    });
  });
});