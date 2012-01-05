var ServerInfo =new Class({
    initialize: function() {
        this.address = null;
        this.agent = null;
        this.port = -1;
        this.acceptingRanges = false;
    },
	getAcceptingRanges: function() {
		return this.acceptingRanges;
	},
	setAcceptingRanges: function(acceptingRanges) {
		this.acceptingRanges = acceptingRanges;
	},
	getAddress: function() {
		return this.address;
	},
	setAddress: function(address) {
		this.address = address;
	},
	getAgent: function() {
		return this.agent;
	},
	setAgent: function(agent) {
		this.agent = agent;
	},
	getPort: function() {
		return this.port;
	},
	setPort: function(port) {
		this.port = port;
	}
});