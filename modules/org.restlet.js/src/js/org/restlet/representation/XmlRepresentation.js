// [ifndef nodejs]
var XmlRepresentation = new [class Class]([class DomRepresentation], {
	initialize: function(content, objectName) {
		if (typeof this.text == "undefined") {
			this.text = null;
		}
		this.representation = null;
		if (typeof content == "string") {
			this.text = content;
		} else if (content instanceof [class Representation]) {
			this.representation = content;
		} else if (typeof content == "object") {
			this.obj = content;
		}
		this.objectName = objectName;
		this.setMediaType([class MediaType].APPLICATION_XML);
	},
	createDocument: function(namespaceURL, rootTagName) {
	  if (document.implementation && document.implementation.createDocument) { 
	    return document.implementation.createDocument(namespaceURL, rootTagName, null); 
	  } else {
		var doc = new ActiveXObject("MSXML2.DOMDocument"); 
	    if (rootTagName) { 
	      var prefix = ""; 
	      var tagname = rootTagName; 
	      var p = rootTagName.indexOf(':'); 
	      if (p != -1) { 
	        prefix = rootTagName.substring(0, p); 
	        tagname = rootTagName.substring(p+1); 
	      }
	      if (namespaceURL) { 
	        if (!prefix) prefix = "a0"; 
	      } else prefix = ""; 
	      var text = "<" + (prefix?(prefix+":"):"") +  tagname + 
	             (namespaceURL 
	             ?(" xmlns:" + prefix + '="' + namespaceURL +'"') 
	             :"") + 
	             "/>"; 
	      doc.loadXML(text); 
	    }
	    return doc; 
	  } 
	},
	serializeObject: function(document, element, obj) {
		for (var elt in obj) {
			var eltElement = document.createElement(elt);
			if (typeof obj[elt]!="object") {
				var textElement = document.createTextNode(obj[elt]);
				eltElement.appendChild(textElement);
			} else {
				this.serializeObject(document, eltElement, obj[elt]);
			}
			element.appendChild(eltElement);
		}
	},
	getObjectName: function() {
		if (this.objectName!=null) {
			return this.objectName;
		} else {
			return "object";
		}
	},
	getText: function() {
		var document = this.createDocument("", this.getObjectName());
		this.serializeObject(document, document.childNodes[0], this.obj);
		if (document.xml==undefined){ 
			return (new XMLSerializer()).serializeToString(document); 
		} else {
			return document.xml; 
		}
	},
	unserializeObject: function(obj, element) {
		var children = element.childNodes;
		for (var cpt=0; cpt<children.length; cpt++) {
			var child = children[cpt];
			if (child.childNodes.length==1 && child.childNodes[0].nodeName=="#text") {
				obj[child.nodeName] = child.childNodes[0].nodeValue;
			} else {
				obj[child.nodeName] = {};
				this.unserializeObject(obj[child.nodeName], child);
			}
		}
	},
	getObject: function() {
		if (this.obj!=null) {
			return this.obj;
		}

		var xml = null;
		if (window.ActiveXObject) {
			var doc = new ActiveXObject("Microsoft.XMLDOM"); 
			document.async = "false"; 
			document.loadXML(this.text);
			xml = document;
		} else { 
			var parser = new DOMParser(); 
			xml = parser.parseFromString(this.text, "text/xml"); 
		} 

		var obj = {};
		this.unserializeObject(obj, xml.childNodes[0]);
		return obj;
	}
});
// [enddef]