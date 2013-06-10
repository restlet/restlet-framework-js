var Connector = new [class Class]([class Restlet], {
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
	},
	setProtocols: function(protocols) {
		this.protocols = protocols;
	}
});