var ConnectorService = new [class Class](Service, {
    initialize: function() {
        this.clientProtocols = [];
        this.serverProtocols = [];
    },

    afterSend: function(entity) {
        // Do nothing by default.
    },

    beforeSend: function(entity) {
        // Do nothing by default.
    },

    getClientProtocols: function() {
        return this.clientProtocols;
    },

    getServerProtocols: function() {
        return this.serverProtocols;
    },

    setClientProtocols: function(clientProtocols) {
        if (clientProtocols != this.getClientProtocols()) {
            this.getClientProtocols().clear();

            if (clientProtocols != null) {
            	this.getClientProtocols().addAll(clientProtocols);
            }
        }
    },

    setServerProtocols: function(serverProtocols) {
        if (serverProtocols != this.getServerProtocols()) {
            this.getServerProtocols().clear();

            if (serverProtocols != null) {
                this.getServerProtocols().addAll(serverProtocols);
            }
        }
    }
});