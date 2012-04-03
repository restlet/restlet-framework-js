var HttpClientHelper = new Class({
    //public abstract ClientCall create(Request request);
	getAdapter: function() {
        if (this.adapter == null) {
            this.adapter = new ClientAdapter(/*this.getContext()*/);
        }

        return this.adapter;
	},
    handle: function(request, callback) {
        try {
            var clientCall = this.getAdapter().toSpecific(this, request);
            this.getAdapter().commit(clientCall, request, callback);
        } catch (err) {
            /*getLogger().log(Level.INFO,
                    "Error while handling an HTTP client call", e);*/
        	var response = new Response(request);
            response.setStatus(Status.CONNECTOR_ERROR_INTERNAL, err);
            response.setEntity(new Representation());
            callback(response);
        }
    }
});