var Server = new [class Class]([class Connector], {
	initialize: function(protocol, address, port, next) {
		//TODO: need to be improved
		this.context = new [class Context]();
		this.protocol = protocol;
		this.address = address;
		this.port = port;
		this.next = next;

        if ([class Engine].getInstance() != null) {
            this.helper = [class Engine].getInstance().createHelper(this, null/*helperClass*/);
        } else {
            this.helper = null;
        }
	},
    /*public Server(Context context, List<Protocol> protocols, int port,
            Restlet next) {
        this(context, protocols, null, port, next);
    }

    public Server(Context context, List<Protocol> protocols, String address,
            int port, Restlet next) {
        this(context, protocols, address, port, next, null);
    }

    public Server(Context context, List<Protocol> protocols, String address,
            int port, Restlet next, String helperClass) {
        super(context, protocols);
        this.address = address;
        this.port = port;
        this.next = next;

        if (Engine.getInstance() != null) {
            this.helper = Engine.getInstance().createHelper(this, helperClass);
        } else {
            this.helper = null;
        }

        if (context != null && this.helper != null) {
            context.getAttributes().put("org.restlet.engine.helper",
                    this.helper);
        }
    }

    public Server(Context context, Protocol protocol) {
        this(context, protocol, (protocol == null) ? -1 : protocol
                .getDefaultPort());
    }

    public Server(Context context, Protocol protocol,
            Class<? extends ServerResource> nextClass) {
        this(context, protocol);
        setNext(createFinder(nextClass));
    }

    public Server(Context context, Protocol protocol, int port) {
        this(context, protocol, port, (Restlet) null);
    }

    public Server(Context context, Protocol protocol, int port,
            Class<? extends ServerResource> nextClass) {
        this(context, protocol, port);
        setNext(createFinder(nextClass));
    }

    public Server(Context context, Protocol protocol, int port, Restlet next) {
        this(context, protocol, null, port, next);
    }

    public Server(Context context, Protocol protocol, Restlet next) {
        this(context, protocol, null, (protocol == null) ? -1 : protocol
                .getDefaultPort(), next);
    }

    public Server(Context context, Protocol protocol, String address, int port,
            Restlet next) {
        this(context, (protocol == null) ? null : Arrays.asList(protocol),
                address, port, next);
    }

    public Server(List<Protocol> protocols, int port, Restlet next) {
        this((Context) null, protocols, port, next);
    }

    public Server(List<Protocol> protocols, String address, int port,
            Restlet next) {
        this((Context) null, protocols, address, port, next);
    }

    public Server(Protocol protocol) {
        this((Context) null, protocol, (Restlet) null);
    }

    public Server(Protocol protocol, Class<? extends ServerResource> nextClass) {
        this((Context) null, protocol);
        setNext(createFinder(nextClass));
    }

    public Server(Protocol protocol, int port) {
        this((Context) null, protocol, port, (Restlet) null);
    }

    public Server(Protocol protocol, int port,
            Class<? extends ServerResource> nextClass) {
        this(protocol, port);
        setNext(createFinder(nextClass));
    }

    public Server(Protocol protocol, int port, Restlet next) {
        this((Context) null, protocol, port, next);
    }

    public Server(Protocol protocol, Restlet next) {
        this((Context) null, protocol, next);
    }

    public Server(Protocol protocol, String address) {
        this((Context) null, protocol, address, protocol.getDefaultPort(), null);
    }

    public Server(Protocol protocol, String address,
            Class<? extends ServerResource> nextClass) {
        this(protocol, address);
        setNext(createFinder(nextClass));
    }

    public Server(Protocol protocol, String address, int port) {
        this((Context) null, protocol, address, port, null);
    }

    public Server(Protocol protocol, String address, int port, Restlet next) {
        this((Context) null, protocol, address, port, next);
    }

    public Server(Protocol protocol, String address, Restlet next) {
        this((Context) null, protocol, address, protocol.getDefaultPort(), next);
    }*/

    getActualPort: function() {
        return (this.getPort() == 0) ? this.getEphemeralPort() : getPort();
    },

    getAddress: function() {
        return this.address;
    },

    getEphemeralPort: function() {
        return this.getHelper().getAttributes().get("ephemeralPort");
    },

    getHelper: function() {
        return this.helper;
    },

    getNext: function() {
        return this.next;
    },

    getPort: function() {
        return this.port;
    },

    handle: function(request, response) {
        this.callSuper("handle", request, response);

        if (this.getNext() != null) {
            this.getNext().handle(request, response);
        }
    },

    hasNext: function() {
        return this.next != null;
    },

    isAvailable: function() {
        return this.getHelper() != null;
    },

    setAddress: function(address) {
        this.address = address;
    },

    /*public void setNext(Class<? extends ServerResource> nextClass) {
        setNext(createFinder(nextClass));
    }*/

    setNext: function(next) {
        this.next = next;
    },

    setPort: function(port) {
        this.port = port;
    },

    start: function() {
        if (this.isStopped()) {
            this.callSuper("start");

            if (this.getHelper() != null) {
            	this.getHelper().start();
            }
        }
    },

    stop: function() {
        if (this.isStarted()) {
            if (this.getHelper() != null) {
                this.getHelper().stop();
            }

            this.callSuper("stop");
        }
    }

});

// [ifdef nodejs] uncomment
// exports.Server = Server;
// [enddef]