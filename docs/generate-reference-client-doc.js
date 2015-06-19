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