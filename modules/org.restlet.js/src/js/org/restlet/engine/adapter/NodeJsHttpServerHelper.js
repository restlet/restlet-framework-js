var NodeJsHttpServerHelper = new [class Class]([class HttpServerHelper], {
	initialize: function(server, protocol) {
		this.callSuperCstr(server);
		this.confidential = false;
        this.getProtocols().add([class Protocol].HTTP);
    },

    isConfidential: function() {
    	return this.confidential;
    },
    
    setConfidential: function() {
    	this.confidential = confidential;
    },
    
	start: function() {
        var addr = "127.0.0.1";
        if (this.getHelped().getAddress()!=null) {
        	addr = this.getHelped().getAddress();
        }
        var port = this.getHelped().getPort();

        var currentThis = this;
        http.createServer(function (request, response) {
        	currentThis.getLogger().info("-> incoming request : "+request.url);
        	currentThis.handle(
                    new [class NodeJsHttpServerCall](currentThis.getHelped(), request, response,
                            currentThis.isConfidential()));
        }).listen(port, addr);
        console.log("Server running at http://"+addr+":"+port+"/");

        //setConfidential(false);

        this.callSuper("start");
	}
});