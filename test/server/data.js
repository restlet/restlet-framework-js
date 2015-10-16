'use strict';

var assert = require('assert');
var data = require('../../lib/data');

describe('Media Library checkExtension', function () {

  var mediaTypeJson = { name: 'application/json' };
  var mediaTypeXml = { name: 'application/xml' };
  var mediaTypeHtml = { name: 'text/html' };
  var mediaTypeYaml = { name: 'text/yaml' };

  it('should verify json type', function () {

    var isValid = data.EXTENSIONS.checkExtension('json', [ mediaTypeJson ]);

    assert.equal(isValid, true);
  });

  it('should verify yaml type', function () {

    var isValid = data.EXTENSIONS.checkExtension('yaml', [ mediaTypeYaml ]);

    assert.equal(isValid, true);
  });

  it('should verify yaml type with multiple accepted', function () {

    var isValid = data.EXTENSIONS.checkExtension('yaml', [ mediaTypeYaml, mediaTypeHtml ]);

    assert.equal(isValid, true);
  });


  it('should reject the doc type', function () {

    var isValid = data.EXTENSIONS.checkExtension('doc', [ mediaTypeJson ]);

    assert.equal(isValid, false);
  });

  it('should reject the xml type when json is wanted', function () {

    var isValid = data.EXTENSIONS.checkExtension('xml', [ mediaTypeJson ]);

    assert.equal(isValid, false);
  });

  it('should reject the xml type when json or yaml is wanted', function () {

    var isValid = data.EXTENSIONS.checkExtension('xml', [ mediaTypeJson, mediaTypeYaml ]);

    assert.equal(isValid, false);
  });

});


