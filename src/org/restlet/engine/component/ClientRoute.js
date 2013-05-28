var ClientRoute = new [class Class]([class Route], {
	initialize: function(router, target) {
        this.callSuperCstr(router, target);
    },

    getClient: function() {
        return this.getNext();
    },

    score: function(request, response) {
        var result = 0;

        // Add the protocol score
        var protocol = request.getProtocol();

        if (protocol == null) {
            /*this.getLogger().warning(
                    "Unable to determine the protocol to use for this call.");*/
        } else if (this.getClient().getProtocols().contains(protocol)) {
            result = 1;
        }

        /*if (getLogger().isLoggable(Level.FINER)) {
            getLogger().finer(
                    "Call score for the \""
                            + getClient().getProtocols().toString()
                            + "\" client: " + result);
        }*/

        return result;
    },

    setNext: function(next) {
        this.callSuper("setNext", next);
    }
});