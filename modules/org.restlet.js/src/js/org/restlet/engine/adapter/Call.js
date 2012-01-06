var Call = new Class({
	initialize: function() {
		this.hostDomain = null;
        this.hostPort = -1;
        this.clientAddress = null;
        this.clientPort = -1;
        this.confidential = false;
        this.method = null;
        this.protocol = null;
        this.reasonPhrase = "";
	    this.requestHeaders = [];
        this.requestUri = null;
		this.responseHeaders = [];
        this.serverAddress = null;
        this.serverPort = -1;
        this.statusCode = 200;
        this.version = null;

		return this.clientAddress;
	},
	setClientAddress: function(clientAddress) {
		this.clientAddress = clientAddress;
	},
	getClientPort: function() {
		return this.clientPort;
	},
	setClientPort: function(clientPort) {
		this.clientPort = clientPort;
	},
	getConfidential: function() {
		return this.confidential;
	},
	setConfidential: function(confidential) {
		this.confidential = confidential;
	},
	getHostDomain: function() {
		return this.hostDomain;
	},
	setHostDomain: function(hostDomain) {
		this.hostDomain = hostDomain;
	},
	getHostPort: function() {
		return this.hostPort;
	},
	setHostPort: function(hostPort) {
		this.hostPort = hostPort;
	},
	getMethod: function() {
		return this.method;
	},
	setMethod: function(method) {
		this.method = method;
	},
	getProtocol: function() {
		return this.protocol;
	},
	setProtocol: function(protocol) {
		this.protocol = protocol;
	},
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
	getRequestUri: function() {
		return this.requestUri;
	},
	setRequestUri: function(requestUri) {
		this.requestUri = requestUri;
	},
	getResponseHeaders: function() {
		console.log("call - getResponseHeaders - "+this.responseHeaders.length);
		return this.responseHeaders;
	},
	setResponseHeaders: function(responseHeaders) {
		console.log("call - setResponseHeaders - "+this.responseHeaders+" | "+responseHeaders.length);
		this.responseHeaders = responseHeaders;
	},
	getServerAddress: function() {
		return this.serverAddress;
	},
	setServerAddress: function(serverAddress) {
		this.serverAddress = serverAddress;
	},
	getServerPort: function() {
		return this.serverPort;
	},
	setServerPort: function(serverPort) {
		this.serverPort = serverPort;
	},
	getStatusCode: function() {
		return this.statusCode;
	},
	setStatusCode: function(statusCode) {
		this.statusCode = statusCode;
	},
	getStatusCode: function() {
		return this.statusCode;
	},
	setStatusCode: function(statusCode) {
		this.statusCode = statusCode;
	},
	getVersion: function() {
		return this.version;
	},
	setVersion: function(version) {
		this.version = version;
	}
});