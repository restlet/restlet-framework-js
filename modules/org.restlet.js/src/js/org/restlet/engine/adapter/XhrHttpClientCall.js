var XhrHttpClientCall = new Class(ClientCall, {
	initialize: function() {
		this.callSuper();
		this.xhr = this.createXhrObject();
	},
	createXhrObject: function() {
	    if (window.XMLHttpRequest)
	        return new XMLHttpRequest();
	 
	    if (window.ActiveXObject) {
	        var names = [
	            "Msxml2.XMLHTTP.6.0",
	            "Msxml2.XMLHTTP.3.0",
	            "Msxml2.XMLHTTP",
	            "Microsoft.XMLHTTP"
	        ];
	        for(var i in names) {
	            try{ return new ActiveXObject(names[i]); }
	            catch(e){}
	        }
	    }
	    //window.alert("Votre navigateur ne prend pas en charge l'objet XMLHTTPRequest.");
	    return null; // not supported
	},
	sendRequest: function(request, callback) {
		console.log("> xhr.sendRequest");
		var currentThis = this;
		var response = new Response(request);
		var url = request.getReference().getUrl();
		var method = request.getMethod().getName();
		this.method = request.getMethod();
		var clientInfo = request.getClientInfo();
		var headers = {};
		for (var i=0; i<this.requestHeaders.length; i++) {
			var requestHeader = this.requestHeaders[i];
			headers[requestHeader.getName()] = requestHeader.getValue();
		}
		var data = "";
		if (request.getEntity()!=null) {
			data = request.getEntity().getText();
		}
		console.log("> xhr.lowLevelSendRequest");
		this.lowLevelSendRequest(url, method, headers, data, function(xhr) {
			console.log("> xhr.lowLevelSendRequest -> callback");
			currentThis.extractResponseHeaders(xhr);

			var representation = new Representation();
			representation = HeaderUtils.extractEntityHeaders(
								currentThis.getResponseHeaders(xhr), representation);
			representation.write(xhr);
			var status = new Status(xhr.status);
			response.setStatus(status);
			response.setEntity(representation);
			callback(response);
		});
	},
	extractResponseHeaders: function(xhr) {
		console.log("> extractResponseHeaders");
		var headersString = xhr.getAllResponseHeaders();
		var headers = [];
		var headerEntries = headersString.split("\n");
		for (var cpt=0;cpt<headerEntries.length;cpt++) {
			var headerEntry = headerEntries[cpt];
			var index = headerEntry.indexOf(":");
			if (headerEntry!="" && index!=-1) {
				var header = new Parameter(
						headerEntry.substring(0, index),
						headerEntry.substring(index+1));
				headers.push(header);
			}
		}
		//this.responseHeaders = headers;
		console.log("> this.responseHeaders = "+headers.length);
		console.log("b1");
		this.setResponseHeaders(headers);
		console.log("a1");
	},
	lowLevelSendRequest: function(url,httpMethod,headers,data,onResponseCallback) {
		var currentThis = this;
		currentThis.xhr.open(httpMethod, url);
		currentThis.xhr.onreadystatechange = function() {
			if (this.readyState==4) {
				onResponseCallback(currentThis.xhr);
			}
		};

		if (headers!=null) {
			for (var headerName in headers) {
				currentThis.xhr.setRequestHeader(headerName,headers[headerName]);
			}
		}
		  
		if (data!=null && data!="") {
			currentThis.xhr.send("" + data);
		} else {
			currentThis.xhr.send();
		}
	}
});