'use strict';

var _ = require('lodash');
var debugConverter = require('debug')('converter');

exports = module.exports;

var converter = exports;

var converters = [];

// Register builtin converters

var builtinConverters = require('./builtin-converters');
_.forEach(builtinConverters, function (builtinConverter) {
  converters.push(builtinConverter);
});

// Make built-in converters available

converter.builtinConverters = function() {
  return converters;
};

converter.clearBuiltinConverters = function() {
  _.drop(converters, converters.length);
};

converter.getBuiltinConverter = function(name) {
  var subList = _.filter(converters, function(converter) {
    if (converter.name == name) {
      return converter;
    }
  });

  if (subList.length > 0) {
    return subList[0];
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