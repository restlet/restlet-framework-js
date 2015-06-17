'use strict';

var fs = require('fs');
var changelog = require('conventional-changelog');
var currentPackage = require('../package.json');

console.log('Current version is ' + currentPackage.version);

changelog({
  repository: 'https://github.com/restlet/restlet-framework-js',
  version: currentPackage.version
}, function(err, log) {
  if (err) {
    console.log('err = ' + err);
  }
  console.log('Here is your changelog!', log);

  fs.writeFile('./CHANGELOG.md.tmp', log, function(err) {
    if (err) {
      console.log('write file - err = ' + err);
    }
    console.log('Updated changelog file!');
  });
});