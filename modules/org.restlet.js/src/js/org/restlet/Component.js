var Component= new [class Class]([class Restlet], {
	initialize: function() {
		this.callSuperCstr();
        this.hosts = [];
        this.clients = new [class ClientList](null);
        this.servers = new [class ServerList](null, this);
        /*this.realms = new CopyOnWriteArrayList<Realm>();*/
        this.services = new [class ServiceList](this.getContext());

        if ([class Engine].getInstance() != null) {
            this.helper = new [class ComponentHelper](this);
            var childContext = this.getContext().createChildContext();
            this.defaultHost = new [class VirtualHost](childContext);
            this.internalRouter = new [class InternalRouter](childContext);
            /*this.services.add(new LogService());
            getLogService().setContext(childContext);*/
            this.services.add(new [class StatusService]());
            this.getStatusService().setContext(childContext);
            this.clients.setContext(childContext);
            this.servers.setContext(childContext);
        }
	},

	getClients: function() {
		return this.clients;
	},

	getDefaultHost: function() {
		return this.defaultHost;
	},

	getHelper: function() {
		return this.helper;
	},

	getHosts: function() {
		return this.hosts;
	},

	getInternalRouter: function() {
		return this.internalRouter;
	},

	/*getLogService: function() {
		return getServices().get(LogService.class);
	},*/

/*public Realm getRealm(String name) {
    if (name != null) {
        for (Realm realm : getRealms()) {
            if (name.equals(realm.getName())) {
                return realm;
            }
        }
    }

    return null;
}

public List<Realm> getRealms() {
    return realms;
}*/

	getServers: function() {
		return this.servers;
	},

	getServices: function() {
		return this.services;
	},

	getStatusService: function() {
		//return this.getServices().get([class StatusService].class);
		return this.getServices()[0];
	},

	handle: function(request, response) {
		this.callSuper("handle", request, response);

		if (this.getHelper() != null) {
			this.getHelper().handle(request, response);
		}
	},

	setClients: function(clients) {
		this.clients = clients;
	},

	setContext: function(context) {
		this.callSuper("setContext", context);
		this.getServices().setContext(context);
	},

	setDefaultHost: function(defaultHost) {
		this.defaultHost = defaultHost;
	},

	setHosts: function(hosts) {
		if (hosts != this.getHosts()) {
			this.getHosts().clear();

			if (hosts != null) {
				this.getHosts().addAll(hosts);
			}
		}
	},

	setInternalRouter: function(internalRouter) {
		this.internalRouter = internalRouter;
	},

	/*setLogService: function(logService) {
		this.getServices().set(logService);
	},*/

/*public void setRealms(List<Realm> realms) {
    synchronized (getRealms()) {
        if (realms != getRealms()) {
            getRealms().clear();

            if (realms != null) {
                getRealms().addAll(realms);
            }
        }
    }
}*/

	setServers: function(servers) {
		this.servers = servers;
	},

	setStatusService: function(statusService) {
		this.getServices().set(statusService);
	},

	start: function() {
		if (this.isStopped()) {
			this.startClients();
			this.startServers();
			this.startRouters();
			/*this.startServices();
			//this.startRealms();*/
			this.startHelper();
			this.callSuper("start");
		}
	},

	startClients: function() {
		if (this.clients != null) {
			for (var i=0; i<this.clients.length; i++) {
				var client = this.clients[i];
				client.start();
			}
		}
	},

	startHelper: function() {
		if (this.getHelper() != null) {
			this.getHelper().start();
		}
	},

/*protected synchronized void startRealms() throws Exception {
    if (this.realms != null) {
        for (Realm realm : this.realms) {
            realm.start();
        }
    }
}*/

	startRouters: function() {
		if (this.internalRouter != null) {
			this.internalRouter.start();
		}

		if (this.defaultHost != null) {
			this.defaultHost.start();
		}

		var hosts = this.getHosts();
		for (var i=0; i<hosts.length; i++) {
			var host = hosts[i];
			host.start();
		}
	},

	startServers: function() {
		if (this.servers != null) {
			for (var i=0; i<this.servers.length; i++) {
				var server = this.servers[i];
				server.start();
			}
		}
	},

	/*startServices: function() {
		this.getServices().start();
	},*/

	stop: function() {
		this.stopHelper();
		//this.stopRealms();
		/*this.stopServices();
		this.stopRouters();*/
		this.stopServers();
		this.stopClients();
		this.callSuper("stop");
	},

	stopClients: function() {
		if (this.clients != null) {
			for (var i=0; i<this.clients.length; i++) {
				var client = this.clients[i];
				client.stop();
			}
		}
	},

	stopHelper: function() {
		if (this.getHelper() != null) {
			this.getHelper().stop();
		}
	},

/*protected synchronized void stopRealms() throws Exception {
    if (this.realms != null) {
        for (Realm realm : this.realms) {
            realm.stop();
        }
    }
}*/

	stopRouters: function() {
		var hosts = this.getHosts();
		for (var i=0; i<hosts.length; i++) {
			var host = hosts[i];
			host.stop();
		}

		if (this.defaultHost != null) {
			this.defaultHost.stop();
		}

		if (this.internalRouter != null) {
			this.internalRouter.stop();
		}
	},

	stopServers: function() {
		if (this.servers != null) {
			for (var i=0; i<this.servers.length; i++) {
				var server = this.servers[i];
				server.stop();
			}
		}
	},

	/*stopServices: function() {
		this.getServices().stop();
	},*/

	updateHosts: function() {
		this.getHelper().update();
	}
});