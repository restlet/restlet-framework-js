var RestletHelper = new [class Class](Helper, {
    initialize: function(helped) {
        this.attributes = {};
        this.helped = helped;
    },

    getAttributes: function() {
        return this.attributes;
    },

    getContext: function() {
        return this.getHelped().getContext();
    },

    getHelped: function() {
        return this.helped;
    },

    getHelpedParameters: function() {
        var result = null;

        if ((this.getHelped() != null) && (this.getHelped().getContext() != null)) {
            result = this.getHelped().getContext().getParameters();
        } else {
            result = new [class Series]();
        }

        return result;
    },

    getLogger: function() {
        if (this.getHelped() != null && this.getHelped().getContext() != null) {
            return this.getHelped().getContext().getLogger();
        }
        return [class Context].getCurrentLogger();
    },

    /*public MetadataService getMetadataService() {
        MetadataService result = null;

        // [ifndef gwt]
        if (getHelped() != null) {
            org.restlet.Application application = getHelped().getApplication();

            if (application != null) {
                result = application.getMetadataService();
            }
        }
        // [enddef]

        if (result == null) {
            result = new MetadataService();
        }

        return result;
    }*/

    handle: function(request, response) {
        /*// [ifndef gwt]
        // Associate the response to the current thread
        Response.setCurrent(response);

        // Associate the context to the current thread
        if (getContext() != null) {
            Context.setCurrent(getContext());
        }
        // [enddef]*/
    },

    setHelped: function(helpedRestlet) {
        this.helped = helpedRestlet;
    },

    start: function() {
    	throw new Error("This method must be overloaded.")
    },

    stop: function() {
    	throw new Error("This method must be overloaded.")
    },

    update: function() {
    	throw new Error("This method must be overloaded.")
    }
});
