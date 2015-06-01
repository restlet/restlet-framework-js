'use strict';

var xml2js = require('xml2js');
var _ = require('lodash');

exports = module.exports;

var converter = exports;

var converters = [];

function checkMediaTypes(mediaTypes, supportedMediaType) {
    var match = false;
    _.forEach(mediaTypes, function(mediaType) {
      if (mediaType.name == supportedMediaType) {
        match = true;
      }
    });
    return match;
}

// Convert json

converters.push({
  name: 'json',
  apply: function(mediaTypes) {
    return checkMediaTypes(mediaTypes, 'application/json');
  },

  toObject: function(string, callback) {
    callback(null, JSON.parse(string));
  },

  toString: function(obj, callback) {
    callback(null, JSON.stringify(obj), 'application/json');
  }
});

// Convert xml2js (see https://github.com/Leonidas-from-XIV/node-xml2js)

var xmlBuilder = new xml2js.Builder({
  renderOpts: { pretty: true, indent: ' ', newline: '\n' },
  headless: true
});

converters.push({
  name: 'xml2js',
  apply: function(mediaTypes) {
    return checkMediaTypes(mediaTypes, 'application/xml');
  },

  toObject: function(string, callback) {
    xml2js.parseString(string, function(err, result) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result.root);
      }
    });
  },

  toString: function(obj, callback) {
    callback(null, xmlBuilder.buildObject(obj), 'application/xml');
  }
});

// Make built-in converters available

converter.builtinConverters = function() {
  return converters;
};

converter.getBuiltinConverter = function(name) {
  var subList = _.filter(converters, function(converter) {
    if (converter.name == name) {
      return converter;
    }
  });

  if (subList.length == 1) {
    return subList[0];
  } else if (subList > 1) {
    return subList;
  } else {
    return null;
  }
};

converter.findConverter = function(mediaTypes) {
  // Check if the parameter is an array. If not wrap
  // the parameter into an array
  if (mediaTypes !=null && !_.isArray(mediaTypes)) {
    mediaTypes = [ mediaTypes ];
  }

  // If no media type is specified, use the first one
  // in the list
  if (mediaTypes == null) {
    return converters[0];
  }

  // Find out which converters can apply
  var filteredConverters = _.filter(converters, function(converter) {
    return converter.apply(mediaTypes);
  });

  // If no converter can be found
  if (_.isEmpty(filteredConverters)) {
    return;
  }

  // Return the first matching converter
  return filteredConverters[0];
}