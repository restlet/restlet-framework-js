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


