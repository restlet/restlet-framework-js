var Filter = new [class Class]([class Restlet], {
	initialize: function() {
    	var context = null;
    	var next = null;
    	if (arguments.length==1) {
    		context = arguments[0];
    	} else if (arguments.length==2) {
    		context = arguments[0];
    		next = arguments[1];
    	}
        this.callSuperCstr(context);
        this.next = next;
    },

    afterHandle: function(request, response) {
        // To be overriden
    },

    beforeHandle: function(request, response) {
        return Filter.CONTINUE;
    },

    doHandle: function(request, response) {
        var result = Filter.CONTINUE;

        if (this.getNext() != null) {
            this.getNext().handle(request, response);

            // Re-associate the response to the current thread
            //Response.setCurrent(response);

            // Associate the context to the current thread
            /*if (this.getContext() != null) {
                Context.setCurrent(getContext());
            }*/
        } else {
            response.setStatus([class Status].SERVER_ERROR_INTERNAL);
            this.getLogger()
                    .warning(
                            "The filter "
                                    + this.getName()
                                    + " was executed without a next Restlet attached to it.");
        }

        return result;
    },

    getNext: function() {
        return this.next;
    },

    handle: function(request, response) {
        this.callSuper("handle", request, response);

        switch (this.beforeHandle(request, response)) {
        case Filter.CONTINUE:
            switch (this.doHandle(request, response)) {
            case Filter.CONTINUE:
                this.afterHandle(request, response);
                break;

            default:
                // Stop the processing
                break;
            }
            break;

        case Filter.SKIP:
            this.afterHandle(request, response);
            break;

        default:
            // Stop the processing
            break;
        }
    },

    hasNext: function() {
        return this.getNext() != null;
    },

    /*public void setNext(Class<? extends ServerResource> targetClass) {
        setNext(createFinder(targetClass));
    }*/

    setNext: function(next) {
        if ((next != null) && (next.getContext() == null)) {
            next.setContext(this.getContext());
        }

        this.next = next;
    },

    start: function() {
        if (this.isStopped()) {
            if (this.getNext() != null) {
            	this.getNext().start();
            }

            // Must be invoked as a last step
            this.callSuper("start");
        }
    },

    stop: function() {
        if (this.isStarted()) {
            // Must be invoked as a first step
            this.callSuper("stop");

            if (this.getNext() != null) {
                this.getNext().stop();
            }
        }
    }
});

Filter.extend({
    SKIP: 1,
    STOP: 2
});