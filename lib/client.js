'use strict';

/**
 * Module dependencies.
 * @api private
 */

var transport = require('./client-transport')
var clientUtils = require('./client-utils')
var debugClientResource = require('debug')('resource');

exports = module.exports;

var client = exports;

function extractArgumentsForClientResourceHandle() {
  var configuration = null;
  var handle = null;
  if (arguments.length == 1) {
    configuration = {};
    handle = arguments[0];
  } else if (arguments.length == 2) {
    configuration = arguments[0];
    handle = arguments[1];
  }

  return {
    configuration: configuration,
    handle: handle
  };
}

function isBinaryMediaType(mediaType) {
  if (mediaType != null) {
    // Check if the media type is a text one
    return !((/text\/[a-z*]*/g).test(mediaType)
      || (/application\/(xml)*/g).test(mediaType)
      || (/application\/(json)*/g).test(mediaType)
      || (/application\/(javascript)*/g).test(mediaType)
      || (/application\/(atom)*/g).test(mediaType)
      || (/application\/(yml)*/g).test(mediaType)
      || (/application\/(smile)*/g).test(mediaType));
  }

  // By default, use data as binary
  return true;
}

function isBinaryContent(res) {
  if (res.entity != null && isBinaryMediaType(res.entity.mediaType.name)) {
    return true;
  } else {
    return false;
  }
}

function hasContent(res) {
	console.log('>> hasContent = ' + (res.entity != null && res.entity.mediaType));
	console.log('res = '+JSON.stringify(res));
  return (res.entity != null && res.entity.mediaType);
}

function handleResponse(req, res, configuration, handler) {
  if (hasContent(res)) {
    var binaryContent = isBinaryContent(res);

    var allData = null;
    // Initialize data variable
    if (binaryContent) {
      allData = [];
    } else {
      allData = '';
    }

    // Register listener to receive data
    res.entity.on('data', function(data) {
      if (binaryContent) {
        allData.push(data);
      } else {
        allData += data;
      }
    });

    // Register listener to detect when all allData are received
    res.entity.on('end', function() {
      if (binaryContent) {
        res.entity.raw = Buffer.concat(allData);
      } else {
        res.entity.text = allData;
      }

      // Create parameters
      var parameters = createParameters(
                configuration, req, res);

      // Call the handler
      handler.apply(null, parameters);
    });
  } else {
    res.entity.on('end', function() {
      // Create parameters
      var parameters = createParameters(
                configuration, req, res);

      // Call the handler
      handler.apply(null, parameters);
    });
  }
}

function extractName(expression) {
  var name = expression.match(/\"(.*)\"/g);
  name = name.toString();
  return name.substr(1, name.length - 2);
}

function convertOutputEntity(entity, request, response) {
  var convertedObj = null;

  debugServerResource('Converting input text to object');

  // Check if the media type is present in the request
  if (request.entity.mediaType == null
      || _.isEmpty(request.entity.mediaType.name)) {
    serverUtils.setNotSupportedMediaTypeInResponse(response);
    return;
  }

  // Get the converter that matches the accepted
  // media types
  var converter = converterApi.findConverter(
    response.entity.mediaType);

  // Check if a converter was found to converter the entity
  if (converter == null) {
    serverUtils.setNotSupportedMediaTypeInResponse(response);
    return;
  }

  // Use the converter to convert payload to object
  converter.toObject(entity.text, function(err, obj) {
    // Handle error
    if (err) {
      serverUtils.setNotSupportedMediaTypeInResponse(response);
    }

    convertedObj = obj;
  });

  return convertedObj;
}

function createParameters(configuration, request, response) {
  // If no parameters are specified in the configuration, use
  // request and response
  if (configuration.parameters == null) {
  	console.log('>> test');
    return [ request, response ];
  }

  var parameters = [];
  _.forEach(configuration.parameters, function(parameterName) {
    if (parameterName == 'request') {
      parameters.push(request);
    } else if (parameterName == 'response') {
      parameters.push(response);
    } else if (parameterName == 'entity') {
      var entity = response.entity;
      if (configuration.convertOutputEntity) {
        entity = convertOutputEntity(entity, request, response);
      }
      parameters.push(entity);
    } else if (parameterName == 'clientInfo') {
      parameters.push(request.clientInfo);
    } else if (parameterName == 'reference') {
      parameters.push(request.reference);
    } else if (parameterName == 'queryParameters') {
      parameters.push(request.queryParameters);
    } else if ((/pathVariables\[\"[a-zA-Z0-9]+\"\]/g).test(parameterName)) {
      var pathVariables = request.pathVariables;
      var name = extractName(parameterName);
      parameters.push(pathVariables[name]);
    } else if ((/queryParameters\[\"[a-zA-Z0-9]+\"\]/g).test(parameterName)) {
      var queryParameters = request.queryParameters;
      var name = extractName(parameterName);
      parameters.push(queryParameters[name]);
    } else if ((/attributes\[\"[a-zA-Z0-9]+\"\]/g).test(parameterName)) {
      var attributes = request.attributes;
      var name = extractName(parameterName);
      parameters.push(attributes[name]);
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
client.createClientResource = function(url) {
  return {
    /**
     * The entry point for server resource.
     *
     * Notice that this method shouldn't be called explicitly since it
     * involves within the request processing chain.
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @clientresource
     * @method
     * @api private
     */
    handle: function() {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceHandle.apply(
        null, arguments);

      // Create request from configuration
      var request = clientUtils.createRequest(url, parameters.configuration);

      // Execute the request
      var client = transport.createClient(request, function(response) {
      	handleResponse(request, response, parameters.configuration, parameters.handle);
      });

      // Send data if necessary

      // Mark the request as finished
      client.end();
    },

    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @clientresource
     * @method
     * @api public
     */
    get: function() {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceHandle.apply(
        null, arguments);
      parameters.configuration.method = 'GET';

      // Handle the request
      this.handle(parameters.configuration, parameters.handle);
    },

    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @clientresource
     * @method
     * @api public
     */
    post: function() {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceHandle.apply(
        null, arguments);
      parameters.configuration.method = 'POST';

      // Handle the request
      this.handle(parameters.configuration, parameters.handle);
    },

    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @clientresource
     * @method
     * @api public
     */
    put: function() {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceHandle.apply(
        null, arguments);
      parameters.configuration.method = 'PUT';

      // Handle the request
      this.handle(parameters.configuration, parameters.handle);
    },

    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @clientresource
     * @method
     * @api public
     */
    patch: function() {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceHandle.apply(
        null, arguments);
      parameters.configuration.method = 'PATCH';

      // Handle the request
      this.handle(parameters.configuration, parameters.handle);
    },

    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @clientresource
     * @method
     * @api public
     */
    delete: function() {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceHandle.apply(
        null, arguments);
      parameters.configuration.method = 'DELETE';

      // Handle the request
      this.handle(parameters.configuration, parameters.handle);
    },

    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @clientresource
     * @method
     * @api public
     */
    head: function() {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceHandle.apply(
        null, arguments);
      parameters.configuration.method = 'HEAD';

      // Handle the request
      this.handle(parameters.configuration, parameters.handle);
    },

    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @clientresource
     * @method
     * @api public
     */
    options: function() {
      // Extract parameters
      var parameters = extractArgumentsForClientResourceHandle.apply(
        null, arguments);
      parameters.configuration.method = 'OPTIONS';

      // Handle the request
      this.handle(parameters.configuration, parameters.handle);
    }

  };
};