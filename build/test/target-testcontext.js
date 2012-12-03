var Connector = new Class(Restlet, {
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

var myConnector = new mymodule.ClientCall();
myConnector.getProtocols();

var myConnector1 = new mymodule.Encoding();
myConnector1.getProtocols();