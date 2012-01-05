var Reference = new Class({
	initialize: function(url) {
		this.url = url;
		var tmp = this.url;
		var index = tmp.indexOf("://");
		if (index!=-1) {
			this.protocol = tmp.substring(index);
			tmp = tmp.substring(index+3);
		}
		index = tmp.indexOf(":");
		if (index!=-1) {
			this.host = tmp.substring(0, index);
			tmp = tmp.substring(index+1);
		}
		index = tmp.indexOf("/");
		if (index!=-1) {
			this.port = parseInt(tmp.substring(0, index));
			tmp = tmp.substring(index);
		} else if (this.protocol=="http") {
			this.port = 80;
		} else if (this.protocol=="https") {
			this.port = 443;
		}
		this.path = tmp;
	},
	getUrl: function() {
		return this.url;
	},
	getScheme: function() {
		return this.scheme;
	},
	getPort: function() {
		return this.port;
	},
	getHost: function() {
		return this.host;
	},
	getPath: function() {
		return this.path;
	}
});