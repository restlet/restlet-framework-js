var Context = new [class Class]({
	initialize: function() {
		this.clientDispatcher = null;
	},
	getClientDispatcher: function() {
		return this.clientDispatcher;
	},
	setClientDispatcher: function(clientDispatcher) {
		this.clientDispatcher = clientDispatcher;
	}
});