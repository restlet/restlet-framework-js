var Restlet = new [class Class]({
	setContext: function(context) {
		this.context = context;
	},
	setProtocols: function(protocols) {
		this.protocols = protocols;
	},
    isStarted: function() {
        return this.started;
    },
    isStopped: function() {
        return !this.started;
    },
    start: function() {
        this.started = true;
    },
    stop: function() {
        this.started = false;
    },
    handle: function(request, response) {
        if (this.isStopped()) {
            try {
                this.start();
            } catch (err) {
                // Occurred while starting the Restlet
                //getContext().getLogger().log(Level.WARNING, UNABLE_TO_START, e);
                response.setStatus([class Status].SERVER_ERROR_INTERNAL);
            }

            if (!this.isStarted()) {
                // No exception raised but the Restlet somehow couldn't be
                // started
                //getContext().getLogger().log(Level.WARNING, UNABLE_TO_START);
                response.setStatus([class Status].SERVER_ERROR_INTERNAL);
            }
        }
    }
});