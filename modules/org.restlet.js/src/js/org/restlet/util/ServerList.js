var ServerList = new [class Class](Array, {
    initialize: function(context, next) {
        //super(new CopyOnWriteArrayList<Server>());
        this.context = context;
        this.next = next;
    },

    addProtocol: function() {
    	var protocol = null;
    	var address = null;
    	var port = -1;
    	if (arguments.length==1) {
    		protocol = arguments[0];
    		port = protocol.getDefaultPort();
    	} else if (arguments.length==2) {
    		protocol = arguments[0];
    		port = arguments[1];
    	} else if (arguments.length==3) {
    		protocol = arguments[0];
    		address = arguments[1];
    		port = arguments[2];
    	}
        var result = new [class Server](protocol, address, port, this.getNext());
        this.add(result);
        return result;
    },

    addServer: function(server) {
        // Set the server's context, if the server does not have already one.
        if (server.getContext() == null) {
            server.setContext(getContext().createChildContext());
        }

        server.setNext(this.getNext());
        return this.add(server);
    },

    getContext: function() {
        return this.context;
    },

    getNext: function() {
        return this.next;
    },

    setContext: function(context) {
        this.context = context;
    },

    setNext: function(next) {
        this.next = next;
    }
});