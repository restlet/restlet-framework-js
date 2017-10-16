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

var fs = require('fs');
var packageJson = require('../package.json');
var docCommon = require('./generate-reference-common-doc');

fs.readFile('docs/doc-server.json', 'utf8', function(err, data) {
  if (err) {
    throw err;
  }
  var docContent = JSON.parse(data);

  var mardownDocContent = [];

  mardownDocContent.push('# Client side support - API documentation');
  mardownDocContent.push('');
  mardownDocContent.push('__Restlet JS for Node__');
  mardownDocContent.push('');
  mardownDocContent.push('__Version ' + packageJson.version + '__');
  mardownDocContent.push('');
  mardownDocContent.push('<!-- START doctoc -->');
  mardownDocContent.push('<!-- END doctoc -->');
  mardownDocContent.push('');

  // Core elements

  mardownDocContent.push('');
  mardownDocContent.push('## Core elements');
  mardownDocContent.push('');

  // Client resource
  docCommon.generateElementDocMarkdown(mardownDocContent,
    docContent, 'clientresource', 'Client resource');

  // Data objects

  mardownDocContent.push('');
  mardownDocContent.push('## Data objects');
  mardownDocContent.push('');

  // Request
  docCommon.generateElementDocMarkdown(mardownDocContent,
    docContent, 'request', 'Request');
  // Reference
  docCommon.generateElementDocMarkdown(mardownDocContent,
    docContent, 'reference', 'Reference');
  // Response
  docCommon.generateElementDocMarkdown(mardownDocContent,
    docContent, 'response', 'Response');


  docCommon.writeDocFile('docs/references/doc-client-'
    + packageJson.version + '.md', mardownDocContent);
});
