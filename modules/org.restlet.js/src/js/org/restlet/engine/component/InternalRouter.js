var InternalRouter = new [class Class]([class Router], {
    initialize: function(context) {
        this.callSuperCstr(context);
        // Override Router's default modes
        this.setDefaultMatchingMode([class Template].MODE_STARTS_WITH);
        this.setRoutingMode([class Router].MODE_BEST_MATCH);
    },

    createRoute: function(uriPattern, target, matchingMode) {
        var result = new TemplateRoute(this, uriPattern, target);
        result.beforeHandle = function(request, response) {
            var result = this.callSuper("beforeHandle", request, response);

            // Set the request's root reference in order to help the
            // retrieval of the relative reference.
            request.setRootRef(request.getResourceRef().getBaseRef());

            return result;
        };

        result.getTemplate().setMatchingMode(matchingMode);
        result.setMatchingQuery(getDefaultMatchingQuery());
        return result;
    },

    attach: function() {
    	var target = null;
    	var uriPattern = null;
    	if (arguments.length==1) {
    		target = arguments[0];
    	} else if (arguments.length==2) {
    		uriPattern = arguments[0];
    		target = arguments[1];
    	}
        if (target.getContext() == null) {
            target.setContext(getContext().createChildContext());
        }

        return this.callSuper("attach", uriPattern, target);
    },

    attachDefault: function(defaultTarget) {
        if (defaultTarget.getContext() == null) {
            defaultTarget.setContext(getContext().createChildContext());
        }

        return this.callSuper("attachDefault", defaultTarget);
    }

    /*public Finder createFinder(Class<? extends ServerResource> targetClass) {
        Finder result = super.createFinder(targetClass);
        result.setContext(getContext().createChildContext());
        return result;
    }*/
});