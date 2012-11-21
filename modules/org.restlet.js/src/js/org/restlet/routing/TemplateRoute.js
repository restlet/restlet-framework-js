var TemplateRoute = new [class Class]([class Route], {
    initialize: function() {
    	var router = null;
    	var template = null;
    	var next = null;
    	if (arguments.length==1) {
    		next = arguments[0];
    	} else if (arguments.length==3) {
    		router = arguments[0];
    		if (typeof arguments[1] == "string") {
    			template = new [class Template](arguments[1], [class Template].MODE_STARTS_WITH,
    	                [class Variable].TYPE_URI_SEGMENT, "", true, false);
    		} else {
    			template = arguments[1];
    		}
    		next = arguments[2];
    	}
        this.callSuperCstr(router, next);
        this.matchingQuery = (router == null) ? true : router
                .getDefaultMatchingQuery();
        this.template = template;
    },

    beforeHandle: function(request, response) {
        // 1 - Parse the template variables and adjust the base reference
        if (this.getTemplate() != null) {
            remainingPart = request.getResourceRef().getRemainingPart(
                    false, this.isMatchingQuery());
            var matchedLength = this.getTemplate().parse(remainingPart, request);

            if (matchedLength == 0) {
                /*if (request.isLoggable() && getLogger().isLoggable(Level.FINER)) {
                    getLogger().finer("No characters were matched");
                }*/
            } else if (matchedLength > 0) {
                /*if (request.isLoggable() && getLogger().isLoggable(Level.FINER)) {
                    getLogger().finer(
                            "" + matchedLength + " characters were matched");
                }*/

                // Updates the context
                var matchedPart = remainingPart.substring(0, matchedLength);
                var baseRef = request.getResourceRef().getBaseRef();

                if (baseRef == null) {
                    baseRef = new [class Reference](matchedPart);
                } else {
                    baseRef = new [class Reference](baseRef.toString(false, false)
                            + matchedPart);
                }

                request.getResourceRef().setBaseRef(baseRef);

                /*if (request.isLoggable()) {
                    if (getLogger().isLoggable(Level.FINE)) {
                        remainingPart = request.getResourceRef()
                                .getRemainingPart(false, isMatchingQuery());

                        if ((remainingPart != null)
                                && (!"".equals(remainingPart))) {
                            getLogger().fine(
                                    "New base URI: \""
                                            + request.getResourceRef()
                                                    .getBaseRef()
                                            + "\". New remaining part: \""
                                            + remainingPart + "\"");
                        } else {
                            getLogger().fine(
                                    "New base URI: \""
                                            + request.getResourceRef()
                                                    .getBaseRef()
                                            + "\". No remaining part to match");
                        }
                    }

                    if (getLogger().isLoggable(Level.FINER)) {
                        getLogger().finer(
                                "Delegating the call to the target Restlet");
                    }
                }*/
            } else {
                /*if (request.isLoggable() && getLogger().isLoggable(Level.FINE)) {
                    getLogger().fine(
                            "Unable to match this pattern: "
                                    + getTemplate().getPattern());
                }*/

                response.setStatus([class Status].CLIENT_ERROR_NOT_FOUND);
            }
        }

        return [class Filter].CONTINUE;
    },

    getMatchingMode: function() {
        return this.getTemplate().getMatchingMode();
    },

    getTemplate: function() {
        return this.template;
    },

    isMatchingQuery: function() {
        return this.matchingQuery;
    },

    score: function(request, response) {
        var result = 0;

        if ((this.getRouter() != null) && (request.getResourceRef() != null)
                && (this.getTemplate() != null)) {
            var remainingPart = request.getResourceRef()
                    .getRemainingPart(false, this.isMatchingQuery());
            if (remainingPart != null) {
                var matchedLength = this.getTemplate().match(remainingPart);

                if (matchedLength != -1) {
                    var totalLength = remainingPart.length;

                    if (totalLength > 0) {
                        result = this.getRouter().getRequiredScore()
                                + (1 - this.getRouter().getRequiredScore())
                                * (matchedLength / totalLength);
                    } else {
                        result = 1;
                    }
                }
            }

            /*if (request.isLoggable() && getLogger().isLoggable(Level.FINER)) {
                getLogger().finer(
                        "Call score for the \"" + getTemplate().getPattern()
                                + "\" URI pattern: " + result);
            }*/
        }

        return result;
    },

    setMatchingMode: function(matchingMode) {
        this.getTemplate().setMatchingMode(matchingMode);
    },

    setMatchingQuery: function(matchingQuery) {
        this.matchingQuery = matchingQuery;
    },

    setTemplate: function(template) {
        this.template = template;
    },

    toString: function() {
    	/*console.log("template route - this.getTemplate() = "+this.getTemplate());
    	console.log("template route - this.getNext() = "+this.getNext());*/
        return "\""
                + ((this.getTemplate() == null) ? this/*.callSuper("toString")*/ : this.getTemplate()
                        .getPattern()) + "\" -> "
                + ((this.getNext() == null) ? "null" : this.getNext().toString());
    }
});