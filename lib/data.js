'use strict';

var _ = require('lodash');
var moment = require('moment');
var debugMediaType = require('debug')('mediatype');

exports = module.exports;

var data = exports;

data.ENCODINGS = {
  '*': 'All encodings',
  compress: 'Common Unix compression',
  deflate: 'Deflate compression using the zlib format',
  'deflate-no-wrap':
    'Deflate compression using the zlib format (without wrapping)',
  gzip: 'GZip compression',
  identity: 'The default encoding with no transformation',
  zip: 'Zip compression'
};

data.EXTENSIONS = {
  'json': [ 'application/json' ],
  'xml': [ 'text/xml', 'application/xml' ],
  'yaml': [ 'text/yaml', 'application/yaml' ],
  checkExtension: function(extension, mediaTypes) {
    var configuredMediaTypes = data.EXTENSIONS[extension];
    if (configuredMediaTypes == null) {
      debugMediaType('Extension ' + extension + ' not a predefined one');
      return false;
    } else {
      var configuredMediaType = _.find(configuredMediaTypes,
      	            function(configuredMediaType) {
      	var mediaType = _.find(mediaTypes, function(mediaType) {
      	  return (configuredMediaType === mediaType.name);
      	});
      });
      var match = (configuredMediaType != null);
      if (match) {
      	debugMediaType('Media type ' + configuredMediaType
      		+ ' match for extension ' + extension);
      } else {
      	debugMediaType('No media type match for extension '
      		+ extension);
      }
      return match;
    }
  }
}