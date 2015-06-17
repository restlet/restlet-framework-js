/*!
 * Restlet JS
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

/**
 * Module dependencies.
 * @api private
 */

var server = require('./lib/server');
var client = require('./lib/client');

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
restlet.createClientResource = client.createClientResource;