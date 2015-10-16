'use strict';

var assert = require('assert');
var restlet = require('../..');
var testUtils = require('./test-utils');

describe('server resource parameters', function () {
  describe('server resource with parameter '
    + '"request" and "response"', function () {
    it('with function and text payload', function () {
      var handleCalled = false;
      var endCalled = false;
      var textPayload = null;
      var serverResource = restlet.createServerResource()
        .post({
          parameters: [ 'request', 'response' ]
        }, function (request, response) {
          handleCalled = true;
          textPayload = request.entity.text;
          response.end();
        });

      var request = testUtils.createMockRequest(
        'POST', '/path', 'application/xml');
      var response = testUtils.createMockResponse(request, {
        end: [ function () {
          endCalled = true;
        } ]
      });
      serverResource.handle(request, response);
      request.trigger('data', 'chunk1');
      request.trigger('data', 'chunk2');
      request.trigger('end');

      assert.equal(true, handleCalled);
      assert.equal('chunk1chunk2', textPayload);
      assert.equal(true, endCalled);
    });
  });

  describe('server resource with parameter "entity"', function () {
    it('with entity', function () {
      var called = false;
      var textPayload = null;
      var serverResource = restlet.createServerResource()
        .post({
          parameters: [ 'entity' ]
        }, function (entity) {
          called = true;
          textPayload = entity.text;
          response.end();
        });

      var request = testUtils.createMockRequest('POST',
        '/path', 'application/xml');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('data', 'chunk1');
      request.trigger('data', 'chunk2');
      request.trigger('end');

      assert.equal(true, called);
      assert.equal('chunk1chunk2', textPayload);
    });

    it('with entity and conversion', function () {
      var called = false;
      var objEntity = null;
      var serverResource = restlet.createServerResource()
        .post({
          convertInputEntity: true,
          parameters: [ 'entity' ]
        }, function (entity) {
          called = true;
          objEntity = entity;
        });

      var request = testUtils.createMockRequest('POST',
        '/path', 'application/json', 'application/json');
      var response = testUtils.createMockResponse(request);

      serverResource.handle(request, response);
      request.trigger('data', '{"attr1":');
      request.trigger('data', '10,"attr2":"a string"}');
      request.trigger('end');
      assert.equal(true, called);
      assert.equal(10, objEntity.attr1);
      assert.equal('a string', objEntity.attr2);
    });

    it('with entity and conversion (error)', function () {
      var called = false;
      var objEntity = null;
      var serverResource = restlet.createServerResource()
        .post({
          convertInputEntity: true,
          parameters: [ 'entity' ]
        }, function (entity) {
          called = true;
          objEntity = entity;
        });

      var request = testUtils.createMockRequest('POST',
        '/path', 'application/xml', 'application/json');
      var response = testUtils.createMockResponse(request);

      serverResource.handle(request, response);
      request.trigger('data', '{"attr1":');
      request.trigger('data', '10,"attr2":"a string"}');
      request.trigger('end');

      var rawResponse = response.rawResponse;
      assert.equal(called, false);
      assert.equal(rawResponse.statusCode, 415);
      assert.equal(rawResponse.statusMessage, 'Unsupported Media Type');
      assert.equal(objEntity, null);
    });
  });

  describe('server resource with parameter "reference"', function () {
    it('with reference', function () {
      var called = false;
      var savedReference = null;
      var serverResource = restlet.createServerResource()
        .post({
          parameters: [ 'reference' ]
        }, function (reference) {
          called = true;
          savedReference = reference;
        });

      var request = testUtils.createMockRequest('POST',
        '/path?test=10', 'application/xml');
      var response = testUtils.createMockResponse();
      serverResource.handle(request, response);
      request.trigger('end');
      assert.equal(called, true);
      assert.equal(savedReference.path, '/path');
      assert.equal(savedReference.query, 'test=10');
    });
  });

  describe('server resource with parameter "queryParameters"', function () {
    it('with query parameters globally', function () {
      var called = false;
      var savedQueryParameters = null;
      var serverResource = restlet.createServerResource()
        .post({
          parameters: [ 'queryParameters' ]
        }, function (queryParameters) {
          called = true;
          savedQueryParameters = queryParameters;
        });

      var request = testUtils.createMockRequest('POST',
        '/path?param1=10&param2=un%20test', 'application/xml');
      var response = testUtils.createMockResponse();
      serverResource.handle(request, response);
      request.trigger('end');
      assert.equal(true, called);
      assert.equal('10', savedQueryParameters.param1);
      assert.equal('un test', savedQueryParameters.param2);
    });

    it('with single query parameters', function () {
      var called = false;
      var savedParam1 = null;
      var savedParam2 = null;
      var serverResource = restlet.createServerResource()
        .post({
          parameters: [ 'queryParameters["param1"]',
            'queryParameters["param2"]' ]
        },
        function (param1, param2) {
          called = true;
          savedParam1 = param1;
          savedParam2 = param2;
        });

      var request = testUtils.createMockRequest('POST',
        '/path?param1=10&param2=un%20test', 'application/xml');
      var response = testUtils.createMockResponse();
      serverResource.handle(request, response);
      request.trigger('end');
      assert.equal(true, called);
      assert.equal('10', savedParam1);
      assert.equal('un test', savedParam2);
    });
  });
});