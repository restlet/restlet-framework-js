var Router = new [class Class]([class Restlet], {
	className: "Router",
    initialize: function(context) {
    	var context = null;
    	if (arguments.length==1) {
    		context = arguments[0];
    	}
        this.callSuperCstr(context);
        this.routes = new [class RouteList]();
        this.defaultMatchingMode = [class Template].MODE_EQUALS;
        this.defaultMatchingQuery = false;
        this.defaultRoute = null;
        this.routingMode = Router.MODE_FIRST_MATCH;
        this.requiredScore = 0.5;
        /*this.maxAttempts = 1;
        this.retryDelay = 500;*/
    },

    /*public TemplateRoute attach(String pathTemplate,
            Class<? extends ServerResource> targetClass) {
        return attach(pathTemplate, createFinder(targetClass));
    }

    public TemplateRoute attach(String pathTemplate,
            Class<? extends ServerResource> targetClass, int matchingMode) {
        return attach(pathTemplate, createFinder(targetClass), matchingMode);
    }*/

    attach: function() {
    	var pathTemplate = "";
    	var target = null;
        var matchingMode = null;
        if (arguments.length==1) {
        	pathTemplate = "";
        	target = arguments[0];
        	matchingMode = this.getMatchingMode(target);
        } else if (arguments.length==2) {
        	if (typeof arguments[0] == "string") {
            	pathTemplate = arguments[0];
            	target = arguments[1];
            	matchingMode = this.getMatchingMode(target);
        	} else {
            	pathTemplate = "";
            	target = arguments[0];
            	matchingMode = arguments[1];
        	}
        } else if (arguments.length==3) {
        	pathTemplate = arguments[0];
        	target = arguments[1];
        	matchingMode = arguments[2];
        }

        var result = this.createRoute(pathTemplate, target, matchingMode);
        this.getRoutes().add(result);
        return result;
    },

    attachDefault: function(defaultTarget) {
        var result = this.createRoute("", defaultTarget);
        result.setMatchingMode([class Template].MODE_STARTS_WITH);
        this.setDefaultRoute(result);
        return result;
    },

    createRoute: function() {
    	var uriPattern = arguments[0];
    	var target = arguments[1];
    	if (arguments.length==3) {
    		matchingMode = arguments[2];
    	} else if (arguments.length<3) {
    		matchingMode = this.getMatchingMode(target);
    	}
        var result = new [class TemplateRoute](this, uriPattern, target);
        result.getTemplate().setMatchingMode(matchingMode);
        result.setMatchingQuery(this.getDefaultMatchingQuery());
        return result;
    },

    /*public void detach(Class<?> targetClass) {
        for (int i = getRoutes().size() - 1; i >= 0; i--) {
            Restlet target = getRoutes().get(i).getNext();

            if (target != null
                    && Finder.class.isAssignableFrom(target.getClass())) {
                Finder finder = (Finder) target;

                if (finder.getTargetClass().equals(targetClass)) {
                    getRoutes().remove(i);
                }
            }
        }

        if (getDefaultRoute() != null) {
            Restlet target = getDefaultRoute().getNext();

            if (target != null
                    && Finder.class.isAssignableFrom(target.getClass())) {
                Finder finder = (Finder) target;

                if (finder.getTargetClass().equals(targetClass)) {
                    setDefaultRoute(null);
                }
            }
        }
    }*/

    detach: function(target) {
        this.getRoutes().removeAll(target);
        if ((this.getDefaultRoute() != null)
                && (this.getDefaultRoute().getNext() == target)) {
            this.setDefaultRoute(null);
        }
    },

    doHandle: function(next, request, response) {
   		next.handle(request, response);
    },

    /*protected Route getCustom(Request request, Response response) {
        return null;
    }*/

    getDefaultMatchingMode: function() {
        return this.defaultMatchingMode;
    },

    getDefaultMatchingQuery: function() {
        return this.defaultMatchingQuery;
    },

    getDefaultRoute: function() {
        return this.defaultRoute;
    },

    getMatchingMode: function(target) {
        var result = this.getDefaultMatchingMode();

        if (/*(target instanceof [class Directory]) || */(target instanceof [class Router])) {
            result = [class Template].MODE_STARTS_WITH;
        } else if (target instanceof [class Filter]) {
            result = this.getMatchingMode(target.getNext());
        }

        return result;
    },

    /*public int getMaxAttempts() {
        return this.maxAttempts;
    }*/

    getNext: function(request, response) {
        var result = null;
        
        //Removed attempt processing
        if (this.routes != null) {
            // Select the routing mode
            switch (this.getRoutingMode()) {
            	case Router.MODE_BEST_MATCH:
            		result = this.getRoutes().getBest(request, response,
            				this.getRequiredScore());
            		break;

            	case Router.MODE_FIRST_MATCH:
            		result = this.getRoutes().getFirst(request, response,
            				this.getRequiredScore());
            		break;

            	case Router.MODE_LAST_MATCH:
            		result = this.getRoutes().getLast(request, response,
            				this.getRequiredScore());
            		break;

            	case Router.MODE_NEXT_MATCH:
            		result = this.getRoutes().getNext(request, response,
            				this.getRequiredScore());
            		break;

            	case Router.MODE_RANDOM_MATCH:
            		result = this.getRoutes().getRandom(request, response,
            				this.getRequiredScore());
            		break;

            	case Router.MODE_CUSTOM:
            		result = this.getCustom(request, response);
            		break;
            }
        }

        if (result == null) {
            // If nothing matched in the routes list,
            // check the default route
            if ((this.getDefaultRoute() != null)
                    && (this.getDefaultRoute().score(request, response) >= this.getRequiredScore())) {
                result = this.getDefaultRoute();
            } else {
                // No route could be found
                response.setStatus([class Status].CLIENT_ERROR_NOT_FOUND);
            }
        }

        if (request.isLoggable()) {
            this.logRoute(result);
        }

        return result;
    },

    getRequiredScore: function() {
        return this.requiredScore;
    },

    /*public long getRetryDelay() {
        return this.retryDelay;
    },*/

    //RouteList
    getRoutes: function() {
        return this.routes;
    },

    getRoutingMode: function() {
        return this.routingMode;
    },

    handle: function(request, response) {
        this.callSuper("handle", request, response);
        var next = this.getNext(request, response);

        if (next != null) {
            this.doHandle(next, request, response);
        } else {
            response.setStatus([class Status].CLIENT_ERROR_NOT_FOUND);
        }
    },

    /*protected void logRoute(Route route) {
        if (getLogger().isLoggable(Level.FINE)) {
            if (getDefaultRoute() == route) {
                getLogger().fine("The default route was selected");
            } else {
                getLogger().fine("Selected route: " + route);
            }
        }
    }*/

    setDefaultMatchingMode: function(defaultMatchingMode) {
        this.defaultMatchingMode = defaultMatchingMode;
    },

    setDefaultMatchingQuery: function(defaultMatchingQuery) {
        this.defaultMatchingQuery = defaultMatchingQuery;
    },

    setDefaultRoute: function(defaultRoute) {
        this.defaultRoute = defaultRoute;
    },

    /*setMaxAttempts: function(maxAttempts) {
        this.maxAttempts = maxAttempts;
    },*/

    setRequiredScore: function(score) {
        this.requiredScore = score;
    },

    /*public void setRetryDelay(long retryDelay) {
        this.retryDelay = retryDelay;
    },*/

    setRoutes: function(routes) {
        this.routes = routes;
    },

    setRoutingMode: function(routingMode) {
        this.routingMode = routingMode;
    },

    start: function() {
        if (this.isStopped()) {
            for (var i=0; i<this.getRoutes().length; i++) {
            	var route = this.getRoutes()[i];
                route.start();
            }

            if (this.getDefaultRoute() != null) {
            	this.getDefaultRoute().start();
            }

            // Must be invoked as a last step
            this.callSuper("start");
        }
    },

    stop: function() {
        if (this.isStarted()) {
            // Must be invoked as a first step
            this.callSuper("stop");

            if (this.getDefaultRoute() != null) {
            	this.getDefaultRoute().stop();
            }

            for (var i=0; i<this.getRoutes().length; i++) {
            	var route = this.getRoutes()[i];
                route.stop();
            }
        }
    }
});

Router.extend({
	MODE_BEST_MATCH: 1,
	MODE_CUSTOM: 6,
	MODE_FIRST_MATCH: 2,
	MODE_LAST_MATCH: 3,
	MODE_NEXT_MATCH: 4,
	MODE_RANDOM_MATCH: 5
});