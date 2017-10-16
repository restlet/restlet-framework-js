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
var testUtils = require('./test-utils');
var serverUtils = require('../../lib/server-utils');

// See the following RFC for more details:
// http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html

describe('entity headers', function () {
  // Content type
  describe('content type header', function () {
    it('no header', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path', {});

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(null, request.entity.mediaType);
    });

    it('header with correct format', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { 'content-type': 'application/json' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal('application/json', request.entity.mediaType.name);
    });

    it('header with wrong format', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { 'content-type': 'application/json' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal('application/json', request.entity.mediaType.name);
    });
  });

  // Content length
  describe('content length header', function () {
    it('no header', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path', {});

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(-1, request.entity.length);
    });

    it('header with correct format', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { 'content-length': '12345' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(12345, request.entity.length);
    });

    it('header with wrong format', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { 'content-length': 'abcde' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(-1, request.entity.length);
    });
  });

  // Encoding
  describe('content encoding header', function () {
    it('no header', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path', {});

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(0, request.entity.encodings.length);
    });

    it('header with correct format', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { 'content-encoding': 'compress, deflate' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(2, request.entity.encodings.length);
      assert.equal('compress', request.entity.encodings[ 0 ]);
      assert.equal('deflate', request.entity.encodings[ 1 ]);
    });

    it('header with wrong format', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { 'content-encoding': 'abcde' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(1, request.entity.encodings.length);
      assert.equal('abcde', request.entity.encodings[ 0 ]);
    });
  });

  // Language
  describe('content language header', function () {
    it('no header', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path', {});

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(0, request.entity.languages.length);
    });

    it('header with correct format', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { 'content-language': 'fr-fr, en' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(2, request.entity.languages.length);
      assert.equal('fr-fr', request.entity.languages[ 0 ]);
      assert.equal('en', request.entity.languages[ 1 ]);
    });

    it('header with wrong format', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { 'content-language': 'abcde' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(1, request.entity.languages.length);
      assert.equal('abcde', request.entity.languages[ 0 ]);
    });
  });

  // Range
  describe('content range header', function () {
    it('no header', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path', {});

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(null, request.entity.range);
    });

    it('header with correct format', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { 'content-range': 'bytes 500-999/1234' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(1234, request.entity.length);
      assert.equal(1, request.entity.ranges.length);
      assert.equal(500, request.entity.ranges[ 0 ].index);
      assert.equal(500, request.entity.ranges[ 0 ].length);
    });

    it('header with wrong format (1)', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { 'content-language': 'abcde' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(null, request.entity.range);
    });

    it('header with wrong format (2)', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { 'content-language': 'bytes dd-12/12' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(null, request.entity.range);
    });

    it('header with wrong format (3)', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { 'content-language': 'bytes 12-dd/12' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(null, request.entity.range);
    });

    it('header with wrong format (4)', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { 'content-language': 'bytes 12-12/dd' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(null, request.entity.range);
    });
  });
});
