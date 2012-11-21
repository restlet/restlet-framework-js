var ComponentHelper = new [class Class]([class CompositeHelper], {
    initialize: function(component) {
        this.callSuperCstr(component);
        component.setContext(new [class ComponentContext](this));
        this.clientRouter = new [class ClientRouter](this.getHelped());
        this.serverRouter = new [class ServerRouter](this.getHelped());
    },

    checkVirtualHost: function(host) {
        var result = true;

        /*if (host != null) {
            for (var i=0; i<host.getRoutes().length; i++) {
            	var route = host.getRoutes()[i];
                var next = route.getNext();

                if (next instanceof [class Application]) {
                    var application = next;

                    if (application.getConnectorService() != null) {
                        if (application.getConnectorService()
                                .getClientProtocols() != null) {
                        	var clientProtocols = application
                            		.getConnectorService().getClientProtocols();
                            for (var i=0; i<clientProtocols.length; i++) {
                            	var clientProtocol = clientProtocols[i]
                                var clientFound = false;

                                // Try to find a client connector matching the
                                // client protocol
                                var client = null;
                                for (Iterator<Client> iter = getHelped()
                                        .getClients().iterator(); !clientFound
                                        && iter.hasNext();) {
                                    client = iter.next();
                                    clientFound = client.getProtocols()
                                            .contains(clientProtocol);
                                }

                                if (!clientFound) {
                                    getLogger()
                                            .severe("Unable to start the application \""
                                                    + application.getName()
                                                    + "\". Client connector for protocol "
                                                    + clientProtocol.getName()
                                                    + " is missing.");
                                    result = false;
                                }
                            }
                        }

                        if (application.getConnectorService()
                                .getServerProtocols() != null) {
                            for (Protocol serverProtocol : application
                                    .getConnectorService().getServerProtocols()) {
                                boolean serverFound = false;

                                // Try to find a server connector matching the
                                // server protocol
                                Server server;
                                for (Iterator<Server> iter = getHelped()
                                        .getServers().iterator(); !serverFound
                                        && iter.hasNext();) {
                                    server = iter.next();
                                    serverFound = server.getProtocols()
                                            .contains(serverProtocol);
                                }

                                if (!serverFound) {
                                    getLogger()
                                            .severe("Unable to start the application \""
                                                    + application.getName()
                                                    + "\". Server connector for protocol "
                                                    + serverProtocol.getName()
                                                    + " is missing.");
                                    result = false;
                                }
                            }
                        }
                    }

                    if (result && application.isStopped()) {
                        application.start();
                    }
                }
            }
        }*/

        return result;
    },

    getClientRouter: function() {
        return this.clientRouter;
    },

    getServerRouter: function() {
        return this.serverRouter;
    },

    setServerRouter: function(serverRouter) {
        this.serverRouter = serverRouter;
    },

    start: function() {
        // Checking if all applications have proper connectors
        var success = this.checkVirtualHost(this.getHelped().getDefaultHost());

        if (success) {
            for (var i=0; i<this.getHelped().getHosts().length; i++) {
            	var host = this.getHelped().getHosts()[i];
                success = success && this.checkVirtualHost(host);
            }
        }

        // Let's actually start the component
        if (!success) {
        	this.getHelped().stop();
        } else {
            var filter = null;

            var services = this.getHelped().getServices();
            for (var i=0; i<services.length; i++) {
            	var service = services[i];
                if (service.isEnabled()) {
                    // Attach the service inbound filters
                    filter = service
                            .createInboundFilter((this.getContext() == null) ? null
                                    : this.getContext().createChildContext());

                    if (filter != null) {
                    	this.addInboundFilter(filter);
                    }

                    // Attach the service outbound filters
                    filter = service
                            .createOutboundFilter((this.getContext() == null) ? null
                                    : this.getContext().createChildContext());

                    if (filter != null) {
                    	this.addOutboundFilter(filter);
                    }
                }
            }

            // Re-attach the original filter's attached Restlet
            this.setInboundNext(this.getServerRouter());
        }
    },

    stop: function() {
        // Stop the server's router
        this.getServerRouter().stop();

        // Stop all applications
        this.stopHostApplications(this.getHelped().getDefaultHost());

        for (var i=0; i<this.getHelped().getHosts().length; i++) {
        	var host = this.getHelped().getHosts()[i];
            this.stopHostApplications(host);
        }
    },

    stopHostApplications: function(host) {
        for (var i=0; i<host.getRoutes().length; i++) {
        	var route = host.getRoutes()[i];
            if (route.getNext().isStarted()) {
                route.getNext().stop();
            }
        }
    },

    update: function() {
        // Note the old router to be able to stop it at the end
        var oldRouter = this.getServerRouter();

        // Set the new server router that will compute the new routes when the
        // first request will be received (automatic start).
        this.setServerRouter(new [class ServerRouter](this.getHelped()));

        // Replace the old server router
        this.setInboundNext(this.getServerRouter());

        // Stop the old server router
        if (oldRouter != null) {
            oldRouter.stop();
        }
    }
});