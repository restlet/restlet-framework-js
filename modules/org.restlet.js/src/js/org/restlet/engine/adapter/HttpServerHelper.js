var HttpServerHelper = new [class Class]([class ServerHelper], {
	initialize: function(server) {
		this.callSuperCstr(server);
        this.adapter = null;
	},

    getAdapter: function() {
    	if (this.adapter==null) {
    		/*
                final String adapterClass = getHelpedParameters()
                        .getFirstValue("adapter",
                                "org.restlet.engine.adapter.ServerAdapter");
                this.adapter = (ServerAdapter) Engine.loadClass(adapterClass)
                        .getConstructor(Context.class)
                        .newInstance(getContext());
    		 */
    		this.adapter = new [class ServerAdapter](this.getContext());
    	}
		return this.adapter;
	},
	
	setAdapter: function(adapter) {
		this.adapter = adapter;
	},
	
	handle: function(httpCall) {
		try {
			var request = this.getAdapter().toRequest(httpCall);
			var response = new HttpResponse(httpCall, request);
			var currentThis = this;
			response.setCommitCallback(function() {
				currentThis.getAdapter().commit(response);
			});
			this.callSuper("handle", request, response);
			if (response.getStatus()!=[class Status].SUCCESS_OK) {
				response.end();
			}
		} catch (err) {
                this.getLogger().log([class Level].WARNING,
                        "Error while handling an HTTP server call: ",
                        err.message);
                this.getLogger().log([class Level].INFO,
                        "Error while handling an HTTP server call", err);
		}
	}
});