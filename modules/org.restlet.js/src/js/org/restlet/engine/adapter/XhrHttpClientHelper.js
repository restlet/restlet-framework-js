// [ifndef nodejs]
var XhrHttpClientHelper = new Class(HttpClientHelper, {
	initialize: function(client) {
		this.client = client;
	},
	create: function(request) {
		return new XhrHttpClientCall();
	}
});
// [enddef]
