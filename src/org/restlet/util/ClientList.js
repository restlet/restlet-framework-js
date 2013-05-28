var ClientList = new [class Class](Array, {
    initialize: function(context) {
        this.context = context;
    },

    addClient: function(client) {
        // Set the client's context, if the client does not have already one.
        if (client.getContext() == null) {
            client.setContext(this.getContext().createChildContext());
        }

        return this.add(client);
    },

    addProtocol: function(protocol) {
        var result = new [class Client](protocol);
        result.setContext(this.getContext().createChildContext());
        this.add(result);
        return result;
    },

    getContext: function() {
        return this.context;
    },

    setContext: function(context) {
        this.context = context;
    }
});
