var Engine = new [class Class]({
	initialize: function() {
        this.registeredClients = new [class ClientList]();
        // [ifdef nodejs] uncomment
        // this.registeredClients.push([class NodeJsHttpClientHelper]);
        // [enddef]
        // [ifndef nodejs]
        this.registeredClients.push([class BrowserHttpClientHelper]);
        // [enddef]

        //this.registeredProtocols = [];
        // [ifdef nodejs] uncomment
        // this.registeredServers = new [class ServerList]();
        // this.registeredServers.push([class NodeJsHttpServerHelper]);
        // [enddef]
        //this.registeredAuthenticators = [];
        //this.registeredConverters = [];
	},

	createHelper: function(restlet) {
		//TODO: fix me
		//return new this.registeredClients[0]();
		//return new this.registeredClients[0]();
        // [ifndef nodejs]
		return new this.registeredClients[0](restlet);
		// [enddef]
        // [ifdef nodejs] uncomment
		// if (restlet instanceof [class Client]) {
		// 	return new this.registeredClients[0](restlet);
		// } else if (restlet instanceof [class Server]) {
		// 	return new this.registeredServers[0](restlet);
		// }
		// [enddef]
	},
	
	/*
    public ConnectorHelper<org.restlet.Server> createHelper(
            org.restlet.Server server, String helperClass) {
        ConnectorHelper<org.restlet.Server> result = null;

        if (server.getProtocols().size() > 0) {
            ConnectorHelper<org.restlet.Server> connector = null;
            for (final Iterator<ConnectorHelper<org.restlet.Server>> iter = getRegisteredServers()
                    .iterator(); (result == null) && iter.hasNext();) {
                connector = iter.next();

                if ((helperClass == null)
                        || connector.getClass().getCanonicalName()
                                .equals(helperClass)) {
                    if (connector.getProtocols().containsAll(
                            server.getProtocols())) {
                        try {
                            result = connector.getClass()
                                    .getConstructor(org.restlet.Server.class)
                                    .newInstance(server);
                        } catch (Exception e) {
                            Context.getCurrentLogger()
                                    .log(Level.SEVERE,
                                            "Exception while instantiation the server connector.",
                                            e);
                        }
                    }
                }
            }

            if (result == null) {
                // Couldn't find a matching connector
                final StringBuilder sb = new StringBuilder();
                sb.append("No available server connector supports the required protocols: ");

                for (final Protocol p : server.getProtocols()) {
                    sb.append("'").append(p.getName()).append("' ");
                }

                sb.append(". Please add the JAR of a matching connector to your classpath.");

                if (Edition.CURRENT == Edition.ANDROID) {
                    sb.append(" Then, register this connector helper manually.");
                }

                Context.getCurrentLogger().log(Level.WARNING, sb.toString());
            }
        }

        return result;
    }

	 */

	getRegisteredClients: function() {
		return this.registeredClients;
	},
	
	setRegisteredClients: function(registeredClients) {
		this.registeredClients = registeredClients;
	},
	
	getRegisteredServers: function() {
		return this.registeredServers;
	},
	
	setRegisteredServers: function(registeredServers) {
		this.registeredServers = registeredServers;
	},
	
	getDebugHandler: function() {
		return this.debugHandler;
	},

	setDebugHandler: function(debugHandler) {
		this.debugHandler = debugHandler;
	},
	
	enableDebug: function() {
		this.debugHandler = {
			beforeSendingRequest: function(url, method, headers, data) {
				console.log(method+" "+url);
				for (var elt in headers) {
					console.log(elt+": "+headers[elt]);
				}
				console.log("");
				console.log(data);
			},
			afterReceivedResponse: function(status, statusCode, headers, data) {
				console.log(status+" "+statusCode);
				for (var elt in headers) {
					console.log(elt+": "+headers[elt]);
				}
				console.log("");
				console.log(data);
			}
		};
	},

	disableDebug: function() {
		this.debugHandler = null;
	}
});

Engine.extend({
    /*MAJOR_NUMBER: "@major-number@",
    MINOR_NUMBER: "@minor-number@",
    RELEASE_NUMBER: "@release-type@@release-number@",*/
    MAJOR_NUMBER: "2.1",
    MINOR_NUMBER: "2.0",
// [ifdef nodejs] uncomment
//    RELEASE_NUMBER: "2.1/nodejs",
// [enddef]
// [ifndef nodejs]
	RELEASE_NUMBER: "2.1/browser",
// [enddef]
	getInstance: function() {
		if (Engine.instance==null) {
			Engine.instance = new Engine();
		}
		return Engine.instance;
	},
	getLogger: function(loggerName) {
		return new [class Logger](loggerName);
	}
});

Engine.VERSION = Engine.MAJOR_NUMBER + '.' + Engine.MINOR_NUMBER + Engine.RELEASE_NUMBER;
Engine.VERSION_HEADER = "Restlet-Framework/" + Engine.VERSION;