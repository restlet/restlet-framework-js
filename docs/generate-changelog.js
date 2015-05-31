var fs = require('fs');
var changelog = require('conventional-changelog');

console.log('version = '+require('../package.json').version);

changelog({
  repository: 'https://github.com/restlet/restlet-framework-js',
  version: require('../package.json').version
}, function(err, log) {
  if (err) console.log('err = '+err);
  console.log('Here is your changelog!', log);

  fs.writeFile('./CHANGELOG.md.tmp', log, function(err) {
    if (err) console.log('write file - err = '+err);
    console.log('Updated changelog file!');
  });
});