'use strict';

var xml2js = require('xml2js');
var jsyaml = require('js-yaml');
var _ = require('lodash');

function checkMediaTypes (mediaTypes, supportedMediaTypes) {

  var matchedTypes = _(mediaTypes)
    .pluck('name')
    .intersection(supportedMediaTypes)
    .value();

  return !_.isEmpty(matchedTypes);
}

var converters = [];

converters.push({
  name: 'json',
  apply: function (mediaTypes) {
    return checkMediaTypes(mediaTypes, [ 'application/json' ]);
  },

  toObject: function (string, callback) {
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

  toString: function (obj, callback) {
    callback(null, JSON.stringify(obj), { name: 'application/json' });
  }
});

// Converter xml (see https://github.com/Leonidas-from-XIV/node-xml2js)

var xmlBuilder = new xml2js.Builder({
  renderOpts: { pretty: true, indent: ' ', newline: '\n' },
  headless: true
});

converters.push({
  name: 'xml2js',
  apply: function (mediaTypes) {
    return checkMediaTypes(mediaTypes, [ 'application/xml', 'text/xml' ]);
  },

  toObject: function (string, callback) {
    if (!_.isEmpty(string)) {
      xml2js.parseString(string, function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result.root);
        }
      });
    } else {
      callback(null, null);
    }
  },

  toString: function (obj, callback) {
    callback(null, xmlBuilder.buildObject(obj), { name: 'application/xml' });
  }
});

// Converter yaml (see https://github.com/nodeca/js-yaml)

converters.push({
  name: 'js-yaml',
  apply: function (mediaTypes) {
    return checkMediaTypes(mediaTypes, [ 'application/yaml', ' text/yaml' ]);
  },

  toObject: function (string, callback) {
    if (!_.isEmpty(string)) {
      try {
        callback(null, jsyaml.safeLoad(string));
      } catch (err) {
        callback(err, null);
      }
    } else {
      callback(null, null);
    }
  },

  toString: function (obj, callback) {
    callback(null, jsyaml.safeDump(obj), { name: 'application/yaml' });
  }
});

module.exports = converters;