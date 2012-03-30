var RecipientInfo = new Class({
	initialize: function(protocol, name, agent) {
        this.protocol = protocol;
        this.name = name;
        this.comment = agent;
    },

    getComment: function() {
        return this.comment;
    },

    getName: function() {
        return this.name;
    },

    getProtocol: function() {
        return this.protocol;
    },

    setComment: function(comment) {
        this.comment = comment;
    },

    setName: function(name) {
        this.name = name;
    },

    setProtocol: function(protocol) {
        this.protocol = protocol;
    }
});