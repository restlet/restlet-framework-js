var ApplicationHelper = new [class Class]([class CompositeHelper], {
    initialize: function(application) {
        this.callSuperCstr(application);
    },

    handle: function(request, response) {
        // Actually handle call
        this.callSuper("handle", request, response);
    },

    setContext: function(context) {
        if (context != null) {
            this.setOutboundNext(context.getClientDispatcher());
        }
    },

    /** Start hook. */
    start: function() {
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

        // Attach the Application's server root Restlet
        this.setInboundNext(this.getHelped().getInboundRoot());

        /*if (this.getOutboundNext() == null) {
            // Warn about chaining problem
            getLogger()
                    .fine("By default, an application should be attached to a parent component in order to let application's outbound root handle calls properly.");
            setOutboundNext(new Restlet() {
                Map<Protocol, Client> clients = new ConcurrentHashMap<Protocol, Client>();

                @Override
                public void handle(Request request, Response response) {
                    Protocol rProtocol = request.getProtocol();
                    Reference rReference = request.getResourceRef();
                    Protocol protocol = (rProtocol != null) ? rProtocol
                            : (rReference != null) ? rReference
                                    .getSchemeProtocol() : null;

                    if (protocol != null) {
                        Client c = clients.get(protocol);

                        if (c == null) {
                            c = new Client(protocol);
                            clients.put(protocol, c);
                            getLogger().fine(
                                    "Added runtime client for protocol: "
                                            + protocol.getName());
                        }

                        c.handle(request, response);
                    } else {
                        response.setStatus(Status.SERVER_ERROR_INTERNAL,
                                "The server isn't properly configured to handle client calls.");
                        getLogger().warning(
                                "There is no protocol detected for this request: "
                                        + request.getResourceRef());
                    }
                }

                @Override
                public synchronized void stop() throws Exception {
                    super.stop();
                    for (Client client : clients.values()) {
                        client.stop();
                    }
                }
            });
        }*/
    },

    stop: function() {
        this.clear();
    },

    update: function() {
    }
});