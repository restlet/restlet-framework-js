'use strict';

var _ = require('lodash');
var moment = require('moment');

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
