'use strict';

var xml2js = require('xml2js');

exports = module.exports;

var converter = exports;

var converters = [];

// Convert xml2js (see https://github.com/Leonidas-from-XIV/node-xml2js)

var xmlBuilder = new xml2js.Builder({
  renderOpts: { pretty: true, indent: ' ', newline: '\n' },
  headless: true
});

converters.push({
  apply: function(extension) {
    return (extension == 'xml');
  },

  toObject: function(string, callback) {
    xml2js.parseString(string, function(err, result) {
      callback(result);
    });
  },

  toString: function(obj, callback) {
    callback(xmlBuilder.buildObject(obj));
  }
});

// Convert json

converters.push({
  apply: function(extension) {
    return (extension == 'json');
  },

  toObject: function(string, callback) {
    callback(JSON.parse(string));
  },

  toString: function(obj, callback) {
    callback(JSON.stringify(obj));
  }
});

// Make built-in converters available

converter.builtinConverters = function() {
  return converters;
};

