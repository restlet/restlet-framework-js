var StatusFilter = new [class Class]([class Filter], {
    initialize: function() {
    	var context = arguments[0];
    	this.callSuperCstr(context);

    	var overwriting = null;
        var contactEmail = null;
        var homeRef = null;
        var statusService = null;
    	if (arguments.length==2) {
    		var statusService = arguments[1];
            this.overwriting = statusService.isOverwriting();
            this.contactEmail = statusService.getContactEmail();
            this.homeRef = statusService.getHomeRef();
            this.statusService = statusService;
    	} else if (arguments.length==4) {
            this.overwriting = overwriting;
            this.contactEmail = email;
            this.homeRef = homeRef;
            this.statusService = null;
    	}
    },

    afterHandle: function(request, response) {
        // If no status is set, then the "success ok" status is assumed.
        if (response.getStatus() == null) {
            response.setStatus([class Status].SUCCESS_OK);
        }

        // Do we need to get a representation for the current status?
        if (response.getStatus().isError()
                && ((response.getEntity() == null) || this.isOverwriting())) {
            response.setEntity(this.getRepresentation(response.getStatus(), request,
                    response));
        }
    },

    doHandle: function(request, response) {
        // Normally handle the call
        try {
            this.callSuper("doHandle", request, response);
        } catch (err) {
        	console.log(err.stack);
            this.getLogger().log(Level.WARNING,
                    "Exception or error caught in status service", err);
            response.setStatus(this.getStatus(err, request, response));
        }

        return [class Filter].CONTINUE;
    },

    getContactEmail: function() {
        return this.contactEmail;
    },

    getDefaultRepresentation: function(status, request, response) {
        var sb = new [class StringBuilder]();
        sb.append("<html>\n");
        sb.append("<head>\n");
        sb.append("   <title>Status page</title>\n");
        sb.append("</head>\n");
        sb.append("<body style=\"font-family: sans-serif;\">\n");

        sb.append("<p style=\"font-size: 1.2em;font-weight: bold;margin: 1em 0px;\">");
        sb.append([class StringUtils].htmlEscape(this.getStatusInfo(status)));
        sb.append("</p>\n");
        if (status.getDescription() != null) {
            sb.append("<p>");
            sb.append([class StringUtils].htmlEscape(status.getDescription()));
            sb.append("</p>\n");
        }

        sb.append("<p>You can get technical details <a href=\"");
        sb.append(status.getUri());
        sb.append("\">here</a>.<br>\n");

        if (this.getContactEmail() != null) {
            sb.append("For further assistance, you can contact the <a href=\"mailto:");
            sb.append(this.getContactEmail());
            sb.append("\">administrator</a>.<br>\n");
        }

        if (this.getHomeRef() != null) {
            sb.append("Please continue your visit at our <a href=\"");
            sb.append(this.getHomeRef());
            sb.append("\">home page</a>.\n");
        }

        sb.append("</p>\n");
        sb.append("</body>\n");
        sb.append("</html>\n");

        return new [class StringRepresentation](sb.toString(), [class MediaType].TEXT_HTML);
    },

    getHomeRef: function() {
        return this.homeRef;
    },

    getRepresentation: function(status, request, response) {
        var result = null;

        try {
            result = this.getStatusService().getRepresentation(status, request,
                    response);
        } catch (err) {
            this.getLogger().log([class Level].WARNING,
                    "Unable to get the custom status representation", err);
        }

        if (result == null) {
            result = this.getDefaultRepresentation(status, request, response);
        }

        return result;
    },

    getStatus: function(throwable, request, response) {
        return this.getStatusService().getStatus(throwable, request, response);
    },

    getStatusInfo: function(status) {
        return (status.getReasonPhrase() != null) ? status.getReasonPhrase()
                : "No information available for this result status";
    },

    getStatusService: function() {
        return this.statusService;
    },

    isOverwriting: function() {
        return this.overwriting;
    },

    setContactEmail: function(email) {
        this.contactEmail = email;
    },

    setHomeRef: function(homeRef) {
        this.homeRef = homeRef;
    },

    setOverwriting: function(overwriting) {
        this.overwriting = overwriting;
    },

    setStatusService: function(statusService) {
        this.statusService = statusService;
    },
});