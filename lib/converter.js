'use strict';

var xml2js = require('xml2js');
var _ = require('lodash');

exports = module.exports;

var converter = exports;

var converters = [];

// Convert json

converters.push({
  name: 'json',
  apply: function(mediaType) {
    return (mediaType == 'application/json');
  },

  toObject: function(string, callback) {
    callback(JSON.parse(string));
  },

  toString: function(obj, callback) {
    callback(JSON.stringify(obj));
  }
});

// Convert xml2js (see https://github.com/Leonidas-from-XIV/node-xml2js)

var xmlBuilder = new xml2js.Builder({
  renderOpts: { pretty: true, indent: ' ', newline: '\n' },
  headless: true
});

converters.push({
  name: 'xml2js',
  apply: function(mediaType) {
    return (mediaType == 'application/json');
  },

  toObject: function(string, callback) {
    xml2js.parseString(string, function(err, result) {
      callback(result.root);
    });
  },

  toString: function(obj, callback) {
    callback(xmlBuilder.buildObject(obj));
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