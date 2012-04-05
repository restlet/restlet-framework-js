var DomRepresentation = new [class Class]([class Representation], { 
	initialize: function(content) {
		if (typeof this.text == "undefined") {
			this.text = null;
		}
		if (typeof this.xml == "undefined") {
			this.xml = null;
		}
		this.representation = null;
		if (typeof content == "string") {
			this.text = content;
		} else if (content instanceof [class Representation]) {
			this.representation = content;
		} else if (typeof content == "object") {
	        // [ifndef nodejs]
			if (content instanceof Document) {
			// [enddef]
			// [ifdef nodejs] uncomment
			//if (content instanceof libxmljs.Document) {
			// [enddef]
				this.xml = content;
			} else {
				this.obj = content;
			}
		}
		this.setMediaType([class MediaType].APPLICATION_XML);
	},
	getText: function() {
		if (this.xml!=null) {
	        // [ifndef nodejs]
			var document = this.xml.documentElement; 
			if (document.xml==undefined){ 
				return (new XMLSerializer()).serializeToString(this.xml); 
			} else {
				return document.xml; 
			}
			// [enddef]
			// [ifdef nodejs] uncomment
			//return this.xml.toString();
			// [enddef]
		}
		return "";
	},
	getXml: function() {
		if (this.representation!=null) {
	        // [ifndef nodejs]
			return this.representation.getXml();
			// [enddef]
			// [ifdef nodejs] uncomment
			//return libxmljs.parseXmlString(this.representation.getText());
			// [enddef]
		} else if (this.text!=null) {
	        // [ifndef nodejs]
			if (window.ActiveXObject) {
				var doc = new ActiveXObject("Microsoft.XMLDOM"); 
				document.async="false"; 
				document.loadXML(this.text);
				return document;
			} else { 
				var parser = new DOMParser(); 
				return parser.parseFromString(this.text, "text/xml"); 
			} 
			// [enddef]
			// [ifdef nodejs] uncomment
			//return libxmljs.parseXmlString(this.text);
			// [enddef]
		} else {
			return this.xml;
		}
	}
});