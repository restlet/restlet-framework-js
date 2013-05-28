var JsonRepresentation = new [class Class]([class Representation], { 
	initialize: function(content) {
		if (typeof this.text == "undefined") {
			this.text = null;
		}
		this.obj = null;
		this.representation = null;
		if (typeof content == "string") {
			this.text = content;
			this.setSize(this.text.length);
			this.setAvailable(true);
	        // [ifndef nodejs]
			this.obj = window.jsonParse(this.text);
			// [enddef]
			// [ifdef nodejs] uncomment
			//this.obj = JSON.parse(this.text);
			// [enddef]
	        // [ifndef nodejs]
			this.text = window.JSON.stringify(this.obj);
			// [enddef]
			// [ifdef nodejs] uncomment
			//this.text = JSON.stringify(this.obj);
			// [enddef]
		} else if (content instanceof [class Representation]) {
			this.representation = content;
	        // [ifndef nodejs]
			this.obj = window.jsonParse(this.representation.getText());
			// [enddef]
			// [ifdef nodejs] uncomment
			//this.obj = JSON.parse(this.representation.getText());
			// [enddef]
			this.setAvailable(true);
		} else if (typeof content == "object") {
			this.obj = content;
	        // [ifndef nodejs]
			this.text = window.JSON.stringify(this.obj);
			// [enddef]
			// [ifdef nodejs] uncomment
			//this.text = JSON.stringify(this.obj);
			// [enddef]
			this.setSize(this.text.length);
			this.setAvailable(true);
		}
		this.setMediaType([class MediaType].APPLICATION_JSON);
	},
	getText: function() {
		return this.text;
	},
    getAvailableSize: function() {
        return this.getText().length;
    },
	setObject: function(obj) {
		this.obj = obj
	},
	getObject: function() {
		return this.obj; 
	}
});