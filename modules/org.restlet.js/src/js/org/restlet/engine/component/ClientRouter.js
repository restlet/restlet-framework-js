var ClientRouter = new [class Class]([class Router], {
    initialize: function(component) {
        this.callSuperCstr((component == null) ? null : component.getContext()
                .createChildContext());
        this.component = component;
    },

    logRoute: function(route) {
        /*if (getLogger().isLoggable(Level.FINE)) {
            if (route instanceof ClientRoute) {
                Client client = ((ClientRoute) route).getClient();

                getLogger().fine(
                        "This client was selected: \"" + client.getProtocols()
                                + "\"");
            } else {
                super.logRoute(route);
            }
        }*/
    },

    getNext: function(request, response) {
        var result = this.callSuper("getNext", request, response);

        if (result == null) {
            /*getLogger()
                    .warning(
                            "The protocol used by this request is not declared in the list of client connectors. ("
                                    + request.getResourceRef()
                                            .getSchemeProtocol() + "). In case you are using an instance of the Component class, check its \"clients\" property.");*/
        }
        return result;
    },

    getComponent: function() {
        return this.component;
    },

    start: function() {
    	var clients = this.getComponent().getClients();
        for (var i=0; i<clients.length; i++) {
        	var client = clients[i];
            this.getRoutes().add(new [class ClientRoute](this, client));
        }

        this.callSuper("start");
    }
});