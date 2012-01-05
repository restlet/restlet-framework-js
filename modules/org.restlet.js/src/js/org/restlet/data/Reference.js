var Reference = new Class({
	initialize: function(urlString) {
		/*console.log("#### Reference.initialize");
		this.url = url;
		console.log("url = "+url);
		var tmp = this.url;
		console.log("tmp = "+tmp);
		var index = tmp.indexOf("://");
		if (index!=-1) {
			this.protocol = tmp.substring(0, index);
			tmp = tmp.substring(index+3);
		}
		console.log("tmp = "+tmp);
		index = tmp.indexOf(":");
		if (index!=-1) {
			this.host = tmp.substring(0, index);
			tmp = tmp.substring(index+1);
		} else if (this.protocol=="http") {
			this.port = 80;
			this.tmp = "/";
		} else if (this.protocol=="https") {
			this.port = 443;
			this.tmp = "/";
		}
		console.log("tmp = "+tmp);
		index = tmp.indexOf("/");
		if (index!=-1) {
			this.port = parseInt(tmp.substring(0, index));
			tmp = tmp.substring(index);
		console.log("tmp = "+tmp);
		this.path = tmp;*/
		var urlDetails = url.parse(urlString);
		this.protocol = urlDetails.protocol;
		var index = -1;
		if ((index = this.protocol.indexOf(":"))!=-1) {
			this.protocol = this.protocol.substring(0, index);
		}
		this.host = urlDetails.hostname;
		this.port = urlDetails.port;
		if (typeof port=="undefined") {
			if (this.protocol=="http") {
				this.port = 80;
			} else if (this.protocol=="http") {
				this.port = 443;
			}
		}
		this.path = urlDetails.pathname;
		console.log("this.protocol = "+this.protocol);
		console.log("this.host = "+this.host);
		console.log("this.port = "+this.port);
		console.log("this.path = "+this.path);
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

