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
	    return null; // not supported
	},
	sendRequest: function(request, callback) {
		var currentThis = this;
		var response = new Response(request);
		var url = request.getReference().getUrl();
		var method = request.getMethod().getName();
		this.method = request.getMethod();
		var clientInfo = request.getClientInfo();
		var requestHeaders = {};
		for (var i=0; i<this.requestHeaders.length; i++) {
			var requestHeader = this.requestHeaders[i];
			requestHeaders[requestHeader.getName()] = requestHeader.getValue();
		}
		var data = "";
		if (request.getEntity()!=null) {
			data = request.getEntity().getText();
		}
		var debugHandler = Engine.getInstance().getDebugHandler();
		if (debugHandler!=null && debugHandler.beforeSendingRequest!=null) {
			debugHandler.beforeSendingRequest(url, method, requestHeaders, data);
		}
		this.lowLevelSendRequest(url, method, requestHeaders, data, function(xhr) {
			currentThis.extractResponseHeaders(xhr);

			var representation = new Representation();
			representation = HeaderUtils.extractEntityHeaders(
								currentThis.getResponseHeaders(xhr), representation);
			representation.write(xhr);
			var status = new Status(xhr.status, xhr.statusText);
			response.setStatus(status);
			response.setEntity(representation);
			if (debugHandler!=null && debugHandler.afterReceivedResponse!=null) {
				var responseHeaders = {};
				for (var i=0; i<currentThis.responseHeaders.length; i++) {
					var header = currentThis.responseHeaders[i];
					responseHeaders[header.getName()] = header.getValue();
				}
				debugHandler.afterReceivedResponse(xhr.status, xhr.statusText, responseHeaders, representation.getText());
			}
			callback(response);
		});
	},
	extractResponseHeaders: function(xhr) {
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
		this.setResponseHeaders(headers);
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