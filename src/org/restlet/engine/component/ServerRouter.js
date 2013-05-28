var ServerRouter = new [class Class]([class Router], {
    initialize: function(component) {
        this.callSuperCstr((component == null) ? null : component.getContext()
                .createChildContext());
        this.component = component;
        this.setRoutingMode([class Router].MODE_FIRST_MATCH);
    },

    getComponent: function() {
        return this.component;
    },

    logRoute: function(route) {
        if (getLogger().isLoggable(Level.FINE)) {
            if (route instanceof HostRoute) {
                var vhost = route.getVirtualHost();

                if (getComponent().getDefaultHost() == vhost) {
                    getLogger().fine("Default virtual host selected");
                } else {
                    getLogger().fine(
                            "Virtual host selected: \"" + vhost.getHostScheme()
                                    + "\", \"" + vhost.getHostDomain()
                                    + "\", \"" + vhost.getHostPort() + "\"");
                }
            } else {
                this.callSuper("logRoute", route);
            }
        }
    },

    /** Starts the Restlet. */
    start: function() {
        // Attach all virtual hosts
    	var hosts = this.getComponent().getHosts();
        for (var i=0; i<hosts.length; i++) {
        	var host = hosts[i];
            this.getRoutes().add(new [class HostRoute](this, host));
        }

        // Also attach the default host if it exists
        if (this.getComponent().getDefaultHost() != null) {
            this.getRoutes().push(
                    new [class HostRoute](this, this.getComponent().getDefaultHost()));
        }

        // If no host matches, display and error page with a precise message
        var noHostMatched = new [class Restlet](this.getComponent().getContext()
                .createChildContext());
        noHostMatched.handle = function(request, response) {
            response.setStatus([class Status].CLIENT_ERROR_NOT_FOUND,
                    "No virtual host could handle the request");
        };

        this.setDefaultRoute(new [class TemplateRoute](this, "",
                noHostMatched));

        // Start the router
        this.callSuper("start");
    },

    stop: function() {
        this.getRoutes().clear();
        this.callSuper("stop");
    }
});