var StatusService = new [class Class](Service, {
    initialize: function() {
    	var enabled = true;
    	if (arguments.length==1) {
    		enabled = arguments[0];
    	}
    	this.callSuperCstr(enabled);
        this.contactEmail = null;
        this.homeRef = new [class Reference]("/");
        this.overwriting = false;
    },

    createInboundFilter: function(context) {
        return new [class StatusFilter](context, this);
    },

    getContactEmail: function() {
        return this.contactEmail;
    },

    getHomeRef: function() {
        return this.homeRef;
    },

    getRepresentation: function(status, request, response) {
        return null;
    },

    getStatus: function() {
    	console.log("getStatus");
    	var err = null;
    	var request = null;
    	var response = null;
    	if (arguments.length==2) {
        	console.log("getStatus - 1");
    		err = arguments[0];
        	console.log("getStatus - 1 - err = "+err+", arguments[0] = "+arguments[0]);
    		var resource = arguments[1];
    		if (resource!=null) {
    			request = resource.getRequest();
    			response = resource.getResponse();
    		}
    	} else if (arguments.length==3) {
        	console.log("getStatus - 2");
    		err = arguments[0];
        	console.log("getStatus - 2 - err = "+err+", arguments[0] = "+arguments[0]);
    		request = arguments[1];
    		response = arguments[2];
    	}

    	var result = null;

        /*if (err instanceof ResourceException) {
            ResourceException re = (ResourceException) throwable;

            if (re.getCause() != null) {
                // What is most interesting is the embedded cause
                result = new Status(re.getStatus(), re.getCause());
            } else {
                result = re.getStatus();
            }
        } else {*/
    	console.log("getStatus -  err = "+err);
    	if (err!=null) {
        	console.log("getStatus - 3");
    		console.log("err - "+err.stack);
            result = new [class Status]([class Status].SERVER_ERROR_INTERNAL, err);
    	}
        /*}*/

        return result;
    },

    isOverwriting: function() {
        return this.overwriting;
    },

    setContactEmail: function(contactEmail) {
        this.contactEmail = contactEmail;
    },

    setHomeRef: function(homeRef) {
        this.homeRef = homeRef;
    },

    setOverwriting: function(overwriting) {
        this.overwriting = overwriting;
    }
});