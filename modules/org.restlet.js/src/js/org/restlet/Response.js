var Response = new [class Class]([class Message], {
	initialize: function(request) {
		this.callSuperCstr();
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
        this.serverInfo = new [class ServerInfo]();
        this.status = [class Status].SUCCESS_OK;
	},
	
    abort: function() {
        this.getRequest().abort();
    },

    commit: function() {
        this.getRequest().commit(this);
    },

    getAge: function() {
        return this.age;
    },

    getAllowedMethods: function() {
        if (this.allowedMethods==null) {
        	this.allowedMethods = [];
        }
        return this.allowedMethods;
    },

    functiongetAuthenticationInfo: function() {
        return this.authenticationInfo;
    },

    getChallengeRequests: function() {
        if (this.challengeRequests==null) {
        	this.challengeRequests = [];
        }
        return this.challengeRequests;
    },

    getCookieSettings: function() {
        if (this.cookieSettings==null) {
        	this.cookieSettings = new Series();
        }
        return this.cookieSettings;
    },

    getDimensions: function() {
        if (this.dimensions==null) {
            this.dimensions = [];
        }
        return this.dimensions;
    },

    getLocationRef: function() {
        return this.locationRef;
    },

    getProxyChallengeRequests: function() {
    	if (this.proxyChallengeRequests==null) {
    		this.proxyChallengeRequests = [];
    	}
    	return this.proxyChallengeRequests;
    },

    getRequest: function() {
        return this.request;
    },

    getRetryAfter: function() {
        return this.retryAfter;
    },

    getServerInfo: function() {
    	if (this.serverInfo==null) {
    		this.serverInfo = new [class ServerInfo]();
    	}
        return this.serverInfo;
    },

    getStatus: function() {
        return this.status;
    },

    isAutoCommitting: function() {
        return this.autoCommitting;
    },

    isCommitted: function() {
        return this.committed;
    },

    isConfidential: function() {
        return this.getRequest().isConfidential();
    },

    isFinal: function() {
        return !this.getStatus().isInformational();
    },

    isProvisional: function() {
        return this.getStatus().isInformational();
    },

    redirectPermanent: function(target) {
        this.setLocationRef(target);
        this.setStatus([class Status].REDIRECTION_PERMANENT);
        this.commit();
    },

    redirectSeeOther: function(target) {
    	this.setLocationRef(target);
    	this.setStatus([class Status].REDIRECTION_SEE_OTHER);
        this.commit();
    },

    redirectTemporary: function(target) {
    	this.setLocationRef(target);
    	this.setStatus([class Status].REDIRECTION_TEMPORARY);
        this.commit();
    },

    setAge: function(age) {
        this.age = age;
    },

	setAllowedMethods: function(allowedMethods) {
		this.allowedMethods = allowedMethods;
    },

    setAuthenticationInfo: function(authenticationInfo) {
        this.authenticationInfo = authenticationInfo;
    },

    setAutoCommitting: function(autoCommitting) {
        this.autoCommitting = autoCommitting;
    },

    setChallengeRequests: function(challengeRequests) {
    	this.challengeRequests = challengeRequests;
    },

    setCommitted: function(committed) {
        this.committed = committed;
    },

    setCookieSettings: function(cookieSettings) {
    	this.cookieSettings = cookieSettings;
    },

    setDimensions: function(dimensions) {
    	this.dimensions = dimensions;
    },

    _setLocationRef: function(locationRef) {
        this.locationRef = locationRef;
    },

    setLocationRef: function(location) {
    	if (typeof location == "string") {
    		var baseRef = null;

    		if (this.getRequest().getResourceRef() != null) {
    			if (this.getRequest().getResourceRef().getBaseRef() != null) {
    				baseRef = this.getRequest().getResourceRef().getBaseRef();
    			} else {
    				baseRef = this.getRequest().getResourceRef();
    			}
    		}

    		this._setLocationRef(new [class Reference](baseRef, location).getTargetRef());
    	} else {
    		this._setLocationRef(location);
    	}
    },

	setProxyChallengeRequests: function(proxyChallengeRequests) {
		this.proxyChallengeRequests = proxyChallengeRequests;
    },

    setRequest: function(request) {
        this.request = request;
    },

    setRetryAfter: function(retryAfter) {
        this.retryAfter = retryAfter;
    },

    setServerInfo: function(serverInfo) {
        this.serverInfo = serverInfo;
    },

    _setStatus: function(status) {
        this.status = status;
    },

    setStatus: function(status, description) {
    	if (arguments.length==1) {
    		var status = arguments[0];
            this._setStatus(status);
    	} else if (arguments.length==2 && arguments[0] instanceof [class Status] && typeof arguments[1] == "string") {
    		var status = arguments[0];
    		var description = arguments[1];
            this._setStatus(new [class Status](status, description));
    	} else if (arguments.length==2 && arguments[0] instanceof [class Status] && arguments[1] instanceof Error) {
    		var status = arguments[0];
    		var error = arguments[1];
    		this._setStatus(new [class Status](status, error));
    	} else if (arguments.length==3 && arguments[0] instanceof [class Status]
    			&& arguments[1] instanceof Error && typeof arguments[2] == "string") {
    		var status = arguments[0];
    		var error = arguments[1];
    		var message = arguments[2];
    		this._setStatus(new [class Status](status, error, message));
    	}
    },
    
    /*setFirstOutboundFilter: function(firstOutboundFilter) {
    	this.firstOutboundFilter = firstOutboundFilter;
    },*/
    
    commit: function() {
    	if (arguments.length==1) {
    		var representation = arguments[0];
    		this.setEntity(representation);
    	}

    	if (this.commitCallback!=null) {
    		this.commitCallback();
    	}
    },

    setCommitCallback: function(fn) {
    	this.commitCallback = fn;
    },

    toString: function() {
        return ((this.getRequest() == null) ? "?" : this.getRequest().getProtocol())
                					+ " - " + this.getStatus();
    }
});