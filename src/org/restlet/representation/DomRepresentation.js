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
			this.setSize(this.text.length);
			this.setAvailable(true);
		} else if (content instanceof [class Representation]) {
			this.representation = content;
			this.text = this.representation.getText();
			this.setAvailable(this.representation.isAvailable());
		} else if (typeof content == "object") {
	        // [ifndef nodejs]
			if (content instanceof Document) {
				this.xml = content;
			} else {
				this.obj = content;
			}
			// [enddef]
			// [ifdef nodejs] uncomment
			//this.xml = content;
			/*var text = this.getText();
			this.setSize(text.length);*/
			this.setSize([class Representation].UNKNOWN_SIZE);
			this.setAvailable(true);
			// [enddef]
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
			//return new xmldom.XMLSerializer().serializeToString(this.xml);
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
			//return new xmldom.DOMParser().parseFromString(this.representation.getText());
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
			//return new xmldom.DOMParser().parseFromString(this.text, "text/xml");
			// [enddef]
		} else {
			return this.xml;
		}
	}
});