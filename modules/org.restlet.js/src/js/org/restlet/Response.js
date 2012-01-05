var Response = new Class(Message, {
	initialize: function(request) {
		this.callSuper();
        this.age = 0;
        this.allowedMethods = null;
        this.autoCommitting = true;
        this.challengeRequests = null;
        this.cookieSettings = null;
        this.committed = false;
        this.dimensions = null;
        this.locationRef = null;
        this.proxyChallengeRequests = null;
        this.request = request;
        this.retryAfter = null;
        this.serverInfo = new ServerInfo();
        this.status = Status.SUCCESS_OK;
	},
    /*this.age = 0;
    this.allowedMethods = null;
    this.autoCommitting = true;
    this.challengeRequests = null;
    this.cookieSettings = null;
    this.committed = false;
    this.dimensions = null;
    this.locationRef = null;
    this.proxyChallengeRequests = null;*/
	getRequest: function() {
		return this.request;
	},
	setRequest: function(request) {
		this.request = request;
	},
	getRetryAfter: function() {
	    return this.retryAfter;
	},
	setRetryAfter: function(retryAfter) {
	    this.retryAfter = retryAfter;
	},
	getServerInfo: function() {
	    return this.serverInfo;
	},
	setServerInfo: function(serverInfo) {
	    this.serverInfo = serverInfo;
	},
	getStatus: function() {
		return this.status;
	},
	setStatus: function(status) {
		this.status = status;
	},
	getLocationRef: function() {
		return this.locationRef;
	},
	setLocationRef: function(locationRef) {
		this.locationRef = locationRef;
	}
});