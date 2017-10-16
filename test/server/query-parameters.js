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
var serverUtils = require('../../lib/server-utils');
var testUtils = require('./test-utils');

describe('query parameters', function () {
  // Simple chaining
  describe('extracting query parameters', function () {
    it('simple query parameters', function () {
      var rawRequest = testUtils.createRawRequest('GET',
        '/path?param1=10&param2=un test', {});
      var request = serverUtils.createRequest(rawRequest, 'http');

      var queryParameters = request.queryParameters;
      assert.equal('10', queryParameters.param1);
      assert.equal('un test', queryParameters.param2);
    });

    it('encoded query parameters', function () {
      var rawRequest = testUtils.createRawRequest('GET',
        '/path?param1=10&param2=un%20test', {});
      var request = serverUtils.createRequest(rawRequest, 'http');

      var queryParameters = request.queryParameters;
      assert.equal('10', queryParameters.param1);
      assert.equal('un test', queryParameters.param2);
    });
  });

});
