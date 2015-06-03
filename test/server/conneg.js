var assert = require('assert');
var restlet = require('../..');
var testUtils = require('./test-utils');

describe('content types', function() {
  describe('input content types', function() {
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
      var response = testUtils.createResponse({
        onSetStatus: function(code) {
          if (code == 405) {
            notAllowedCalled = true;
          }
        }
      });
      serverResource.handle(request, response);
      request.trigger('data', 'chunk1');
      request.trigger('data', 'chunk2');
      request.trigger('end');
      assert.equal(true, called);
      assert.equal(false, notAllowedCalled);
      assert.equal('chunk1chunk2', textPayload);
    });

    it('with function, text payload and no content type', function() {
      var called = false;
      var notSupportedMediaTypeCalled = false;
      var textPayload = null;
      var bytesPayload = null;
      var serverResource = restlet.createServerResource()
                                  .post(function(request, response) {
        called = true;
        textPayload = request.entity.text;
        bytesPayload = request.entity.raw;
      });

      var request = testUtils.createRequest('POST', '/path');
      var response = testUtils.createResponse({
        onSetStatus: function(code) {
          if (code == 415) {
            notSupportedMediaTypeCalled = true;
          }
        }
      });
      serverResource.handle(request, response);
      request.trigger('data', 'chunk1');
      request.trigger('data', 'chunk2');
      request.trigger('end');
      assert.equal(true, called);
      assert.equal(false, notSupportedMediaTypeCalled);
      assert.equal(null, textPayload);
      assert.equal(null, bytesPayload);
    });

    it('with function, text payload conversion and no content type', function() {
      var called = false;
      var notSupportedMediaTypeCalled = false;
      var serverResource = restlet.createServerResource()
                                  .post({
                                    parameters: ['entity', 'response' ],
                                    convertInputEntity: true }, function(entity, response) {
        called = true;
      });

      var request = testUtils.createRequest('POST', '/path');
      var response = testUtils.createResponse({
        onSetStatus: function(code) {
          if (code == 415) {
            notSupportedMediaTypeCalled = true;
          }
        }
      });
      serverResource.handle(request, response);
      request.trigger('data', 'chunk1');
      request.trigger('data', 'chunk2');
      request.trigger('end');
      assert.equal(false, called);
      assert.equal(true, notSupportedMediaTypeCalled);
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

      var request = testUtils.createRequest('POST', '/path', 'octet/stream');
      var response = testUtils.createResponse({
        onSetStatus: function(code) {
          if (code == 405) {
            notAllowedCalled = true;
          }
        }
      });
      serverResource.handle(request, response);
      request.trigger('data', new Buffer('chunk1', 'utf-8'));
      request.trigger('data', new Buffer('chunk2', 'utf-8'));
      request.trigger('end');
      assert.equal(true, called);
      assert.equal(false, notAllowedCalled);
      assert.equal(new Buffer('chunk1chunk2', 'utf-8').toString(),
        bytePayload.toString());
    });

    it('with function, byte payload but no content type', function() {
      var called = false;
      var notSupportedMediaTypeCalled = false;
      var bytePayload = null;
      var serverResource = restlet.createServerResource()
                                  .post(function(request, response) {
        called = true;
        bytePayload = request.entity.raw;
      });

      var request = testUtils.createRequest('POST', '/path');
      var response = testUtils.createResponse({
        onSetStatus: function(code) {
          if (code == 415) {
            notSupportedMediaTypeCalled = true;
          }
        }
      });
      serverResource.handle(request, response);
      request.trigger('data', new Buffer('chunk1', 'utf-8'));
      request.trigger('data', new Buffer('chunk2', 'utf-8'));
      request.trigger('end');
      assert.equal(true, called);
      assert.equal(false, notSupportedMediaTypeCalled);
      assert.equal(null, request.entity.raw);
      assert.equal(null, request.entity.text);
    });

    it('with function, text payload but wrong content type', function() {
      var called = false;
      var notSupportedMediaTypeCalled = false;
      var serverResource = restlet.createServerResource()
                                  .post({
                                  	parameters: [ 'entity', 'response'],
                                  	convertInputEntity: true }, function(entity, response) {
        called = true;
      });

      var request = testUtils.createRequest('POST', '/path', 'application/xml');
      var response = testUtils.createResponse({
        onSetStatus: function(code) {
          if (code == 415) {
            notSupportedMediaTypeCalled = true;
          }
        }
      });
      serverResource.handle(request, response);
      request.trigger('data', '{"test":"a');
      request.trigger('data', ' test"}');
      request.trigger('end');
      assert.equal(false, called);
      assert.equal(true, notSupportedMediaTypeCalled);
    });
  });
  describe('output content types', function() {
    it('with function and text payload', function() {
      /*var called = false;
      var notAllowedCalled = false;
      var serverResource = restlet.createServerResource()
                                  .get(function(request, response) {
        called = true;
        response.writeObject({test: 'a test'});
      });

      var request = testUtils.createRequest('GET', '/path', null, 'application/json');
      var response = testUtils.createResponse({
        onSetStatus: function(code) {
          if (code == 405) {
            notAllowedCalled = true;
          }
        }
      });
      serverResource.handle(request, response);
      request.trigger('end');
      assert.equal(true, called);
      assert.equal(false, notAllowedCalled);
      assert.equal('chunk1chunk2', textPayload);*/
    });

    // no converter
    // try to use string within writeObject
    // no accept headers
  });
});