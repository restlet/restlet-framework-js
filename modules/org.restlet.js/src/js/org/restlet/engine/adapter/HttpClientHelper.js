var HttpClientHelper = new [class Class]({
    //public abstract ClientCall create(Request request);
	getAdapter: function() {
        if (this.adapter == null) {
            this.adapter = new [class ClientAdapter](/*this.getContext()*/);
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
        	var response = new [class Response](request);
            response.setStatus([class Status].CONNECTOR_ERROR_INTERNAL, err);
            response.setEntity(new [class Representation]());
            callback(response);
        }
    }
});