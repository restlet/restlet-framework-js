'use strict';

/**
 * Module dependencies.
 * @api private
 */

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var serverUtils = require('./server-utils');
var transport = require('./server-transport');
var converter = require('./converter');

exports = module.exports;

var server = exports;

var serverConfigurations = [];
var servers = [];

/**
 * Create a new Restlet component.
 *
 * This is typically what you do first to initialize your Restlet
 * application. The following code describes how to use this method:
 * 
 *     var component = restlet.createComponent();
 * 
 * A component allows then to add one or several servers, configure
 * virtual hosts and attach elements on them. Notice that a default
 * virtual host (reachable using the method `getDefaultHost`) is automatically
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
 * @type component
 * @api public
 */
server.createComponent = function() {
  var defaultHost = server.createVirtualHost();

  return {
    /**
     * Configure a server for the component to serve requests
     * for a particular protocol.
     *
     * This allows to internally attach a server to the component
     * and link it to its lifecycle. When the component is started,
     * all registered servers are also started and the same for stopping.
     *
     * The simplest way to add a server is to provided a protocol
     * and the associated port, as described below:
     *
     *     component.addServer('http', 3000);
     *
     * If you need to provide additional parameters to the server,
     * you can use a configuration object as second parameter:
     *
     *     component.addServer('https', {
     *         port: 3000,
     *         keyFile: '/path/to/agent2-key.pem',
     *         certFile: '/path/to/agent2-cert.pem'
     *     });
     })
     *
     * @param {String} protocol the protocol of the server to add
     * @param {Number|Object} port the port or the configuratiuon object of the server to add
     *
     * @component
     * @api public
     */
    addServer: function(protocol, port) {
      // TODO: support configuration object as second parameter
      serverConfigurations.push({
        protocol: protocol,
        port: port
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

    /**
     * Start the component and all the configured servers.
     *
     *     var component = restlet.createComponent();
     *     (...)
     *
     *     // Start the component.
     *     component.start();
     *
     * @component
     * @api public
     */
    start: function() {
      serverConfigurations.forEach(function(serverConfiguration) {
        var server = transport.createServer(
          serverConfiguration, defaultHost.handle);
        servers.push({
          server: server,
          configuration: serverConfiguration});
      });
    },

    /**
     * Stop the component and all the configured servers.
     *
     *     var component = restlet.createComponent();
     *     (...)
     *
     *     // Stop the component.
     *     component.stop();
     *
     * @component
     * @api public
     */
    stop: function() {
      servers.forEach(function(server) {
        server.server.stop(function() {
          console.log('Stopped server listening on port '
            + server.configuration.port + '.');
        });
      });
    }
  };
};

/**
 * Create a virtual host.
 *
 * @constructor
 * @virtualhost
 * @api public
 */
server.createVirtualHost = function() {
  var handlers = [];
  var defaultHandler = {};

  return {
    /**
     * Attach a route on a virtual host.
     * 
     * This function accepts several parameters. The concise use
     * allows to specify two parameters: the path and the handler
     * that can either a function or a Restlet object (Restlet,
     * server resource, ...). Following snippet provides a sample
     * of use:
     * 
     *     virtualHost.attach('/path', function(request, response) {
     *         (...)
     *     });
     *
     *     var application = (...)
     *     router.attach('/path', application);
     *
     * @param {String} path the path of the route
     * @param {(Function|Object)} handler the processing element when the router matches
     * @virtualhost
     * @api public
     */
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

    /**
     * Attach a default route on a virtual host.
     *
     * The attached handler will be called only if no route matches for
     * the request.
     * 
     * @param {(Function|Object)} handler the processing element when the router matches
     * @virtualhost
     * @api public
     */
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

    /**
     * The entry point for virtual host.
     *
     * Notice that this method shouldn't be called explicitly since it
     * involves within the request processing chain.
     *
     * @param {Request} request the request
     * @param {Response} response the response
     * @virtualhost
     * @api public
     */
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
  // Expressions like /path/{var1}/{var2} correspond to regexps /path/[a-zA-Z-0-9]+/[a-zA-Z-0-9]+
  var regexpString = path.replace(/\{[a-zA-Z-0-9]+\}/g, '[a-zA-Z-0-9]+');
  regexpString = '^' + regexpString + '$';
  regexpString = regexpString.replace(/\//g, '\\/');
  regexpString = regexpString.replace(/\(/g, '\\(');
  regexpString = regexpString.replace(/\)/g, '\\)');
  return new RegExp(regexpString, 'g');
}

function extractPathVariables(path, route) {
  var keys = [];
  var pathVariables = {};
  var i;

  var pattern = route.path;
  pattern = pattern.replace(/\//g, '\\/');
  pattern = pattern.replace(/\(/g, '\\(');
  pattern = pattern.replace(/\)/g, '\\)');
  pattern = pattern.replace(/{([^}]+)}/g, function($0, $1) {
    keys.push($1);
    return '([^/^(^)]+)';
  });

  var pattern = path.match(new RegExp('^' + pattern));

  for(i = 0; i < keys.length; i++) {
    pathVariables[keys[i]] = pattern[i + 1];
  }

  return pathVariables;
}

/**
 * Create a new router.
 * 
 * This is typically what you do within an application to
 * attach all the routes you want it serves.
 *
 *     var application = restlet.createApplication(function() {
 *         // Create the application router
 *         var router = restlet.createRouter();
 *         (...)
 *         return router;
 *     });
 *
 * You can notice that router allows to define complex routing
 * and can be eventually chained if necessary.
 *
 * @router
 * @constructor
 * @api public
 */
server.createRouter = function() {
  var routes = [];
  var defaultRoute;

  return {
    /**
     * Attach a route on a router.
     * 
     * This function accepts several parameters. The concise use
     * allows to specify two parameters: the path and the handler
     * that can either a function or a Restlet object (Restlet,
     * server resource, ...). Following snippet provides a sample
     * of use:
     * 
     *     router.attach('/path', function(request, response) {
     *         (...)
     *     });
     *
     *     var serverResource = (...)
     *     router.attach('/path', serverResource);
     *
     * You can also provide a object as second parameter
     * to configure the attachment. In this case, the function
     * accepts three parameters, as described below:
     *
     *     var configuration = (...)
     *     router.attach('/path', configuration, serverResource);
     *
     *     var serverResource = (...)
     *     router.attach('/path', configuration, serverResource);
     *
     * Providing a configuration object allows to specify a matching
     * mode and if the query string must be taken into account to
     * match the router and path. Following is a sample configuration
     * object:
     *
     *     {
     *         matchingMode: 'equals' | 'startsWith',
     *         query: true
     *     }
     *
     * The method `attach` supports path variables within the path
     * string. For example: `/path/{param1}/{param2}`. Restlet will
     * automatically make them available within the request through
     * its property `pathVariables`, as describes below:
     *
     *     var param1Value = request.pathVariables.param1;
     *
     * Notice that path variables are evaluated by the router itself.
     * For this reason, they are available in the request processing
     * chain after the router.
     *
     * @param {String} path the path of the route
     * @param {Object} [configuration] the configuration of the attachment
     * @param {(Function|Object)} handler the processing element when the router matches
     *
     * @router
     * @api public
     */
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

    /**
     * Attach a default route on a router.
     *
     * The attached handler will be called only if no route matches for
     * the request.
     * 
     * @param {(Function|Object)} handler the processing element when the router matches
     *
     * @router
     * @api public
     */
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

    /**
     * The entry point for router.
     *
     * Notice that this method shouldn't be called explicitly since it
     * involves within the request processing chain.
     *
     * @param {Request} request the request
     * @param {Response} response the response
     *
     * @router
     * @api public
     */
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

      // Extract path variables from the current path
      // and attach them to the request
      request.pathVariables = extractPathVariables(
        path, matchedRoutes[0]);

      // Call the server attached with the route
      matchedRoutes[0].next.handle(request, response);
    }
  };
};

/**
 * Create a new application.
 *
 * @application
 * @constructor
 * @api public
 */
server.createApplication = function(inbound, outbound) {
  var inboundRoot = inbound();
  var outboundRoot = null;
  if (outbound != null) {
    outboundRoot = outbound();
  }

  return {
    /**
     * The list of converters associated with the application.
     *
     * @member
     * @application
     * @api public
     */
    converters: converter.builtinConverters(),

    /**
     * The entry point for router.
     *
     * Notice that this method shouldn't be called explicitly since it
     * involves within the request processing chain.
     *
     * @param {Request} request the request
     * @param {Response} response the response
     * @method
     * @application
     * @api public
     */
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

/**
 * Create a directory.
 *
 * @directory
 * @constructor
 * @api public
 */
server.createDirectory = function() {
  var cache = {};
  return {
    /**
     * The entry point for directory.
     *
     * Notice that this method shouldn't be called explicitly since it
     * involves within the request processing chain.
     *
     * @param {Request} request the request
     * @param {Response} response the response
     * @method
     * @directory
     * @api public
     */
    handle: function(request, response) {
      var path = url.parse(request.url).pathname;
      serveStatic(response, cache, path);
    }
  };
};

/**
 * Create a new restlet.
 *
 * This allows to directly handle Restlet request and response
 * and eventually call the next restlet in the chain, as described
 * in the following snippet:
 *
 *     var virtualHost = restlet.createVirtualHost();
 *
 *     var myRestlet1 = restlet.createRestlet(function(request, response, next) {
 *         (...)
 *     });
 *
 *     var myRestlet2 = restlet.createRestlet(function(request, response, next) {
 *         (...)
 *         // Call the next restlet in the chain
 *         next();
 *     }).next(restlet1);
 *
 *     virtualHost.attachDefault(restlet2);
 *
 * Whereas it's possible to create a raw restlet, you should use an
 * more high-level element within Restlet such as application, router,
 * filter and server resource.
 *
 * @restlet
 * @constructor
 * @api public
 */
server.createRestlet = function(handle) {
  var next = null;
  return {
    /**
     * The entry point for router.
     *
     * Notice that this method shouldn't be called explicitly since it
     * involves within the request processing chain.
     *
     * @param {Request} request the request
     * @param {Response} response the response
     * @method
     * @restlet
     * @api public
     */
    handle: function(req, res) {
      handle(req, res, createNextCall(req, res, next));
    },
    /**
     * Define the next element of the current restlet.
     *
     * When the current restlet is called, a parameter is provided to
     * continue to execute the processing chain. If a next element is
     * set, it's implicitely called.
     *
     * The following snippet describes this mechanism:
     *
     *     var myRestlet2 = restlet.createRestlet(function(request, response, next) {
     *         (...)
     *         // Call the next restlet in the chain
     *         next();
     *     }).next(restlet1);
     *
     * Notice that this method shouldn't be called explicitly since it
     * involves within the request processing chain.
     *
     * @param {(Function|Object)} handler the next handler
     * @method
     * @restlet
     * @api public
     */
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
 * Create a new server filter.
 *
 * @filter
 * @constructor
 * @api public
 */
server.createFilter = function(handle) {
  var next = null;
  return {
    /**
     * The entry point for router.
     *
     * Notice that this method shouldn't be called explicitly since it
     * involves within the request processing chain.
     *
     * @param {Request} request the request
     * @param {Response} response the response
     * @method
     * @filter
     * @api public
     */
    handle: function(req, res) {
      handle(req, res, createNextCall(req, res, next));
    },
    /**
     * Define the next element of the current restlet.
     *
     * Notice that this method shouldn't be called explicitly since it
     * involves within the request processing chain.
     *
     * @param {(Function|Object)} handler the next handler
     * @method
     * @filter
     * @api public
     */
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
 * Create a server server resource.
 *
 * Restlet provides two ways to create and configure processing of
 * server resources:
 * 
 * * At the server resource creation. In this case, you must provide
 *   the handler and eventually a configuration object.
 * * After having created the server resource. In this case, you must
 *   use the constructor with arguments and use then shortcut methods
 *   to specify processing.
 *
 * Let's deal with the first approach with the following snippet:
 * 
 *     var serverResource = restlet.createServerResource(
 *                                     function(request, response) {
 *     });
 *
 * It's also possible to provide a configuration object to parameterize
 * the way to the specified handler and when it applies. Following snippet
 * specifies that the handler will be called only for GET methods. Requests
 * with other methods will be rejected with HTTP status code `405`:
 *
 *     var serverResource = restlet.createServerResource(
 *                                    { method: 'GET' },
 *                                    function(request, response) {
 *         (...)
 *     });
 *
 * Server resources provides shortcut methods to configure there processing
 * after having created them. Following snippet describes how to specifying
 * a function that will handle all requests with `GET` method within the
 * server resource:
 *
 *     var serverResource = restlet.createServerResource()
 *                              .get(function(request, response) {
 *         (...)
 *     });
 *
 * Notice that configuration chaining is supported at this level.
 *
 * TODO: parameters
 * TODO: content conversion
 *
 * Following snippet summarizes all available configuration parameters:
 *
 *     {
 *         method: 'GET', // HTTP method
 *         accept: 'json', // extension
 *         convertInputEntity: true | false, // convert to object input data
 *         parameters: ['request','response','entity','clientInfo',
                        'pathVariables["varName"]',
                        'queryParameters["paramName"]', 'reference'],
 *         match: function(req, res) {
 *             // Check if the handler matches within server resource
 *         }
 *     }
 *
 * @param {String} [configuration] a configuration for the defined default handler
 * @param {Function} [handler] a default handler for the server resource
 *
 * @constructor
 * @serverresource
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
    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @serverresource
     * @api public
     */
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

    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @serverresource
     * @api public
     */
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

    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @serverresource
     * @api public
     */
    getJson: function() {

    },

    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @serverresource
     * @api public
     */
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

    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @serverresource
     * @api public
     */
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

    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @serverresource
     * @api public
     */
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

    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @serverresource
     * @api public
     */
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

    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @serverresource
     * @api public
     */
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

    /**
     * TODO
     *
     * @param {(Function|Object)} handler the processing element when the router matches
     * @serverresource
     * @api public
     */
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