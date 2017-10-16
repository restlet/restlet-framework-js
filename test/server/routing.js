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

describe('router', function () {
  // Simple attachments
  describe('simple attach', function () {
    it('attach a function', function () {
      var router = restlet.createRouter();
      var called = false;
      var called1 = false;
      router.attach('/path1', function () {
        called1 = true;
      });
      router.attach('/path', function () {
        called = true;
      });

      var request = {
        reference: {
          path: '/path'
        }
      };
      var response = {};
      router.handle(request, response);
      assert.equal(true, called);
      assert.equal(false, called1);
    });

    it('attach a restlet', function () {
      var router = restlet.createRouter();
      var called = false;
      var called1 = false;
      router.attach('/path1', restlet.createRestlet(
        function () {
          called1 = true;
        }));
      router.attach('/path', restlet.createRestlet(function () {
        called = true;
      }));

      var request = {
        reference: {
          path: '/path'
        }
      };
      var response = {};
      router.handle(request, response);
      assert.equal(true, called);
      assert.equal(false, called1);
    });
  });
  // Attach with path variables
  describe('attach with path variables', function () {
    it('path variables #1', function () {
      var router = restlet.createRouter();
      var called = false;
      var called1 = false;
      router.attach('/path/{var1}/{var2}', function () {
        called = true;
      });
      router.attach('/path', function () {
        called1 = true;
      });

      var request = {
        reference: {
          path: '/path/val1/val2'
        }
      };
      var response = {};
      router.handle(request, response);
      assert.equal(true, called);
      assert.equal(false, called1);
      assert.equal('val1', request.pathVariables.var1);
      assert.equal('val2', request.pathVariables.var2);
    });

    it('path variables #2', function () {
      var router = restlet.createRouter();
      var called = false;
      var called1 = false;
      router.attach('/path/{var1}/test{var2}', function () {
        called = true;
      });
      router.attach('/path', function () {
        called1 = true;
      });

      var request = {
        reference: {
          path: '/path/val1/testval2'
        }
      };
      var response = {};
      router.handle(request, response);
      assert.equal(true, called);
      assert.equal(false, called1);
      assert.equal('val1', request.pathVariables.var1);
      assert.equal('val2', request.pathVariables.var2);
    });

    it('path variables #3', function () {
      var router = restlet.createRouter();
      var called = false;
      var called1 = false;
      router.attach('/path/{var1}/test({var2})', function () {
        called = true;
      });
      router.attach('/path', function () {
        called1 = true;
      });

      var request = {
        reference: {
          path: '/path/val1/test(val2)'
        }
      };
      var response = {};
      router.handle(request, response);
      assert.equal(true, called);
      assert.equal(false, called1);
      assert.equal('val1', request.pathVariables.var1);
      assert.equal('val2', request.pathVariables.var2);
    });
  });

  // Attach with query parameters

  // Attach with matching mode
});
