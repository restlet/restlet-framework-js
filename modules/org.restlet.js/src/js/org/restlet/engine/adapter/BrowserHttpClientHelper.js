var BrowserHttpClientHelper = new [class Class]([class HttpClientHelper], {
	initialize: function(client) {
		this.client = client;
	},
	create: function(request) {
		return new [class BrowserHttpClientCall]();
	}
});