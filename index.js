var server = require('./lib/server');

exports = module.exports;

var restlet = exports;

// Export Restlet server support

restlet.createRestlet = server.createRestlet;
restlet.createComponent = server.createComponent;
restlet.createVirtualHost = server.createVirtualHost;
restlet.createRouter = server.createRouter;
restlet.createApplication = server.createApplication;
restlet.createDirectory = server.createDirectory;
restlet.createFilter = server.createFilter;
restlet.createServerResource = server.createServerResource;