'use strict';

var _ = require('lodash');
var debugConverter = require('debug')('converter');
var builtinConverters = require('./builtin-converters');

exports = module.exports;

var converter = exports;

var converters = [];

// Register builtin converters

converters = _.cloneDeep(builtinConverters);

// Make built-in converters available

converter.builtinConverters = function () {
  return converters;
};

converter.clearBuiltinConverters = function () {
  _.drop(converters, converters.length);
};

converter.getBuiltinConverter = function (name) {

  var converter = _(converters)
    .filter({ name: name })
    .first();

  if (!_.isEmpty(converter)) {
    return converter;
  }

  return null;
};

converter.findConverter = function (mediaTypes) {
  // Check if the parameter is an array. If not wrap
  // the parameter into an array
  if (!_.isNull(mediaTypes) && !_.isArray(mediaTypes)) {
    mediaTypes = [ mediaTypes ];
  }

  // If no media type is specified, use the first one
  // in the list
  if (_.isNull(mediaTypes)) {

    debugConverter('No media types specified. Choose the first converter');

    var converter = _.first(converters);

    if (_.isNull(converter)) {
      debugConverter('No converter found');
    } else {
      debugConverter('Converter %s found', converter.name);
    }

    return converter;
  }

  // Find out which converters can apply
  var filteredConverters = _.filter(converters, function (converter) {
    return converter.apply(mediaTypes);
  });

  // If no converter can be found
  if (_.isEmpty(filteredConverters)) {
    debugConverter('No converter can be found for media types '
      + JSON.stringify(mediaTypes));
    return;
  }

  // Return the first matching converter
  var firstConverter = filteredConverters[ 0 ];
  debugConverter('Converter ' + firstConverter.name + ' found');
  return firstConverter;
};