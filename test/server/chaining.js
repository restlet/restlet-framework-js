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

// See the following RFC for more details:
// http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html

describe('request / response chaining', function () {
  // Simple chaining
  describe('simple chaining', function () {
    it('restlet chaining', function () {
      var cpt = 0;
      var restlet1Called = 0;
      var restlet2Called = 0;
      var endCalled = 0;

      var virtualHost = restlet.createVirtualHost();

      var restlet1 = restlet.createRestlet(function (request, response, next) {
        restlet1Called = cpt;
        cpt++;
        next();
      });

      virtualHost.attachDefault(restlet1);

      restlet1.next(function (request, response) {
        restlet2Called = cpt;
        cpt++;
        response.end();
      });

      var request = {
        reference: {
          path: '/path'
        }
      };
      var response = {
        end: function () {
          endCalled = cpt;
          cpt++;
        }
      };

      virtualHost.handle(request, response);

      assert.equal(0, restlet1Called);
      assert.equal(1, restlet2Called);
      assert.equal(2, endCalled);
    });
  });

  // Router chaining

  // Filter chaining

  // Application chaining
});
