var path = require('path');
var browserify = require('browserify');
var moduleify = require('moduleify');
var exorcist = require('exorcist');
var mapfile = path.join(__dirname, 'bundle.js.map');

var b = browserify({
  debug: true});
b.add('lib/client.js');
b.external('lodash');
//b.external('xml2js');
//b.external('js-yaml');
//b.external('moment');
//b.external('debug');

b.bundle()

 .pipe(exorcist(mapfile))
 .pipe(process.stdout);