var Request = new Class(Message, {
	initialize: function(method, url) {
		this.callSuper();
		this.method = method;
		this.clientInfo = new ClientInfo();
		if (typeof url == "string") {
			this.reference = new Reference(url);
		} else if (url instanceof Reference) {
			this.reference = url;
		}
		this.ranges = [];
		this.conditions = new Conditions();
		this.cookies = new Series();

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
	getConditions: function() {
		return this.conditions;
	},
	setConditions: function() {
		this.conditions = conditions;
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
    getRanges: function() {
    	return this.ranges;
    },
    setRanges: function(ranges) {
    	this.ranges = ranges;
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
    getCookies: function() {
    	return this.cookies;
    },
    setCookies: function(cookies) {
    	this.cookies = cookies;
    },

});