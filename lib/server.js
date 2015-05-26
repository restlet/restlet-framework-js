'use strict';

/**
 * Module dependencies.
 * @api private
 */

var path = require('path');
var _ = require('lodash');
var serverUtils = require('./server-utils');
var transport = require('./server-transport');
var converter = require('./converter');

exports = module.exports;

var server = exports;

var serverConfigurations = [];
var servers = [];

/**
 * Create a new Restlet component. This is typically what you do
 * first to initialize your Restlet application. The following code
 * describes how to use this method:
 * 
 *     var component = restlet.createComponent();
 * 
 * A {Component} allows then to add one or several servers, configure
 * virtual hosts and attach elements on them. Notice that a default
 * virtual host (reachable using {getDefaultHost}) is automatically
 * created and is used when any other virtual hosts match for the
 * request.
 *
 * The following code describes a typical way to create and configure
 * a Restlet component:
 *
 *     var restlet = require(restlet);
 *
 *     var component = restlet.createComponent();
 * 
 *     // Add a new HTTP server listening on port 3000.
 *     component.addServer('http', 3000);
 *
 *     // Create an application.
 *     var application = (...)
 *
 *     // Attach the sample application.
 *     component.getDefaultHost().attachDefault(application);
 *
 *     // Start the component.
 *     component.start();
 *
 * @constructor
 * @component
 * @api public
 */

server.createComponent = function() {
  var defaultHost = server.createVirtualHost();

  return {
    /**
     * Configure a server for the component to serve requests
     * for a particular protocol.
     *
     * @param {String} protocol
     * @param {Number} port
     *
     * @component
     * @api public
     */
    addServer: function(protocol, port) {
      serverConfigurations.push({
        protocol: protocol,
        port: port
      });
    },

    start: function() {
      serverConfigurations.forEach(function(serverConfiguration) {
        var server = transport.createServer(
          serverConfiguration, defaultHost.handle);
        servers.push(server);
      });
    },

    /**
     * Get the default host associated with the component. For
     * each component, a default host is implicitely created. It's
     * called if any other virtual hosts match for the request.
     *
     * @return {VirtualHost} the default virtual host
     *
     * @component
     * @api public
     */
    getDefaultHost: function() {
      return defaultHost;
    },

    stop: function() {
      servers.forEach(function(server) {
        server.stop(function() {
          console.log('Stopped server listening on port '
            + serverConfiguration.port + '.');
        });
      });
    }
  };
};

/**
 *
 *
 * @api public
 */
server.createVirtualHost = function() {
  var handlers = [];
  var defaultHandler = {};

  return {
    attach: function(path, handle) {
      if (_.isFunction(handle)) {
        // Wrap and attach the function
        handlers.push({
          path: path,
          next: {
            handle: handle
          }
        });
      } else {
        // Attach a server directly
        handlers.push({ path: path, next: handle });
      }
    },

    attachDefault: function(handle) {
      if (_.isFunction(handle)) {
        // Wrap and attach the function
        defaultHandler = {
          path: path,
          next: {
            handle: handle
          }
        };
      } else {
        // Attach a server directly
        defaultHandler = { path: path, next: handle };
      }
    },

    attachDirectory: function(path, handle) {
      handlers.push({ path: path, handle: handle });
    },

    handle: function(request, response) {
      var path = request.reference.path;
      if (_.some(handlers, { path: path })) {
        handlers.forEach(function(handler) {
          if (handler.path == path) {
            handler.next.handle(request, response);
          }
        });
      } else if (defaultHandler != null) {
        defaultHandler.next.handle(request, response,
          createNextCall(request, response, defaultHandler.next));
      } else {
        serverUtils.sendNotFound(response);
      }
    }
  };
};

function createNextCall(request, response, next) {
  return function() {
    if (next != null) {
      next.handle(request, response, createNextCall(next.next));
    }
  };
}

function createPathRegexp(path, configuration) {
  // TODO: implement the regexp to match paths
  return new RegExp(path);
}

/**
 *
 *
 * @api public
 */
server.createRouter = function() {
  var routes = [];
  var defaultRoute;

  return {
    attach: function() {
      // Get variable parameters
      var path = arguments[0];
      var configuration = null;
      var next = {};
      if (arguments.length == 2) {
        configuration = {
          matchingMode: 'equals',
          query: false
        };
        if (_.isFunction(arguments[1])) {
          // Wrap the function into a server object
          next.handle = arguments[1];
        } else {
          next = arguments[1];
        }
      } else if (arguments.length == 3) {
        configuration = arguments[1];
        if (_.isFunction(arguments[2])) {
          // Wrap the function into a server object
          next.handle = arguments[2];
        } else {
          next = arguments[2];
        }
      } else {
        throw new Error('The provided arguments aren\'t supported.');
      }

      // Create regexp path
      var pathRegexp = createPathRegexp(path, configuration);
      // Create and register the route
      var route = { next: next, path: path, pathRegexp: pathRegexp };
      routes.push(route);
    },

    attachDefault: function(handle) {
      // Wrap the function into a server object
      if (_.isFunction(handle)) {
        handle = {
          handle: handle
        };
      }

      // Set default route
      defaultRoute.next = handle;
    },

    handle: function(request, response) {
      var path = request.reference.path;
      var matchedRoutes = [];

      // Check if routes match for the current path.
      if (!_.isEmpty(routes)) {
        matchedRoutes = _.filter(routes, function(route) {
          return route.pathRegexp.test(path);
        });
      }

      // Check if a default route is configured. Use it if no route
      // matches
      if (_.isEmpty(matchedRoutes) && routes.defaultRoute != null) {
        matchedRoutes = [ routes.defaultRoute ];
      }

      // If no route matches, send back a 'not found'
      if (_.isEmpty(matchedRoutes)) {
        serverUtils.sendNotFound(response);
        return;
      }

      // Call the server attached with the route
      matchedRoutes[0].next.handle(request, response);
    }
  };
};

/**
 * Application support
 *
 * @api public
 */
server.createApplication = function(inbound, outbound) {
  var inboundRoot = inbound();
  var outboundRoot = null;
  if (outbound != null) {
    outboundRoot = outbound();
  }

  return {
    converters: converter.builtinConverters(),
    handle: function(request, response) {
      var previousEnd = response.end;
      response.end = function() {
        if (outboundRoot != null) {
          response.end = previousEnd;
          outboundRoot.handle(request, response);
        } else {
          response.end = previousEnd;
          response.end();
        }
      };
      inboundRoot.handle(request, response);
    }
  };
};

// Directory support

function serveStatic(response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function(exists) {
      if (exists) {
        fs.readFile(absPath, function(err, data) {
          if (err) {
            serverUtils.sendNotFound(response);
          } else {
            cache[absPath] = data;
          }
        });
      } else {
        serverUtils.sendNotFound(response);
      }
    });
  }
}

server.createDirectory = function() {
  var cache = {};
  return {
    handle: function(request, response) {
      var path = url.parse(request.url).pathname;
      serveStatic(response, cache, path);
    }
  };
};

/**
 * Server element support
 *
 * @api public
 */
server.createRestlet = function(handle) {
  var next = null;
  return {
    handle: function(req, res) {
      handle(req, res, createNextCall(req, res, next));
    },
    handleNext: function(request, response) {
      if (next != null) {
        next.handle(request, response);
      }
    },
    next: function(nextRestlet) {
      if (_.isFunction(nextRestlet)) {
        next = server.createRestlet(nextRestlet);
      } else {
        next = nextRestlet;
      }
      return next;
    }
  };
};

/**
 * Server filter support
 *
 * @api public
 */
server.createFilter = function(handle) {
  var next = null;
  return {
    handle: handle,
    handleNext: function(request, response) {
      if (next != null) {
        next.handle(request, response);
      }
    },
    next: function(nextRestlet) {
      next = nextRestlet;
    }
  };
};

function extractArgumentsForServerResourceHandler() {
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

function isBufferedRequest(req, configuration) {
  var method = req.method.toLowerCase();
  return (method == 'post' || method == 'put' || method == 'patch')
    && (configuration.buffered == null || configuration.buffered);
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

function isBinaryContent(req, configuration) {
  if (req.entity != null && isBinaryMediaType(req.entity.mediaType)) {
    return true;
  } else {
    return false;
  }
}

function wrapServerResourceHandle(req, res, configuration, handle) {
  var method = req.method;
  if (isBufferedRequest(req, configuration)) {
    // In the case of a buffered request (no streaming), configure
    // listeners to receive data and then call the server resource
    return function(req, res) {
      var allData = null;
      // Initialize data variable
      if (isBinaryContent(req, configuration)) {
        allData = [];
      } else {
        allData = '';
      }

      // Register listener to receive data
      req.on('data', function(data) {
        if (isBinaryContent(req, configuration)) {
          allData.push(data);
        } else {
          allData += data;
        }
      });

      // Register listener to detect when all allData are received
      req.on('end', function() {
        if (isBinaryContent(req, configuration)) {
          req.entity.raw = Buffer.concat(allData);
        } else {
          req.entity.text = allData;
        }

        handle.apply(null, createParameters(
          configuration, req, res));
      });

      // Now the listeners are registered, resume the request
      req.resume();
    };
  } else {
    // In the case of a non buffered request (no streaming), simply
    // configure a listener to detect the end of the request
    // and then call the server resource
    return function(req, res) {
      req.on('end', function() {
        handle.apply(null, createParameters(
          configuration, req, res));
      });

      req.resume();
    };
  }
}

function extractName(expression) {
  var name = expression.match(/\"(.*)\"/g);
  name = name.toString();
  return name.substr(1, name.length - 2);
}

function convertInputEntity(entity, request) {
  var converters = converter.builtinConverters();
  // TODO: check if there is a least one registered converter

  var convertedObj = null;
  if (request.clientInfo.acceptedMediaTypes != null
    && !_.isEmpty(request.clientInfo.acceptedMediaTypes)) {
    _.forEach(converters, function(converter) {
      if (converter.apply(request.clientInfo.acceptedMediaTypes)) {
        converters[0].toObject(entity.text, function(obj) {
          convertedObj = obj;
        });
      }
    });
  } else {
    converters[0].toObject(entity.text, function(obj) {
      convertedObj = obj;
    });
  }

  return convertedObj;
}

function createParameters(configuration, request, response) {
  // If no parameters are specified in the configuration, use
  // request and response
  if (configuration.parameters == null) {
    return [ request, response ];
  }

  var parameters = [];
  _.forEach(configuration.parameters, function(parameterName) {
    if (parameterName == 'request') {
      parameters.push(request);
    } else if (parameterName == 'response') {
      parameters.push(response);
    } else if (parameterName == 'entity') {
      var entity = request.entity;
      if (configuration.convertInputEntity) {
        entity = convertInputEntity(entity, request);
      }
      parameters.push(entity);
    } else if (parameterName == 'clientInfo') {
      parameters.push(request.clientInfo);
    } else if (parameterName == 'reference') {
      parameters.push(request.reference);
    } else if (parameterName == 'queryParameters') {
      parameters.push(request.queryParameters);
    } else if ((/pathVariables\[\"[a-zA-Z0-9]+\"\]/g).test(parameterName)) {
      parameters.push(request.reference);
    } else if ((/queryParameters\[\"[a-zA-Z0-9]+\"\]/g).test(parameterName)) {
      var queryParameters = request.queryParameters;
      var name = extractName(parameterName);
      parameters.push(queryParameters[name]);
    }
  });
  return parameters;
}

/**
 * Server server resource support
 *
 * @api public
 */
server.createServerResource = function() {
  var handlers = [];

  // If a function is provided as parameter of the createServerResource
  // function, add it as default handler for the server resource
  if (arguments.length == 1 && _.isFunction(arguments[0])) {
    handlers.push({
      configuration: {},
      handle: arguments[0]
    });
  }

  // If a function along with a configuration are provided as parameters
  // of the createServerResource function, add them as default handler for
  // the server resource
  if (arguments.length == 2 && _.isFunction(arguments[1])) {
    handlers.push({
      configuration: arguments[0],
      handle: arguments[1]
    });
  }

  return {
    handler: function() {
      // Extract parameters
      var parameters = extractArgumentsForServerResourceHandler.apply(
        null, arguments);

      // Register handler
      handlers.push({
        configuration: parameters.configuration,
        handle: parameters.handle
      });

      // Allow chaining
      return this;
    },

    get: function() {
      // Extract parameters and update configuration
      var parameters = extractArgumentsForServerResourceHandler.apply(
        null, arguments);
      parameters.configuration.method = 'GET';

      // Register handler
      this.handler(parameters.configuration, parameters.handle);

      // Allow chaining
      return this;
    },

    getJson: function() {

    },

    post: function() {
      // Extract parameters and update configuration
      var parameters = extractArgumentsForServerResourceHandler.apply(
        null, arguments);
      parameters.configuration.method = 'POST';

      // Register handler
      this.handler(parameters.configuration, parameters.handle);

      // Allow chaining
      return this;
    },

    put: function() {
      // Extract parameters and update configuration
      var parameters = extractArgumentsForServerResourceHandler.apply(
        null, arguments);
      parameters.configuration.method = 'PUT';

      // Register handler
      this.handler(parameters.configuration, parameters.handle);

      // Allow chaining
      return this;
    },

    patch: function() {
      // Extract parameters and update configuration
      var parameters = extractArgumentsForServerResourceHandler.apply(
        null, arguments);
      parameters.configuration.method = 'PATCH';

      // Register handler
      this.handler(parameters.configuration, parameters.handle);

      // Allow chaining
      return this;
    },

    delete: function() {
      // Extract parameters and update configuration
      var parameters = extractArgumentsForServerResourceHandler.apply(
        null, arguments);
      parameters.configuration.method = 'DELETE';

      // Register handler
      this.handler(parameters.configuration, parameters.handle);

      // Allow chaining
      return this;
    },

    head: function() {
      // Extract parameters and update configuration
      var parameters = extractArgumentsForServerResourceHandler.apply(
        null, arguments);
      parameters.configuration.method = 'HEAD';

      // Register handler
      this.handler(parameters.configuration, parameters.handle);

      // Allow chaining
      return this;
    },

    options: function() {
      // Extract parameters and update configuration
      var parameters = extractArgumentsForServerResourceHandler.apply(
        null, arguments);
      parameters.configuration.method = 'OPTIONS';

      // Register handler
      this.handler(parameters.configuration, parameters.handle);

      // Allow chaining
      return this;
    },

    handle: function(request, response) {
      // Check handler matching by method
      var matchedHandlers = _.filter(handlers, function(handler) {
        var configuration = handler.configuration;
        if (configuration != null && configuration.method != null) {
          return (request.method === configuration.method);
        }

        return false;
      });

      // Check default handlers if no handler found
      if (_.isEmpty(matchedHandlers)) {
        matchedHandlers = _.filter(handlers, function(handler) {
          var configuration = handler.configuration;
          if (configuration == null || configuration.method == null) {
            return true;
          }

          return false;
        });
      }

      // If no handler matches, send back a 'not found'
      if (_.isEmpty(matchedHandlers)) {
        serverUtils.sendNotAllowedMethod(response);
        return;
      }

      // Call the server attached with the route
      wrapServerResourceHandle(request, response,
        matchedHandlers[0].configuration,
        matchedHandlers[0].handle)(request, response);
    }
  };
};