var VirtualHost = new [class Class]([class Router], {
	className: "VirtualHost",
    initialize: function() {
    	var parentContext = null;
    	var hostDomain = ".*";
        var hostPort = ".*";
        var hostScheme = ".*";
        var resourceDomain = ".*";
        var resourcePort = ".*";
        var resourceScheme = ".*";
        var serverAddress = ".*";
        var serverPort = ".*";
        if (arguments.length==1) {
        	parentContext = arguments[0];
        }
        
        this.callSuperCstr((parentContext == null) ? null : parentContext
                .createChildContext());

        // Override Router's default modes
        this.setDefaultMatchingMode([class Template].MODE_STARTS_WITH);
        this.setRoutingMode([class Router].MODE_BEST_MATCH);

        this.parentContext = parentContext;

        this.hostDomain = hostDomain;
        this.hostPort = hostPort;
        this.hostScheme = hostScheme;

        this.resourceDomain = resourceDomain;
        this.resourcePort = resourcePort;
        this.resourceScheme = resourceScheme;

        this.serverAddress = serverAddress;
        this.serverPort = serverPort;
    },

    attach: function() {
    	var uriPattern = null;
    	var target = null;
    	if (arguments.length==1) {
    		target = arguments[0];
    	} else if (arguments.length==2) {
    		uriPattern = arguments[0];
    		target = arguments[1];
    	}
        this.checkContext(target);
        if (uriPattern!=null) {
        	this.callSuper("attach", uriPattern, target);
        } else {
        	this.callSuper("attach", target);
        }
    },

    attachDefault: function(defaultTarget) {
        this.checkContext(defaultTarget);
        var ret = this.callSuper("attachDefault", defaultTarget);
    	
    	return ret;
    },

    checkContext: function(target) {
        if ((target.getContext() == null) && (this.parentContext != null)) {
            target.setContext(this.parentContext.createChildContext());
        }
    },

    /*public Finder createFinder(Class<? extends ServerResource> targetClass) {
        Finder result = super.createFinder(targetClass);
        result.setContext(getContext().createChildContext());
        return result;
    },*/

    createRoute: function(uriPattern, target, matchingMode) {
        var result = new [class TemplateRoute](this, uriPattern, target);
        result.beforeHandle = function(request, response) {
        	var result = this.callSuper("beforeHandle", request, response);

            // Set the request's root reference
            request.setRootRef(request.getResourceRef().getBaseRef());

            // Save the hash code of the current host
            //this.setCurrent(VirtualHost.this.hashCode());

            return result;
        };

        result.getTemplate().setMatchingMode(matchingMode);
        result.setMatchingQuery(this.getDefaultMatchingQuery());
        return result;
    },

    getHostDomain: function() {
        return this.hostDomain;
    },

    getHostPort: function() {
        return this.hostPort;
    },

    getHostScheme: function() {
        return this.hostScheme;
    },

    getResourceDomain: function() {
        return this.resourceDomain;
    },

    getResourcePort: function() {
        return this.resourcePort;
    },

    getResourceScheme: function() {
        return this.resourceScheme;
    },

    getServerAddress: function() {
        return this.serverAddress;
    },

    getServerPort: function() {
        return this.serverPort;
    },

    setContext: function(parentContext) {
        this.parentContext = parentContext;
        this.callSuper("setContext", (parentContext == null) ? null : parentContext
                .createChildContext());
    },

    setHostDomain: function(hostDomain) {
        this.hostDomain = hostDomain;
    },

    setHostPort: function(hostPort) {
        this.hostPort = hostPort;
    },

    setHostScheme: function(hostScheme) {
        this.hostScheme = hostScheme;
    },

    setResourceDomain: function(resourceDomain) {
        this.resourceDomain = resourceDomain;
    },

    setResourcePort: function(resourcePort) {
        this.resourcePort = resourcePort;
    },

    setResourceScheme: function(resourceScheme) {
        this.resourceScheme = resourceScheme;
    },

    setServerAddress: function(serverAddress) {
        this.serverAddress = serverAddress;
    },

    setServerPort: function(serverPort) {
        this.serverPort = serverPort;
    }
});

VirtualHost.extend({
/*public static String getIpAddress(String domain) {
    String result = null;

    try {
        result = InetAddress.getByName(domain).getHostAddress();
    } catch (UnknownHostException e) {
    }

    return result;
}

public static String getLocalHostAddress() {
    String result = null;

    try {
        result = InetAddress.getLocalHost().getHostAddress();
    } catch (UnknownHostException e) {
    }

    return result;
}

public static String getLocalHostName() {
    String result = null;

    try {
        result = InetAddress.getLocalHost().getHostName();
    } catch (UnknownHostException e) {
    }

    return result;
}*/
});