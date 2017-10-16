/*
 * Copyright 2005-2017 Restlet
 *
 * The contents of this file are subject to the terms of one of the following
 * open source licenses: Apache 2.0 or or EPL 1.0 (the "Licenses"). You can
 * select the license that you prefer but you may not use this file except in
 * compliance with one of these Licenses.
 *
 * You can obtain a copy of the Apache 2.0 license at
 * http://www.opensource.org/licenses/apache-2.0
 *
 * You can obtain a copy of the EPL 1.0 license at
 * http://www.opensource.org/licenses/eclipse-1.0
 *
 * See the Licenses for the specific language governing permissions and
 * limitations under the Licenses.
 *
 * Alternatively, you can obtain a royalty free commercial license with less
 * limitations, transferable or non-transferable, directly at
 * http://restlet.com/products/restlet-framework
 *
 * Restlet is a registered trademark of Restlet S.A.S.
 */

'use strict';

var assert = require('assert');
var restlet = require('../..');
var testUtils = require('./test-utils');

describe('content types', function () {
  describe('input content types', function () {
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

      assert.equal(called, true);
      assert.equal(textPayload, 'chunk1chunk2');
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

      assert.equal(called, true);
      assert.equal(textPayload, null);
      assert.equal(bytesPayload, null);
    });

    it('with function, text payload conversion and no content type',
      function () {
        var called = false;
        var serverResource = restlet.createServerResource()
          .post({
            parameters: [ 'entity', 'response' ],
            convertInputEntity: true
          }, function (entity, response) {
            called = true;
            response.end();
          });

        var request = testUtils.createMockRequest('POST', '/path');
        var response = testUtils.createMockResponse(request);
        serverResource.handle(request, response);
        request.trigger('data', 'chunk1');
        request.trigger('data', 'chunk2');
        request.trigger('end');

        assert.equal(called, false);
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

      assert.equal(called, true);
      assert.equal(bytePayload.toString(),
        new Buffer('chunk1chunk2', 'utf-8').toString());
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
      assert.equal(request.entity.raw, null);
      assert.equal(request.entity.text, null);
    });

    it('with function, text payload but wrong content type', function () {
      var called = false;
      var serverResource = restlet.createServerResource()
        .post({
          parameters: [ 'entity', 'response' ],
          convertInputEntity: true
        }, function (entity, response) {
          called = true;
          response.end();
        });

      var request = testUtils.createMockRequest(
        'POST', '/path', 'application/xml');
      var response = testUtils.createMockResponse(request);
      serverResource.handle(request, response);
      request.trigger('data', '{"test":"a');
      request.trigger('data', ' test"}');
      request.trigger('end');

      assert.equal(called, false);
    });
  });
  describe('output content types', function () {
    it('with function and text payload', function () {
      /* TODO: var called = false;
       var notAllowedCalled = false;
       var serverResource = restlet.createServerResource()
       .get(function(request, response) {
       called = true;
       response.writeObject({test: 'a test'});
       });

       var request = testUtils.createMockRequest(
       'GET', '/path', null, 'application/json');
       var response = testUtils.createMockResponse({
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

    // TODO: no converter
    // TODO: try to use string within writeObject
    // no accept headers
  });
});
