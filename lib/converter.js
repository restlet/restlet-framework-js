'use strict';

var xml2js = require('xml2js');
var jsyaml = require('js-yaml');
var _ = require('lodash');
var debugConverter = require('debug')('converter');

exports = module.exports;

var converter = exports;

var converters = [];

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

// Converter json

converters.push({
  name: 'json',
  apply: function(mediaTypes) {
    return checkMediaTypes(mediaTypes, [ 'application/json' ]);
  },

  toObject: function(string, callback) {
    if (!_.isEmpty(string)) {
      try {
        callback(null, JSON.parse(string));
      } catch(err) {
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

// Converter xml (see https://github.com/Leonidas-from-XIV/node-xml2js)

var xmlBuilder = new xml2js.Builder({
  renderOpts: { pretty: true, indent: ' ', newline: '\n' },
  headless: true
});

converters.push({
  name: 'xml2js',
  apply: function(mediaTypes) {
    return checkMediaTypes(mediaTypes, [ 'application/xml', 'text/xml' ]);
  },

  toObject: function(string, callback) {
    if (!_.isEmpty(string)) {
      xml2js.parseString(string, function(err, result) {
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

  toString: function(obj, callback) {
    callback(null, xmlBuilder.buildObject(obj), { name: 'application/xml' });
  }
});

// Converter yaml (see https://github.com/nodeca/js-yaml)

converters.push({
  name: 'js-yaml',
  apply: function(mediaTypes) {
    return checkMediaTypes(mediaTypes, [ 'application/yaml', ' text/yaml' ]);
  },

  toObject: function(string, callback) {
    if (!_.isEmpty(string)) {
      try {
        callback(null, jsyaml.safeLoad(string));
      } catch(err) {
        callback(err, null);
      }
    } else {
      callback(null, null);
    }
  },

  toString: function(obj, callback) {
    callback(null, jsyaml.safeDump(obj), { name: 'application/yaml' });
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
    debugConverter('No media types specified. Choose the first converter');
    var converter = converters[0];
    if (converter == null) {
      debugConverter('No converter found');
    } else {
      debugConverter('Converter ' + converter.name + ' found');
    }
    return converter;
  }

  // Find out which converters can apply
  var filteredConverters = _.filter(converters, function(converter) {
    return converter.apply(mediaTypes);
  });

  // If no converter can be found
  if (_.isEmpty(filteredConverters)) {
    debugConverter('No converter can be found for media types ' + JSON.stringify(mediaTypes));
    return;
  }

  // Return the first matching converter
    var converter = filteredConverters[0];
    debugConverter('Converter ' + converter.name + ' found');
    return converter;
}