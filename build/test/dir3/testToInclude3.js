var Connector3 = new Class(Restlet, {
	initialize: function(context, protocols) {
		this.context = context;
		if (typeof protocols != "undefined" && protocols!=null) {
			this.protocols = protocols;
		} else {
			this.protocols = [];
		}
	},

	getProtocols: function() {
		return this.protocols;
	}
});