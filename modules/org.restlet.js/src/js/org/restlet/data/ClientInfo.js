var ClientInfo = new Class({
	initialize: function() {
		/*
        this.address = null;
        this.agent = null;
        this.port = -1;
        this.acceptedCharacterSets = null;
        this.acceptedEncodings = null;
        this.acceptedLanguages = null;
        this.acceptedMediaTypes = null;
        this.forwardedAddresses = null;
        this.from = null;
	 */
		this.acceptedMediaTypes = [];
		if (arguments.length==1 && arguments[0] instanceof MediaType) {
			this.acceptedMediaTypes.push(new Preference(arguments[0]));
		}
	},
	getAcceptedMediaTypes: function() {
		return this.acceptedMediaTypes;
	}
});