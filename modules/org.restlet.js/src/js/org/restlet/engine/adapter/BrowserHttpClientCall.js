var BrowserHttpClientCall = new [class Class]([class ClientCall], {
	initialize: function() {
		this.callSuper();
		this.xhr = this.createXhrObject();
	},
	getAcceptHeader: function() {
		for (var i=0; i<this.requestHeaders.length; i++) {
			var requestHeader = this.requestHeaders[i];
			if (requestHeader.getName()==[class HeaderConstants].HEADER_ACCEPT) {
				return requestHeader.getValue();
			}
		}
		return null;
	},
	sendRequest: function(request, callback) {
		var method = request.getMethod().getName();
		var acceptHeader = this.getAcceptHeader();
		if (method=="GET" && acceptHeader=="application/jsonp") {
			this.sendRequestWithJsonp(request, callback);
		} else {
			this.sendRequestWithXhr(request, callback);
		}
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
	sendRequestWithXhr: function(request, callback) {
		var currentThis = this;
		var response = new [class Response](request);
		var url = request.getResourceRef().toString(true, true);
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
		var debugHandler = [class Engine].getInstance().getDebugHandler();
		if (debugHandler!=null && debugHandler.beforeSendingRequest!=null) {
			debugHandler.beforeSendingRequest(url, method, requestHeaders, data);
		}
		this.lowLevelSendRequest(url, method, requestHeaders, data, function(xhr) {
			currentThis.extractResponseHeaders(xhr);

			var representation = new Representation();
			representation = HeaderUtils.extractEntityHeaders(
								currentThis.getResponseHeaders(), representation);
			representation.write(xhr);
			var status = new [class Status](xhr.status, xhr.statusText);
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
	sendRequestWithJsonp: function(request, callback) {
		var callbackName = "jsonpReceiver" + (new Date()).getTime();
		var url = request.getResourceRef().toString(true, true)+"&callback="+callbackName;
		
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
	    script.type = "text/javascript";
	    script.src = url;
	    head.appendChild(script);

	    var currentThis = this;
		var response = new [class Response](request);
		var method = request.getMethod().getName();
		this.method = request.getMethod();
		var clientInfo = request.getClientInfo();
		var requestHeaders = {};
		var data = "";
		var debugHandler = Engine.getInstance().getDebugHandler();
		if (debugHandler!=null && debugHandler.beforeSendingRequest!=null) {
			debugHandler.beforeSendingRequest(url, method, requestHeaders, data);
		}
		window[callbackName] = function(data) {
			var status = new [class Status](200, "OK");
			response.setStatus(status);
			var representation = new [class JsonRepresentation]();
			representation.setObject(data);
			response.setEntity(representation);
			callback(response);
			window[callbackName] = null;
			head.removeChild(script);
		};
	},
	extractResponseHeaders: function(xhr) {
		var headersString = xhr.getAllResponseHeaders();
		var headers = [];
		var headerEntries = headersString.split("\n");
		for (var cpt=0;cpt<headerEntries.length;cpt++) {
			var headerEntry = headerEntries[cpt];
			var index = headerEntry.indexOf(":");
			if (headerEntry!="" && index!=-1) {
				var header = new [class Parameter](
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