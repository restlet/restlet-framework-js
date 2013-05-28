var Route = new [class Class]([class Filter], {
    initialize: function() {
    	var router = null;
    	var next = null;
    	if (arguments.length==1) {
    		next = arguments[0];
    	} else if (arguments.length==2) {
    		router = arguments[0];
    		next = arguments[1];
    	}

        this.callSuperCstr((router != null) ? router.getContext() : (next != null) ? next
                .getContext() : null, next);
        this.router = router;
    },

    getRouter: function() {
        return this.router;
    },

    score: function(request, response) {
    	throw new Error("This method must be implemented.");
    },

    setRouter: function(router) {
        this.router = router;
    },
    
    setApplication: function(application) {
    	this.callSuper("setApplication", application);
    	if (this.next!=null) {
    		this.next.setApplication(application);
    	}
    }
});