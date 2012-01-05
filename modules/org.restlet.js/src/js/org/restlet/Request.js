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

/*		private volatile ChallengeResponse challengeResponse;
    private volatile ClientInfo clientInfo;
    private volatile Conditions conditions;
    private volatile Series<Cookie> cookies;
    private volatile Reference hostRef;
    private volatile boolean loggable;
    private volatile int maxForwards;
    private volatile Method method;
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
	}
});
