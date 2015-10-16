'use strict';

/**
 * Module dependencies.
 * @api private
 */

var _ = require('lodash');
var data = require('./data');
var transport = require('./client-transport');
var clientUtils = require('./client-utils');
var converterApi = require('./converter');
var debugClientResource = require('debug')('resource');
var debugHttp = require('debug')('http');

exports = module.exports;

var client = exports;

function isReadMethod (method) {

  var methods = [
    'GET',
    'DELETE',
    'HEAD',
    'OPTIONS'
  ];

  return _.contains(methods, method);
}

function extractArgumentsForClientResourceReadHandle () {

  var entity = null;
  var configuration = null;
  var handle = null;

  if (arguments.length == 1) {
    configuration = {};
    handle = _.first(arguments);
  } else if (arguments.length == 2) {
    configuration = _.first(arguments);
    handle = arguments[ 1 ];
  } else if (arguments.length == 3) {
    entity = _.first(arguments);
    configuration = arguments[ 1 ];
    handle = arguments[ 2 ];
  }

  return {
    entity: entity,
    configuration: configuration,
    handle: handle
  };
}

function extractArgumentsForClientResourceReadWriteHandle () {

  var entity = null;
  var configuration = null;
  var handle = null;

  if (arguments.length == 1) {
    configuration = {};
    handle = arguments[ 0 ];
  } else if (arguments.length == 2) {
    entity = arguments[ 0 ];
    configuration = {};
    handle = arguments[ 1 ];
  } else if (arguments.length == 3) {
    entity = arguments[ 0 ];
    configuration = arguments[ 1 ];
    handle = arguments[ 2 ];
  }

  return {
    entity: entity,
    configuration: configuration,
    handle: handle
  };
}

function isBinaryMediaType (mediaType) {
  if (mediaType != null) {
    // Check if the media type is a text one
    return !((/text\/[a-z*]*/g).test(mediaType)
    || (/application\/(xml)*/g).test(mediaType)
    || (/application\/(json)*/g).test(mediaType)
    || (/application\/(javascript)*/g).test(mediaType)
    || (/application\/(atom)*/g).test(mediaType)
    || (/application\/(ya?ml)*/g).test(mediaType)
    || (/application\/(smile)*/g).test(mediaType));
  }

  // By default, use data as binary
  return true;
}

function isBinaryContent (res) {
  return !_.isNull(res.entity)
    && isBinaryMediaType(res.entity.mediaType.name);
}

function hasContent (res) {
  return res.status.code !== 204
    && _.isNull(res.entity)
    && res.entity.mediaType;
}

function handleResponse (req, res, configuration, handler) {

  if (hasContent(res)) {
    var isBinary = isBinaryContent(res);

    var allData = (isBinary) ? [] : '';

    // Register listener to receive data
    res.entity.on('data', function (data) {
      debugHttp('Received data');
      if (isBinary) {
        allData.push(data);
      } else {
        allData += data;
      }
    });

    res.entity.on('error', function (err) {
      console.log('>> err = ' + err);
    });

    // Register listener to detect when all allData are received
    res.entity.on('end', function () {
      debugHttp('Ended response');

      if (isBinary) {
        res.entity.raw = Buffer.concat(allData);
      } else {
        res.entity.text = allData;
      }

      // Create parameters
      var parameters = createParameters(
        configuration, req, res);

      // Check if there is an error
      if (res.status.isError()) {
        return;
      }

      // Call the handler
      handler.apply(null, parameters);
    });
  } else {
    // Create parameters
    var parameters = createParameters(
      configuration, req, res);

    // Call the handler
    handler.apply(null, parameters);
  }
}

function extractName (expression) {
  var name = expression.match(/\"(.*)\"/g);
  name = name.toString();
  return name.substr(1, name.length - 2);
}

function convertInputEntity (entity, request, response) {
  var convertedObj = null;
  var mediaType = response.entity.mediaType;

  debugClientResource('Converting input text to object');

  // Check if the media type is present in the request
  if (_.isEmpty(mediaType)) {
    clientUtils.setNotSupportedMediaTypeInResponse(response);
    return;
  }

  debugClientResource('Received media type %s', response.entity.mediaType.name);

  // Get the converter that matches the accepted
  // media types
  var converter = converterApi.findConverter(mediaType);

  // Check if a converter was found to converter the entity
  if (_.isNull(converter)) {
    clientUtils.setNotSupportedMediaTypeInResponse(response);
    return;
  }

  // Use the converter to convert payload to object
  converter.toObject(entity.text, function (err, obj) {
    // Handle error
    if (err) {
      clientUtils.setNotSupportedMediaTypeInResponse(response);
    }

    convertedObj = obj;
  });

  return convertedObj;
}

function convertOutputEntity (request, obj, mediaType) {
  debugClientResource('Converting output object to text');

  // Check if the media type is present in the request
  if (_.isEmpty(mediaType)) {
    clientUtils.setNotSupportedMediaTypeInResponse(response);
    return;
  }

  debugClientResource('Configured media type %s', mediaType);

  // Get the converter that matches the accepted
  // media types
  var converter = converterApi.findConverter(
    new data.MediaType(mediaType));

  // Check if a converter was found to converter the entity
  if (_.isNull(converter)) {
    clientUtils.setNotSupportedMediaTypeInResponse(response);
    return;
  }

  // Use the converter to convert payload to object
  converter.toString(obj, function (err, string) {
    // Handle error
    if (err) {
      clientUtils.setNotSupportedMediaTypeInResponse(response);
      return;
    }

    request.entity = clientUtils.createRepresentation(string, mediaType);
  });
}

function createParameters (configuration, request, response) {

  if (_.isNull(configuration.parameters)) {
    return [ request, response ];
  }

  var httpFlow = {
    request: request,
    response: response
  }

  var parameters = [];

  _.forEach(configuration.parameters, function (parameterName) {

    if (_.contains([ 'request', 'response' ], parameterName)) {
      parameters.push(httpFlow[ parameterName ]);

    } else if (parameterName === 'entity') {

      var entity = response.entity;

      if (configuration.convertInputEntity) {
        entity = convertInputEntity(entity, request, response);
      }

      parameters.push(entity);

    } else if (_.contains([ 'clientInfo', 'reference' ], parameterName)) {
      parameters.push(request[ parameterName ])
    }

  });

  return parameters;
}

/**
 * Create a client resource.
 *
 * Restlet allows to create a client resource for a specific URL:
 *
 *     var clientResource = restlet.createClientResource(
 *                                    'http://myurl');
 *
 * You can then execute a request for a specific HTTP method:
 *
 *     restlet.createClientResource('http://myurl')
 *         .get(function(request, response) {
 *             (...)
 *         });
 *
 * @param {String} url the url to reach the resource
 * @constructor
 * @clientresource
 * @api public
 */
client.createClientResource = function (url) {
  return {
    /**
     * The entry point for server resource.
     *
     * Notice that this method shouldn't be called explicitly since it
     * involves within the request processing chain.
     *
     * @param {Object} [configuration] the configuration object
     * @param {(Function|Object)} handler the processing element for
     * the response
     * @clientresource
     * @method
     * @api private
     */
    handle: function () {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceReadWriteHandle.apply(
        null, arguments);

      // Create request from configuration
      var request = clientUtils.createRequest(
        url, parameters.configuration, parameters.entity);

      // Send data if necessary
      if (parameters.entity != null) {
        if (parameters.configuration.convertOutputEntity) {
          request.entity = {};
          convertOutputEntity(request, parameters.entity,
            parameters.configuration.mediaType);
        } else {
          request.entity = parameters.entity;
        }
      }

      // Check if there is an error
      // if (response)

      // Execute the request
      var client = transport.createClient(request, function (response) {
        handleResponse(request, response,
          parameters.configuration, parameters.handle);
      });

      client.on('error', function (err) {
        console.log('>> err = ' + err);
      });

      // Actually send the entity
      if (request.entity != null) {
        if (request.entity.text != null) {
          client.write(request.entity.text);
        } else if (request.entity.raw != null) {
          client.write(request.entity.raw);
        }
      }

      // Mark the request as finished
      debugHttp('Ending HTTP request');
      client.end();
    },

    /**
     * Execute a GET request.
     *
     * This method is a shortcut for the method `handler` with the following
     * configuration:
     *
     *     restlet.createClientResource('http://myurl')
     *         .handle({ method: 'GET' }, function(request, response) {
     *             (...)
     *         });
     *
     * @param {Object} [configuration] the configuration object
     * @param {(Function|Object)} handler the processing element for
     * the response
     * @clientresource
     * @method
     * @api public
     */
    get: function () {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceReadHandle.apply(
        null, arguments);
      parameters.configuration.method = 'GET';

      // Handle the request
      this.handle(parameters.entity,
        parameters.configuration, parameters.handle);

      // Allow chaining
      return this;
    },

    /**
     * Execute a POST request.
     *
     * This method is a shortcut for the method `handler` with the following
     * configuration:
     *
     *     restlet.createClientResource('http://myurl')
     *         .handle({ method: 'POST' }, function(request, response) {
     *             (...)
     *         });
     *
     * @param {Object} [configuration] the configuration object
     * @param {(Function|Object)} handler the processing element for
     * the response
     * @clientresource
     * @method
     * @api public
     */
    post: function () {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceReadWriteHandle.apply(
        null, arguments);
      parameters.configuration.method = 'POST';

      // Handle the request
      this.handle(parameters.entity,
        parameters.configuration, parameters.handle);

      // Allow chaining
      return this;
    },

    /**
     * Execute a PUT request.
     *
     * This method is a shortcut for the method `handler` with the following
     * configuration:
     *
     *     restlet.createClientResource('http://myurl')
     *         .handle({ method: 'PUT' }, function(request, response) {
     *             (...)
     *         });
     *
     * @param {Object} [configuration] the configuration object
     * @param {(Function|Object)} handler the processing element for
     * the response
     * @clientresource
     * @method
     * @api public
     */
    put: function () {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceReadWriteHandle.apply(
        null, arguments);
      parameters.configuration.method = 'PUT';

      // Handle the request
      this.handle(parameters.entity,
        parameters.configuration, parameters.handle);

      // Allow chaining
      return this;
    },

    /**
     * Execute a PATCH request.
     *
     * This method is a shortcut for the method `handler` with the following
     * configuration:
     *
     *     restlet.createClientResource('http://myurl')
     *         .handle({ method: 'PATCH' }, function(request, response) {
     *             (...)
     *         });
     *
     * @param {Object} [configuration] the configuration object
     * @param {(Function|Object)} handler the processing element for
     * the response
     * @clientresource
     * @method
     * @api public
     */
    patch: function () {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceReadWriteHandle.apply(
        null, arguments);
      parameters.configuration.method = 'PATCH';

      // Handle the request
      this.handle(parameters.entity,
        parameters.configuration, parameters.handle);

      // Allow chaining
      return this;
    },

    /**
     * Execute a DELETE request.
     *
     * This method is a shortcut for the method `handler` with the following
     * configuration:
     *
     *     restlet.createClientResource('http://myurl')
     *         .handle({ method: 'DELETE' }, function(request, response) {
     *             (...)
     *         });
     *
     * @param {Object} [configuration] the configuration object
     * @param {(Function|Object)} handler the processing element for
     * the response
     * @clientresource
     * @method
     * @api public
     */
    delete: function () {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceReadHandle.apply(
        null, arguments);
      parameters.configuration.method = 'DELETE';

      // Handle the request
      this.handle(parameters.entity,
        parameters.configuration, parameters.handle);

      // Allow chaining
      return this;
    },

    /**
     * Execute a HEAD request.
     *
     * This method is a shortcut for the method `handler` with the following
     * configuration:
     *
     *     restlet.createClientResource('http://myurl')
     *         .handle({ method: 'HEAD' }, function(request, response) {
     *             (...)
     *         });
     *
     * @param {Object} [configuration] the configuration object
     * @param {(Function|Object)} handler the processing element for
     * the response
     * @clientresource
     * @method
     * @api public
     */
    head: function () {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceReadHandle.apply(
        null, arguments);
      parameters.configuration.method = 'HEAD';

      // Handle the request
      this.handle(parameters.entity,
        parameters.configuration, parameters.handle);

      // Allow chaining
      return this;
    },

    /**
     * Execute a OPTIONS request.
     *
     * This method is a shortcut for the method `handler` with the following
     * configuration:
     *
     *     restlet.createClientResource('http://myurl')
     *         .handle({ method: 'OPTIONS' }, function(request, response) {
     *             (...)
     *         });
     *
     * @param {Object} [configuration] the configuration object
     * @param {(Function|Object)} handler the processing element for
     * the response
     * @clientresource
     * @method
     * @api public
     */
    options: function () {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceReadHandle.apply(
        null, arguments);
      parameters.configuration.method = 'OPTIONS';

      // Handle the request
      this.handle(parameters.entity,
        parameters.configuration, parameters.handle);

      // Allow chaining
      return this;
    }
  };
};

// If we are in the browser, add the library to global. So you can reference it
// through the keyword `restlet` in the same way than jQuery.
if (process.browser) {
  global.restlet = module.exports;
}