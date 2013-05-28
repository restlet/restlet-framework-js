var Service = new [class Class]({
    initialize: function() {
        this.context = null;
    	var enabled = true;
    	if (arguments.length==1) {
    		enabled = arguments[0];
    	}
    	this.enabled = enabled;
    },

    createInboundFilter: function(context) {
        return null;
    },

    createOutboundFilter: function(context) {
        return null;
    },

    getContext: function() {
        return this.context;
    },

    isEnabled: function() {
        return this.enabled;
    },

    isStarted: function() {
        return this.started;
    },

    isStopped: function() {
        return !this.started;
    },

    setContext: function(context) {
        this.context = context;
    },

    setEnabled: function(enabled) {
        this.enabled = enabled;
    },

    start: function() {
        if (this.isEnabled()) {
            this.started = true;
        }
    },

    stop: function() {
        if (this.isEnabled()) {
            this.started = false;
        }
    }
});