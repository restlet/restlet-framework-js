var Request = new Class(Message, {
	initialize: function(method, url) {
		this.callSuper();
		this.method = method;
		this.clientInfo = new ClientInfo();
		console.log("#### Request.initialize");
		console.log("url = "+url);
		console.log("typeof url = "+(typeof url));
		if (typeof url == "string") {
			this.reference = new Reference(url);
		} else if (url instanceof Reference) {
			this.reference = url;
		}

/*		private volatile ChallengeResponse challengeResponse;
    $$ private volatile ClientInfo clientInfo;
    private volatile Conditions conditions;
    private volatile Series<Cookie> cookies;
    private volatile Reference hostRef;
    private volatile boolean loggable;
    private volatile int maxForwards;
    $$ private volatile Method method;
    private volatile Reference originalRef;
    private volatile Protocol protocol;
    private volatile ChallengeResponse proxyChallengeResponse;
    private volatile List<Range> ranges;
    private volatile Reference referrerRef;
    private volatile Reference resourceRef;
    private volatile Reference rootRef;*/
	},
	getMethod: function() {
		return this.method;
	},
	setMethod: function(method) {
		this.method = method;
	},
	getClientInfo: function() {
		return this.clientInfo;
	},
	setClientInfo: function(clientInfo) {
		this.clientInfo = clientInfo;
	},
	getReference: function() {
		return this.reference;
	},
	setReference: function(reference) {
		this.reference = reference;
	},
    getHostRef: function() {
        return this.hostRef;
    },
    getMaxForwards: function() {
        return this.maxForwards;
    },
    getOriginalRef: function() {
        return this.originalRef;
    },
    getReferrerRef: function() {
        return this.referrerRef;
    },
    getResourceRef: function() {
        return this.resourceRef;
    },
    getRootRef: function() {
        return this.rootRef;
    }

});