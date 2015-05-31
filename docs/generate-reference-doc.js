'use strict';

var _ = require('lodash');
var fs = require('fs');
var packageJson = require('../package.json');

function getElementDocs(docContent, elementName) {
  var elementDocContent = docContent.filter(function(docElement) {
    var isElement = false;
    _.forEach(docElement.tags, function(tag) {
      if (tag.type == elementName) {
        isElement = true;
      }
    });
    return isElement;
  });
  return elementDocContent;
}

function createParamList(methodDocContent) {
  var paramList = [];
  _.forEach(methodDocContent.tags, function(tag) {
  	if (tag.type == 'param') {
      if (!_.isEmpty(paramList)) {
        paramList.push(', ');
      }
      paramList.push(tag.name);
    }
  });
  return paramList.join('');
}

function fillParamTable(methodDocContent, mardownDocContent) {
  _.forEach(methodDocContent.tags, function(tag) {
  	if (tag.type == 'param') {
      var paramLine = '| ';
      var name = tag.name;
      console.log('>> name = '+name);
      if (name.indexOf('|') != -1) {
        name = name.split('|').join(' or ');
      }
      paramLine += name;
      paramLine += ' | ';
      var types = '';
      _.forEach(tag.types, function(type) {
        if (!_.isEmpty(types)) {
          types += ' or ';
        }
        types += type;
      });
      paramLine += types;
      paramLine += ' | ';
      paramLine += tag.description;
      paramLine += ' |';
      mardownDocContent.push(paramLine);
    }
  });
}

function hasArguments(methodDocContent) {
  var hasArguments = false;
  _.forEach(methodDocContent.tags, function(tag) {
  	if (tag.type == 'param') {
      hasArguments = true;
    }
  });
  return hasArguments;
}

function createArgumentsTable(methodDocContent, mardownDocContent) {
  if (hasArguments(methodDocContent)) {
    mardownDocContent.push('');
    mardownDocContent.push('| Argument | Type | Description |');
    mardownDocContent.push('| -------- | ---- | ----------- |');
    fillParamTable(methodDocContent, mardownDocContent);
  }
}

function createElementConstructorDocMarkdown(mardownDocContent, constructorDocContent) {
  mardownDocContent.push('');
  mardownDocContent.push('__`restlet.' + constructorDocContent.ctx.name + '`__');
  mardownDocContent.push('');
  mardownDocContent.push(_.trim(constructorDocContent.description.summary));

  createArgumentsTable(constructorDocContent, mardownDocContent);

  if (!_.isEmpty(constructorDocContent.description.body)) {
    mardownDocContent.push('');
    mardownDocContent.push(_.trim(constructorDocContent.description.body));
  }
}

function createElementMethodDocMarkdown(mardownDocContent, methodDocContent) {
  mardownDocContent.push('');
  mardownDocContent.push('### Method ' + methodDocContent.ctx.name + '(' + createParamList(methodDocContent) + ')');
  mardownDocContent.push('');
  mardownDocContent.push(_.trim(methodDocContent.description.summary));

  createArgumentsTable(methodDocContent, mardownDocContent);

  if (!_.isEmpty(methodDocContent.description.body)) {
    mardownDocContent.push('');
    mardownDocContent.push(_.trim(methodDocContent.description.body));
  }
}

function formatDescriptionSummaryForTable(summary) {
  var formattedSummary = summary.replace(/\n/g, ' ');
  return _.trim(formattedSummary);
}

function fillMethodsTable(methodsDocContent, mardownDocContent) {
  _.forEach(methodsDocContent, function(methodDocContent) {
  	if (!methodsDocContent.isConstructor) {
      var methodLine = '| ';
      methodLine += methodDocContent.ctx.name;
      methodLine += ' | ';
      methodLine += formatDescriptionSummaryForTable(methodDocContent.description.summary);
      methodLine += ' |';
      mardownDocContent.push(methodLine);
    }
  });
}

function hasMethods(methodsDocContent) {
  var hasMethods = false;
  _.forEach(methodsDocContent, function(methodDocContent) {
  	if (!methodsDocContent.isConstructor) {
      hasMethods = true;
    }
  });
  return hasMethods;
}

function createMethodsTable(methodsDocContent, mardownDocContent) {
  mardownDocContent.push('');
  mardownDocContent.push('| Method | Description |');
  mardownDocContent.push('| ------ | ----------- |');
  fillMethodsTable(methodsDocContent, mardownDocContent);
}

function createElementMethodsSummary(mardownDocContent, methodsDocContent) {
  if (hasMethods(methodsDocContent)) {
    mardownDocContent.push('');
    mardownDocContent.push('__Methods__');
    createMethodsTable(methodsDocContent, mardownDocContent);
  }
}

function createElementDocMarkdown(mardownDocContent, elementDocs, elementDescription) {
  if (elementDocs == null) {
  	return;
  }

  mardownDocContent.push('');

  mardownDocContent.push('## ' + elementDescription);

  var constructorDocContent = elementDocs.filter(function(elementDoc) {
    return elementDoc.isConstructor;
  });

  if (constructorDocContent !=null && !_.isEmpty(constructorDocContent)) {
    createElementConstructorDocMarkdown(mardownDocContent, constructorDocContent[0]);
  }

  var methodsDocContent = elementDocs.filter(function(elementDoc) {
    return !elementDoc.isConstructor;
  });

  createElementMethodsSummary(mardownDocContent, methodsDocContent);

  _.forEach(methodsDocContent, function(methodDocContent) {
  	createElementMethodDocMarkdown(mardownDocContent, methodDocContent);
  })
}

function writeDocFile(filename, mardownDocContent) {
  fs.writeFile(filename, mardownDocContent.join('\n'), function (err) {
    if (err) throw err;
    console.log('Doc file ' + filename + ' written');
  });
}

function generateElementDocMarkdown(mardownDocContent, docContent, elementName, elementDescription) {
  var elementDoc = getElementDocs(docContent, elementName);
  console.log('Creating documentation for ' + elementName + '...');
  if (elementDoc != null && !_.isEmpty(elementDoc)) {
    createElementDocMarkdown(mardownDocContent, elementDoc, elementDescription);
    console.log('  -> ok');
  } else {
    console.log('  -> no doc elements found');
  }
}

fs.readFile('docs/doc-server.json', 'utf8', function (err, data) {
  if (err) throw err;
  var docContent = JSON.parse(data);

  var mardownDocContent = [];

  mardownDocContent.push('# Server side support - API documentation')
  mardownDocContent.push('');
  mardownDocContent.push('__Restlet JS for Node__');
  mardownDocContent.push('');
  mardownDocContent.push('__Version ' + packageJson.version + '__');
  mardownDocContent.push('');
  mardownDocContent.push('<!-- START doctoc -->');
  mardownDocContent.push('<!-- END doctoc -->');
  mardownDocContent.push('');

  // Component
  generateElementDocMarkdown(mardownDocContent, docContent, 'component', 'Component');
  // Virtual host
  generateElementDocMarkdown(mardownDocContent, docContent, 'virtualhost', 'Virtual host');
  // Application
  generateElementDocMarkdown(mardownDocContent, docContent, 'application', 'Application');
  // Router
  generateElementDocMarkdown(mardownDocContent, docContent, 'router', 'Router');
  // Restlet
  generateElementDocMarkdown(mardownDocContent, docContent, 'restlet', 'Restlet');
  // Filter
  generateElementDocMarkdown(mardownDocContent, docContent, 'filter', 'Filter');
  // Server resource
  generateElementDocMarkdown(mardownDocContent, docContent, 'serverresource', 'Server resource');
  // Directory
  generateElementDocMarkdown(mardownDocContent, docContent, 'directory', 'Directory');

  writeDocFile('docs/references/doc-server-' + packageJson.version + '.md', mardownDocContent);
});