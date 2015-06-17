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

  mardownDocContent.push('# Server side support - API documentation');
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

  // Component
  docCommon.generateElementDocMarkdown(mardownDocContent,
    docContent, 'component', 'Component');
  // Virtual host
  docCommon.generateElementDocMarkdown(mardownDocContent,
    docContent, 'virtualhost', 'Virtual host');
  // Application
  docCommon.generateElementDocMarkdown(mardownDocContent,
    docContent, 'application', 'Application');
  // Router
  docCommon.generateElementDocMarkdown(mardownDocContent,
    docContent, 'router', 'Router');
  // Restlet
  docCommon.generateElementDocMarkdown(mardownDocContent,
    docContent, 'restlet', 'Restlet');
  // Filter
  docCommon.generateElementDocMarkdown(mardownDocContent,
    docContent, 'filter', 'Filter');
  // Server resource
  docCommon.generateElementDocMarkdown(mardownDocContent,
    docContent, 'serverresource', 'Server resource');
  // Directory
  docCommon.generateElementDocMarkdown(mardownDocContent,
    docContent, 'directory', 'Directory');

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


  docCommon.writeDocFile('docs/references/doc-server-'
    + packageJson.version + '.md', mardownDocContent);
});