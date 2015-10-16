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