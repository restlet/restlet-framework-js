'use strict';

var _ = require('lodash');

function checkMediaTypes(mediaTypes, supportedMediaTypes) {
  var match = false;
  _.forEach(mediaTypes, function(mediaType) {
    _.forEach(supportedMediaTypes, function(supportedMediaType) {
      if (mediaType.name == supportedMediaType) {
        match = true;
      }
    });
  });
  return match;
}

var converters = [];

converters.push({
  name: 'json',
  apply: function(mediaTypes) {
    return checkMediaTypes(mediaTypes, [ 'application/json' ]);
  },

  toObject: function(string, callback) {
    if (!_.isEmpty(string)) {
      try {
        callback(null, JSON.parse(string));
      } catch (err) {
        callback(err, null);
      }
    } else {
      callback(null, null);
    }
  },

  toString: function(obj, callback) {
    callback(null, JSON.stringify(obj), { name: 'application/json' });
  }
});

module.exports = converters;