var JsonRepresentation = new [class Class]([class Representation], { 
	initialize: function(content) {
		if (typeof this.text == "undefined") {
			this.text = null;
		}
		this.obj = null;
		this.representation = null;
		if (typeof content == "string") {
			this.text = content;
		} else if (content instanceof [class Representation]) {
			this.representation = content;
		} else if (typeof content == "object") {
			this.obj = content;
		}
		this.setMediaType([class MediaType].APPLICATION_JSON);
	},
	getText: function() {
		if (this.obj!=null) {
	        // [ifndef nodejs]
			return window.JSON.stringify(this.obj);
			// [enddef]
			// [ifdef nodejs] uncomment
			//return JSON.stringify(this.obj);
			// [enddef]
		} else {
			return "";
		}
	},
	setObject: function(obj) {
		this.obj = obj
	},
	getObject: function() {
		if (this.text!=null) {
	        // [ifndef nodejs]
			return window.jsonParse(this.text);
			// [enddef]
			// [ifdef nodejs] uncomment
			//return JSON.parse(this.text);
			// [enddef]
		} else if (this.representation!=null) {
	        // [ifndef nodejs]
			return window.jsonParse(this.representation.getText());
			// [enddef]
			// [ifdef nodejs] uncomment
			//return JSON.parse(this.representation.getText());
			// [enddef]
		} else if (this.obj!=null) {
			return this.obj; 
		} else {
			return null;
		}
	}
});