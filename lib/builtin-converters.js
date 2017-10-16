/*
 * Copyright 2005-2017 Restlet
 *
 * The contents of this file are subject to the terms of one of the following
 * open source licenses: Apache 2.0 or or EPL 1.0 (the "Licenses"). You can
 * select the license that you prefer but you may not use this file except in
 * compliance with one of these Licenses.
 *
 * You can obtain a copy of the Apache 2.0 license at
 * http://www.opensource.org/licenses/apache-2.0
 *
 * You can obtain a copy of the EPL 1.0 license at
 * http://www.opensource.org/licenses/eclipse-1.0
 *
 * See the Licenses for the specific language governing permissions and
 * limitations under the Licenses.
 *
 * Alternatively, you can obtain a royalty free commercial license with less
 * limitations, transferable or non-transferable, directly at
 * http://restlet.com/products/restlet-framework
 *
 * Restlet is a registered trademark of Restlet S.A.S.
 */

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
