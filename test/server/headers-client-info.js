'use strict';

var assert = require('assert');
var testUtils = require('./test-utils');
var serverUtils = require('../../lib/server-utils');

// See the following RFC for more details:
// http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html

describe('client info creation', function () {
  // Simple creations
  describe('accept header', function () {
    it('no accept header', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        {});
      var request = serverUtils.createRequest(rawRequest, 'http');
      var clientInfo = request.clientInfo;

      assert.equal(1, clientInfo.acceptedMediaTypes.length);
      assert.equal('*/*', clientInfo.acceptedMediaTypes[ 0 ].name);
    });

    it('accept header with single value', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { accept: 'application/json' });
      var request = serverUtils.createRequest(rawRequest, 'http');
      var clientInfo = request.clientInfo;

      assert.equal(1, clientInfo.acceptedMediaTypes.length);
      assert.equal('application/json', clientInfo.acceptedMediaTypes[ 0 ].name);
      assert.equal(null, clientInfo.acceptedMediaTypes[ 0 ].quality);
      assert.equal(null, clientInfo.acceptedMediaTypes[ 0 ].level);
    });

    it('accept header with multiple values', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { accept: 'application/json, application/xml' });
      var request = serverUtils.createRequest(rawRequest, 'http');
      var clientInfo = request.clientInfo;

      assert.equal(2, clientInfo.acceptedMediaTypes.length);
      assert.equal('application/json', clientInfo.acceptedMediaTypes[ 0 ].name);
      assert.equal('application/xml', clientInfo.acceptedMediaTypes[ 1 ].name);
      assert.equal(null, clientInfo.acceptedMediaTypes[ 0 ].quality);
      assert.equal(null, clientInfo.acceptedMediaTypes[ 0 ].level);
      assert.equal(null, clientInfo.acceptedMediaTypes[ 1 ].quality);
      assert.equal(null, clientInfo.acceptedMediaTypes[ 1 ].level);
    });

    it('accept header with multiple values and parameters', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        {
          accept: 'text/*;q=0.3, text/html;q=0.7, text/html;level=1,'
          + ' text/html;level=2;q=0.4, */*;q=0.5'
        });
      var request = serverUtils.createRequest(rawRequest, 'http');
      var clientInfo = request.clientInfo;

      assert.equal(5, clientInfo.acceptedMediaTypes.length);
      // Parameter #1
      var acceptedMediaType1 = clientInfo.acceptedMediaTypes[ 0 ];
      assert.equal('text/*', acceptedMediaType1.name);
      assert.equal(1, acceptedMediaType1.parameters.length);
      assert.equal('q', acceptedMediaType1.parameters[ 0 ].name);
      assert.equal('0.3', acceptedMediaType1.parameters[ 0 ].value);
      assert.equal('0.3', acceptedMediaType1.quality);
      // Parameter #2
      var acceptedMediaType2 = clientInfo.acceptedMediaTypes[ 1 ];
      assert.equal('text/html', acceptedMediaType2.name);
      assert.equal(1, acceptedMediaType2.parameters.length);
      assert.equal('q', acceptedMediaType2.parameters[ 0 ].name);
      assert.equal('0.7', acceptedMediaType2.parameters[ 0 ].value);
      assert.equal('0.7', acceptedMediaType2.quality);
      // Parameter #3
      var acceptedMediaType3 = clientInfo.acceptedMediaTypes[ 2 ];
      assert.equal('text/html', acceptedMediaType3.name);
      assert.equal(1, acceptedMediaType3.parameters.length);
      assert.equal('level', acceptedMediaType3.parameters[ 0 ].name);
      assert.equal('1', acceptedMediaType3.parameters[ 0 ].value);
      assert.equal('1', acceptedMediaType3.level);
      // Parameter #4
      var acceptedMediaType4 = clientInfo.acceptedMediaTypes[ 3 ];
      assert.equal('text/html', acceptedMediaType4.name);
      assert.equal(2, acceptedMediaType4.parameters.length);
      assert.equal('level', acceptedMediaType4.parameters[ 0 ].name);
      assert.equal('2', acceptedMediaType4.parameters[ 0 ].value);
      assert.equal('q', acceptedMediaType4.parameters[ 1 ].name);
      assert.equal('0.4', acceptedMediaType4.parameters[ 1 ].value);
      assert.equal('2', acceptedMediaType4.level);
      assert.equal('0.4', acceptedMediaType4.quality);
      // Parameter #5
      var acceptedMediaType5 = clientInfo.acceptedMediaTypes[ 4 ];
      assert.equal('*/*', acceptedMediaType5.name);
      assert.equal(1, acceptedMediaType5.parameters.length);
      assert.equal('q', acceptedMediaType5.parameters[ 0 ].name);
      assert.equal('0.5', acceptedMediaType5.parameters[ 0 ].value);
      assert.equal('0.5', acceptedMediaType5.quality);
    });

    it('accept header with wrong format', function () {
      var rawRequest = testUtils.createRawRequest('GET', '/path',
        { accept: 'text/*;q, text/html,level=2;q=0.4, */*;q=0.5' });

      var throwError = false;
      try {
        serverUtils.createRequest(rawRequest, 'http');
      } catch (err) {
        throwError = true;
        console.log(err);
      }

      if (!throwError) {
        // TODO: assert.equal(false, true);
      }
    });
  });
});