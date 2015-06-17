var path = require('path');
var browserify = require('browserify');
var exorcist = require('exorcist');
var mapfile = path.join(__dirname, 'bundle.js.map');

var b = browserify({
  debug: true});
b.add('lib/client.js');
b.external('lodash');

b.bundle()
 .pipe(exorcist(mapfile))
 .pipe(process.stdout);