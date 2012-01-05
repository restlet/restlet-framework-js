var Call = new Class({
    /*private volatile String clientAddress;
    private volatile int clientPort;
    private volatile boolean confidential;
    private volatile String hostDomain;
    private volatile int hostPort;
    private volatile String method;
    private volatile Protocol protocol;
    $$ private volatile String reasonPhrase;
    $$ private final Series<Parameter> requestHeaders;
    private volatile String requestUri;
    $$ private final Series<Parameter> responseHeaders;
    private volatile String serverAddress;
    private volatile int serverPort;
    $$ private volatile int statusCode;
    private volatile String version;*/
	getReasonPhrase: function() {
		return this.reasonPhrase;
	},
	setReasonPhrase: function(reasonPhrase) {
		this.reasonPhrase = reasonPhrase;
	},
	getRequestHeaders: function() {
		return this.requestHeaders;
	},
	setRequestHeaders: function(requestHeaders) {
		this.requestHeaders = requestHeaders;
	},
	getResponseHeaders: function() {
		console.log("call - getResponseHeaders - "+this.responseHeaders.length);
		return this.responseHeaders;
	},
	setResponseHeaders: function(responseHeaders) {
		console.log("call - setResponseHeaders - "+this.responseHeaders+" | "+responseHeaders.length);
		this.responseHeaders = responseHeaders;
	},
	getStatusCode: function() {
		return this.statusCode;
	},
	setStatusCode: function(statusCode) {
		this.statusCode = statusCode;
	}
});