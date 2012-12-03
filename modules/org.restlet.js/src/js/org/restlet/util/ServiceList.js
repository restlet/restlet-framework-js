var ServiceList = new [class Class]([class Array], {
    initialize: function(context) {
        //super(new CopyOnWriteArrayList<Service>());
        this.context = context;
    },

    add: function() {
    	var service = null;
    	var index = null;
    	if (arguments.length==1) {
    		service = arguments[0];
    	} else if (arguments.length==2) {
    		index = arguments[0];
    		service = arguments[1];
    	}
        service.setContext(this.getContext());
        
        if (index!=null) {
        	this.callSuper("add", index, service);
        } else {
            this.callSuper("add", service);
        }
    },

    addAll: function() {
    	var services = null;
    	var index = null;
    	if (arguments.length==1) {
    		services = arguments[0];
    	} else if (arguments.length==2) {
    		index = arguments[0];
    		services = arguments[1];
    	}

    	if (services != null) {
            for (var i=0; i<this.length; i++) {
            	var service = this[i];
                service.setContext(this.getContext());
            }
        }

    	if (index!=null) {
            return this.callSuper("addAll", index, services);
    	} else {
            return this.callSuper("addAll", services);
    	}
    },

    get: function(clazz) {
        for (var i=0; i<this.length; i++) {
        	var service = this[i];
            if (service instanceof clazz) {
                return service;
            }
        }

        return null;
    },

    getContext: function() {
        return this.context;
    },

    set: function(param) {
    	if (param instanceof ServiceList) {
    		this.setForServices(param);
    	} else {
    		this.setForService(param);
    	}
    },

    setForServices: function(services) {
        this.clear();

        if (services != null) {
            this.addAll(services);
        }
    },

    setForService: function(newService) {
        var services = [];
        var service;
        var replaced = false;

        for (var i = 0; (i < size()); i++) {
            service = this.get(i);

            if (service != null) {
                if (service.getClass().isAssignableFrom(newService.getClass())) {
                    try {
                        service.stop();
                    } catch (err) {
                        [class Context].getCurrentLogger().log([class Level].WARNING,
                                "Unable to stop service replaced", err);
                    }

                    services.add(newService);
                    replaced = true;
                } else {
                    services.add(service);
                }
            }
        }

        if (!replaced) {
            services.add(newService);
        }

        this.set(services);
    },

    setContext: function(context) {
        this.context = context;

        for (var i=0; i<this.length; i++) {
        	var service = this[i];
            service.setContext(context);
        }
    },

    start: function() {
        for (var i=0; i<this.length; i++) {
        	var service = this[i];
            service.start();
        }
    },

    stop: function() {
        for (var i=0; i<this.length; i++) {
        	var service = this[i];
            service.stop();
        }
    }
});