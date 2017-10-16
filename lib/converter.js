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
