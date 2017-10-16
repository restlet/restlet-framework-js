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

describe('general headers', function () {
  // Simple creations
  describe('date header', function () {
    it('no date header', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path', {});

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(null, request.date);
    });

    it('date header with correct format', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { date: 'Tue, 11 Jul 2000 18:23:51 GMT' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(963339831000, request.date);
    });

    it('date header with wrong format', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { date: 'Tue, 11 XXXXXXJul 2000 18:23:51 GMT' });

      var request = serverUtils.createRequest(rawRequest, 'http');
      assert.equal(null, request.date);
    });
  });
});
