'use strict';

var assert = require('assert');
var restlet = require('../..');
var testUtils = require('./test-utils');

describe('server resource', function () {
  // Simple creations
  describe('simple creation', function () {
    it('with a function', function () {
      var called = false;
      var serverResource = restlet.createServerResource(
        function (request, response) {
          called = true;
          response.end();
        });

      var request = testUtils.createMockRequest('GET', '/path');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('end');

      assert.equal(true, called);
    });

    it('with a function and configuration (called)', function () {
      var called = false;
      var serverResource = restlet.createServerResource({ method: 'GET' },
        function (request, response) {
          called = true;
          response.end();
        });

      var request = testUtils.createMockRequest('GET', '/path');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('end');

      assert.equal(true, called);
    });

    it('with a function and configuration (not called)', function () {
      var called = false;
      var serverResource = restlet.createServerResource({ method: 'POST' },
        function (request, response) {
          called = true;
          response.end();
        });

      var request = testUtils.createMockRequest('GET', '/path');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('end');

      var rawResponse = response.rawResponse;
      assert.equal(false, called);
      assert.equal(405, rawResponse.statusCode);
      assert.equal('Method Not Allowed', rawResponse.statusMessage);
      assert.equal('Method Not Allowed', rawResponse.text);
    });
  });

  // Explicit handler creations
  describe('handler creation', function () {
    it('with function only', function () {
      var called = false;
      var serverResource = restlet.createServerResource().handler(
        function (request, response) {
          called = true;
          response.end();
        });

      var request = testUtils.createMockRequest('GET', '/path');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('end');

      assert.equal(true, called);
    });

    it('with function and configuration (called)', function () {
      var called = false;
      var serverResource = restlet.createServerResource().handler(
        { method: 'GET' }, function (request, response) {
          called = true;
          response.end();
        });

      var request = testUtils.createMockRequest('GET', '/path');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('end');

      assert.equal(true, called);
    });

    it('with a function and configuration (not called)', function () {
      var called = false;
      var serverResource = restlet.createServerResource().handler(
        { method: 'POST' }, function (request, response) {
          called = true;
          response.end();
        });

      var request = testUtils.createMockRequest('GET', '/path');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('end');

      var rawResponse = response.rawResponse;
      assert.equal(false, called);
      assert.equal(405, rawResponse.statusCode);
      assert.equal('Method Not Allowed', rawResponse.statusMessage);
      assert.equal('Method Not Allowed', rawResponse.text);
    });
  });

  // Shortcut handler creations for get method
  describe('get shortcut handler creation', function () {
    it('with function only (called)', function () {
      var called = false;
      var serverResource = restlet.createServerResource()
        .get(function (request, response) {
          called = true;
          response.end();
        });

      var request = testUtils.createMockRequest('GET', '/path');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('end');

      assert.equal(true, called);
    });

    it('with function only (not called)', function () {
      var called = false;
      var serverResource = restlet.createServerResource()
        .get(function (request, response) {
          called = true;
          response.end();
        });

      var request = testUtils.createMockRequest('POST', '/path');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('end');

      var rawResponse = response.rawResponse;
      assert.equal(false, called);
      assert.equal(405, rawResponse.statusCode);
      assert.equal('Method Not Allowed', rawResponse.statusMessage);
      assert.equal('Method Not Allowed', rawResponse.text);
    });
  });

  // Shortcut handler creations for post method
  describe('post shortcut handler creation', function () {
    it('with function only (called)', function () {
      var called = false;
      var serverResource = restlet.createServerResource()
        .post(function (request, response) {
          called = true;
          response.end();
        });

      var request = testUtils.createMockRequest('POST', '/path');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('end');

      assert.equal(true, called);
    });

    it('with function only (not called)', function () {
      var called = false;
      var serverResource = restlet.createServerResource()
        .post(function (request, response) {
          called = true;
          response.end();
        });

      var request = testUtils.createMockRequest('GET', '/path');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('end');

      var rawResponse = response.rawResponse;
      assert.equal(false, called);
      assert.equal(405, rawResponse.statusCode);
      assert.equal('Method Not Allowed', rawResponse.statusMessage);
      assert.equal('Method Not Allowed', rawResponse.text);
    });

    it('with function and text payload', function () {
      var called = false;
      var textPayload = null;
      var serverResource = restlet.createServerResource()
        .post(function (request, response) {
          called = true;
          textPayload = request.entity.text;
          response.end();
        });

      var request = testUtils.createMockRequest(
        'POST', '/path', 'application/xml');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('data', 'chunk1');
      request.trigger('data', 'chunk2');
      request.trigger('end');

      var rawResponse = response.rawResponse;
      assert.equal(true, called);
      assert.equal(200, rawResponse.statusCode);
      assert.equal('OK', rawResponse.statusMessage);
      assert.equal('chunk1chunk2', textPayload);
    });

    it('with function, text payload and no content type', function () {
      var called = false;
      var textPayload = null;
      var bytesPayload = null;
      var serverResource = restlet.createServerResource()
        .post(function (request, response) {
          called = true;
          textPayload = request.entity.text;
          bytesPayload = request.entity.raw;
          response.end();
        });

      var request = testUtils.createMockRequest('POST', '/path');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('data', 'chunk1');
      request.trigger('data', 'chunk2');
      request.trigger('end');

      var rawResponse = response.rawResponse;
      assert.equal(true, called);
      assert.equal(200, rawResponse.statusCode);
      assert.equal('OK', rawResponse.statusMessage);
      assert.equal(null, textPayload);
      assert.equal(null, bytesPayload);
    });

    it('with function, text payload conversion and no content type',
      function () {
        var called = false;
        var serverResource = restlet.createServerResource()
          .post({
            parameters: [ 'entity', 'response' ],
            convertInputEntity: true
          }, function () {
            called = true;
          });

        var request = testUtils.createMockRequest('POST', '/path');
        var response = testUtils.createMockResponse(request);
        serverResource.handle(request, response);
        request.trigger('data', 'chunk1');
        request.trigger('data', 'chunk2');
        request.trigger('end');

        var rawResponse = response.rawResponse;
        assert.equal(415, rawResponse.statusCode);
        assert.equal('Unsupported Media Type', rawResponse.statusMessage);
        assert.equal(false, called);
      });

    it('with function and byte payload', function () {
      var called = false;
      var bytePayload = null;
      var serverResource = restlet.createServerResource()
        .post(function (request, response) {
          called = true;
          bytePayload = request.entity.raw;
          response.end();
        });

      var request = testUtils.createMockRequest(
        'POST', '/path', 'octet/stream');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('data', new Buffer('chunk1', 'utf-8'));
      request.trigger('data', new Buffer('chunk2', 'utf-8'));
      request.trigger('end');

      var rawResponse = response.rawResponse;
      assert.equal(true, called);
      assert.equal(200, rawResponse.statusCode);
      assert.equal('OK', rawResponse.statusMessage);
      assert.equal(new Buffer('chunk1chunk2', 'utf-8').toString(),
        bytePayload.toString());
    });

    it('with function, byte payload but no content type', function () {
      var called = false;
      var bytePayload = null;
      var serverResource = restlet.createServerResource()
        .post(function (request, response) {
          called = true;
          bytePayload = request.entity.raw;
          response.end();
        });

      var request = testUtils.createMockRequest('POST', '/path');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('data', new Buffer('chunk1', 'utf-8'));
      request.trigger('data', new Buffer('chunk2', 'utf-8'));
      request.trigger('end');
      assert.equal(called, true);

      var rawResponse = response.rawResponse;
      assert.equal(200, rawResponse.statusCode);
      assert.equal('OK', rawResponse.statusMessage);
      assert.equal(null, request.entity.raw);
      assert.equal(null, request.entity.text);
    });
  });
});
