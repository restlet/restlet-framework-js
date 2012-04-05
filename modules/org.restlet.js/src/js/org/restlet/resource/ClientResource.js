var ClientResource = new [class Class]([class UniformResource], {
	initialize: function(url) {
		this.request = new [class Request](null, url);
	},
    addQueryParameter: function() {
        return this.getReference().addQueryParameter.apply(this.getReference(), arguments);
    },
	getRequestAttributes: function() {
		if (this.request!=null) {
			return this.request.getAttributes();
		} else {
			return null;
		}
	},
	getResponse: function() {
		return this.response;
	},
	setResponse: function(response) {
		this.response = response;
	},
	getResponseAttributes: function() {
		if (this.response!=null) {
			return this.response.getAttributes();
		} else {
			return null;
		}
	},
	createClientInfo: function(mediaType) {
		var clientInfo = null;
		if (mediaType!=null) {
			clientInfo = new [class ClientInfo](mediaType);
		} else {
			clientInfo = new [class ClientInfo]();
		}
		return clientInfo;
	},
	"get": function(callback, mediaType) {
		var clientInfo = this.createClientInfo(mediaType);
		this.handle([class Method].GET, null, clientInfo, callback);
	},
	"post": function(representation, callback, mediaType) {
		var clientInfo = this.createClientInfo(mediaType);
		this.handle([class Method].POST, representation, clientInfo, callback);
	},
	"put": function(representation, callback, mediaType) {
		var clientInfo = this.createClientInfo(mediaType);
		this.handle([class Method].PUT, representation, clientInfo, callback);
	},
	"delete": function(callback, mediaType) {
		var clientInfo = this.createClientInfo(mediaType);
		this.handle([class Method].DELETE, null, clientInfo, callback);
	},
	createRequest: function() {
		return this.request;
	},
	createResponse: function(request) {
		return new [class Response](request);
	},
	getNext: function() {
		var result = this.next;

		if (result == null) {
            result = this.createNext();

            if (result != null) {
                this.setNext(result);
                this.nextCreated = true;
            }
        }
		return result;
	},
	setNext: function(next) {
		this.next = next;
	},
	createNext: function() {
        /*var result = null;

        if ((result == null) && (this.getContext() != null)) {
            // Try using directly the client dispatcher
            result = this.getContext().getClientDispatcher();
        }

        if (result == null) {
            var rProtocol = this.getProtocol();
            var rReference = this.getReference();
            var protocol = (rProtocol != null) ? rProtocol
                    : (rReference != null) ? rReference.getSchemeProtocol()
                            : null;

            if (protocol != null) {
                result = new Client(protocol);
            }
        }

        return result;*/
		return new [class Client](new [class Context](),/*protocol*/[[class Protocol].HTTP]);
	},
	handle: function(method, entity, clientInfo, callback) {
        var request = this.createRequest(this.getRequest());
        request.setMethod(method);
        request.setEntity(entity);
        request.setClientInfo(clientInfo);

        this.handleRequest(request, callback);
	},
	handleRequest: function(request, callback) {
        //var response = this.createResponse(request);
        var next = this.getNext();

        if (next != null) {
            // Effectively handle the call
        	this.handleNext(request, callback, next);
        } else {
        	//console
            /*getLogger()
                    .warning(
                            "Unable to process the call for a client resource. No next Restlet has been provided.");*/
        }
	},
	handleNext: function(request, callback, next) {
		var currentThis = this;
		next.handle(request, function(response) {
			currentThis.setResponse(response);
			callback(response.getEntity());
		});
	}
});