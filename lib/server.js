'use strict';

var path = require('path');
var _ = require('lodash');
var serverUtils = require('./server-utils');
var transport = require('./server-transport');

exports = module.exports;

var server = exports;

var serverConfigurations = [];
var servers = [];

server.createComponent = function() {
  var defaultHost = server.createVirtualHost();

  return {
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
        defaultHandler.next.handle(request, response);
      } else {
        serverUtils.sendNotFound(response);
      }
    }
  };
};

function createPathRegexp(path, configuration) {
  //return new RegExp('\/app\/ping1');
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

function isBinaryContent(req, configuration) {
  return false;
}

function wrapServerResourceHandle(req, res, configuration, handle) {
  var method = req.method;
  if (isBufferedRequest(req, configuration)) {
    console.log('>> buffered');
    return function(req, res) {
      var allData = null;
      if (isBinaryContent(req, configuration)) {
        allData = [];
      } else {
        allData = '';
      }

      req.on('data', function(data) {
        console.log('>> data = ' + data);
        if (configuration.binary) {
          allData.push(data);
        } else {
          allData += data;
        }
      });

      req.on('end', function() {
        console.log('>> end');
        if (configuration.binary) {
          req.entity.raw = Buffer.concat(allData);
        } else {
          req.entity.text = allData;
        }

        handle(req, res);
      });

      req.resume();
    };
  } else {
    console.log('>> not buffered');
    return function(req, res) {
      req.on('end', function() {
        handle(req, res);
      });

      console.log('>> resume');
      req.resume();
    };
  }
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

    },
    patch: function() {

    },
    delete: function() {

    },
    head: function() {

    },
    options: function() {

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


      for (var elt in matchedHandlers[0]) {
        console.log('>> elt = ' + elt);
      }
      // Call the server attached with the route
      wrapServerResourceHandle(request, response,
        matchedHandlers[0].configuration,
        matchedHandlers[0].handle)(request, response);
    }
  };
};