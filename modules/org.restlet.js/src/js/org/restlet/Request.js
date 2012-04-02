var Request = new Class(Message, {
	//initialize: function(method, resourceRef, url) {
	initialize: function(method, resourceRef, entity) {
		this.callSuper(entity);
		this.method = method;
		this.clientInfo = new ClientInfo();
		if (typeof resourceRef == "string") {
			this.resourceRef = new Reference(resourceRef);
		} else if (resourceRef instanceof Reference) {
			this.resourceRef = resourceRef;
		}
		this.ranges = [];
		this.conditions = new Conditions();
		this.cookies = new Series();
	},
	
    abort: function() {
        return false;
    },

    commit: function(response) {
    },

    getChallengeResponse: function() {
        return this.challengeResponse;
    },

    getClientInfo: function() {
        if (this.clientInfo==null) {
        	this.clientInfo = new ClientInfo();
        }
        return this.clientInfo;
    },

    getConditions: function() {
        if (this.conditions==null) {
        	this.conditions = new Conditions();
        }
        return this.conditions;
    },

    getCookies: function() {
        if (this.cookies==null) {
        	this.cookies = new Series();
        }
        return this.cookies;
    },

    getHostRef: function() {
        return this.hostRef;
    },

    getMaxForwards: function() {
        return this.maxForwards;
    },

    getMethod: function() {
        return this.method;
    },

    getOriginalRef: function() {
        return this.originalRef;
    },

    getProtocol: function() {
        var result = this.protocol;

        if ((result == null) && (this.getResourceRef() != null)) {
            // Attempt to guess the protocol to use
            // from the target reference scheme
            result = this.getResourceRef().getSchemeProtocol();
            // Fallback: look at base reference scheme
            if (result == null) {
                result = (this.getResourceRef().getBaseRef() != null) ? this.getResourceRef()
                        .getBaseRef().getSchemeProtocol() : null;
            }
        }

        return result;
    },

    getProxyChallengeResponse: function() {
        return this.proxyChallengeResponse;
    },

    getRanges: function() {
        if (this.ranges==null) {
        	this.ranges = [];
        }
        return this.ranges;
    },

    getReferrerRef: function() {
        return this.referrerRef;
    },

    getResourceRef: function() {
        return this.resourceRef;
    },

    getRootRef: function() {
        return this.rootRef;
    },

    isConfidential: function() {
        return (this.getProtocol() == null) ? false : this.getProtocol().isConfidential();
    },

    isEntityAvailable: function() {
        var result = (Method.GET.equals(this.getMethod())
                || Method.HEAD.equals(this.getMethod()) || Method.DELETE
                .equals(this.getMethod()));
        if (result) {
            return false;
        }

        //return super.isEntityAvailable();
        return (this.getEntity() != null) && this.getEntity().isAvailable();

    },

    isExpectingResponse: function() {
        return (this.getMethod() == null) ? false : this.getMethod().isReplying();
    },

    isLoggable: function() {
        return this.loggable;
    },

    setChallengeResponse: function(challengeResponse) {
        this.challengeResponse = challengeResponse;
    },

    setClientInfo: function(clientInfo) {
        this.clientInfo = clientInfo;
    },

    setConditions: function(conditions) {
        this.conditions = conditions;
    },

    setCookies: function(cookies) {
    	this.cookies = cookies;
    },

    _setHostRef: function(hostRef) {
        this.hostRef = hostRef;
    },

    setHostRef: function(hostUri) {
    	if (typeof host == "string") {
    		this._setHostRef(new Reference(host));
    	} else {
    		this._setHostRef(host);
    	}
    },

    setLoggable: function(loggable) {
        this.loggable = loggable;
    },

    setMaxForwards: function(maxForwards) {
        this.maxForwards = maxForwards;
    },

    setMethod: function(method) {
        this.method = method;
    },

    setOriginalRef: function(originalRef) {
        this.originalRef = originalRef;
    },

    setProtocol: function(protocol) {
        this.protocol = protocol;
    },

    setProxyChallengeResponse: function(challengeResponse) {
        this.proxyChallengeResponse = challengeResponse;
    },

    setRanges: function(ranges) {
    	this.ranges = ranges;
    },

    _setReferrerRef: function(referrerRef) {
        this.referrerRef = referrerRef;

        // A referrer reference must not include a fragment.
        if ((this.referrerRef != null)
                && (this.referrerRef.getFragment() != null)) {
            this.referrerRef.setFragment(null);
        }
    },

    setReferrerRef: function(referrer) {
    	if (typeof referrer == "string") {
    		this._setReferrerRef(new Reference(referrer));
    	} else {
    		this._setReferrerRef(referrer);
    	}
    },

    _setResourceRef: function(resourceRef) {
        this.resourceRef = resourceRef;
    },

    setResourceRef: function(resource) {
    	if (typeof resource == "string") {
    		if (this.getResourceRef() != null) {
    			// Allow usage of URIs relative to the current base reference
    			setResourceRef(new Reference(getResourceRef().getBaseRef(),
    								resource));
    		} else {
    			setResourceRef(new Reference(resource));
    		}
    	} else {
    		this._setResourceRef(resource);
    	}
    },

    setRootRef: function(rootRef) {
        this.rootRef = rootRef;
    },

    toString: function() {
        return ((this.getMethod() == null) ? "" : this.getMethod().toString())
                + " "
                + ((this.getResourceRef() == null) ? "" : this.getResourceRef()
                        .toString())
                + " "
                + ((this.getProtocol() == null) ? ""
                        : (this.getProtocol().getName() + ((this.getProtocol()
                                .getVersion() == null) ? "" : "/"
                                + this.getProtocol().getVersion())));
    }
});