var ServerHelper = new [class Class]([class ConnectorHelper], {
    initialize: function(server) {
        this.callSuperCstr(server);

        // Clear the ephemeral port
        this.getAttributes()["ephemeralPort"] = -1;
    },

    handle: function(request, response) {
        this.callSuper("handle", request, response);
        this.getHelped().handle(request, response);
    },

    setEphemeralPort: function(localPort) {
        // If an ephemeral port is used, make sure we update the attribute for
        // the API
        if (this.getHelped().getPort() == 0) {
        	this.getAttributes()["ephemeralPort"] = localPort;
        }
    },

    stop: function() { 
        this.callSuper("stop");

        // Clear the ephemeral port
        this.getAttributes()["ephemeralPort"] = -1;
    }
});