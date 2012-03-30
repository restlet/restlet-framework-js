var Warning = new Class({
    getAgent: function() {
        return this.agent;
    },

    getDate: function() {
        return this.date;
    },

    getStatus: function() {
        return this.status;
    },

    getText: function() {
        return this.text;
    },

    setAgent: function(agent) {
        this.agent = agent;
    },

    setDate: function(date) {
        this.date = date;
    },

    setStatus: function(status) {
        this.status = status;
    },

    setText: function(text) {
        this.text = text;
    }
});