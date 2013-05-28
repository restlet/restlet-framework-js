var Finder = new [class Class]([class Restlet], {
    initialize: function(context, targetClass) {
        this.callSuperCstr(context);
        this.targetClass = targetClass;
    },

    create: function(request, response) {
        var result = null;

        if (this.getTargetClass() != null) {
            try {
                // Invoke the default constructor
                result = new this.targetClass();
                if (this.getApplication()!=null) {
                	result.setApplication(this.getApplication());
                }
            } catch (err) {
                this.getLogger()
                        .log([class Level].WARNING,
                                "Exception while instantiating the target server resource.",
                                err);
            }
        }

        return result;
    },

    find: function(request, response) {
        return this.create(request, response);
    },

    getTargetClass: function() {
        return this.targetClass;
    },

    handle: function(request, response) {
        this.callSuper("handle", request, response);

        if (this.isStarted()) {
            var targetResource = this.find(request, response);

            if (targetResource == null) {
                // If the current status is a success but we couldn't
                // find the target resource for the request's URI,
                // then we set the response status to 404 (Not Found).
                if (this.getLogger().isLoggable([class Level].WARNING)) {
                    this.getLogger().warning(
                            "No target resource was defined for this finder: "
                                    + this.toString());
                }

                response.setStatus([class Status].CLIENT_ERROR_NOT_FOUND);
                response.commit();
            } else {
                targetResource.init(this.getContext(), request, response);

                if ((response == null) || response.getStatus().isSuccess()) {
                    targetResource.handle();
                } else {
                    // Probably during the instantiation of the target
                    // server resource, or earlier the status was
                    // changed from the default one. Don't go further.
                }

                targetResource.release();
            }
        }
    },

    setTargetClass: function(targetClass) {
        this.targetClass = targetClass;
    },

    toString: function() {
        return this.getTargetClass() == null ? "Finder with no target class"
                : "Finder for " + this.getTargetClass()/*.getSimpleName()*/;
    }
});

Finder.extend({
	createFinder: function(targetClass, finderClass, context, logger) {
	    var result = null;

	    if (finderClass != null) {
	        try {
                result = new finderClass(context, targetClass);
	        } catch (err) {
	            if (logger != null) {
	                logger.log([class Level].WARNING,
	                        "Exception while instantiating the finder.", err);
	            }
	        }
	    } else {
	        result = new Finder(context, targetClass);
	    }

	    return result;
	}
});
