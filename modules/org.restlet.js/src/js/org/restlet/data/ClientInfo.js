var ClientInfo = new Class({
	initialize: function() {
        this.address = null;
        this.agent = null;
        this.port = -1;
        this.acceptedCharacterSets = [];
        this.acceptedEncodings = [];
        this.acceptedLanguages = [];
		this.acceptedMediaTypes = [];
		if (arguments.length==1 && arguments[0] instanceof MediaType) {
			this.acceptedMediaTypes.push(new Preference(arguments[0]));
		}
        this.forwardedAddresses = [];
        this.from = null;
	},
	
	getAddress: function() {
		return this.address;
	},
	getAgent: function() {
		return this.agent;
	},
	getPort: function() {
		return this.port;
	},
	getAcceptedCharacterSets: function() {
		return this.acceptedCharacterSets;
	},
	getAcceptedEncodings: function() {
		return this.acceptedEncodings;
	},
	getAcceptedLanguages: function() {
		return this.acceptedLanguages;
	},
	getAcceptedMediaTypes: function() {
		return this.acceptedMediaTypes;
	},
	getForwardedAddresses: function() {
		return this.forwardedAddresses;
	},
	getFrom: function() {
	    return this.from;
	}
});