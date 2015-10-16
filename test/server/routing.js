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