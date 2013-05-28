var ConnectorHelper = new [class Class]([class RestletHelper], {
    initialize: function(connector) {
        this.callSuperCstr(connector);
        this.protocols = [];
    },

    getContext: function() {
        /*if (Edition.CURRENT == Edition.GWT) {
            return null;
        }*/

        return this.callSuper("getContext");
    },

    getProtocols: function() {
        return this.protocols;
    },

    start: function() {
    },

    stop: function() {
    },

    update: function() {
    }
});

/*// [ifndef gwt] method
public static org.restlet.service.ConnectorService getConnectorService() {
    org.restlet.service.ConnectorService result = null;
    org.restlet.Application application = org.restlet.Application
            .getCurrent();

    if (application != null) {
        result = application.getConnectorService();
    } else {
        result = new org.restlet.service.ConnectorService();
    }

    return result;
}*/