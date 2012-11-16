var StringBuilder = new Class({
	initialize: function(value) {
	    this.strings = new Array("");
	    this.append(value);
	},
	append: function(value) {
		if (value) {
			this.strings.push(value);
		}
		return this;
	},
	clear: function() {
		this.strings.length = 1;
	},
	toString: function () {
		return this.strings.join("");
	},
	length: function() {
		return this.strings.join("").length;
	},
	substring: function(start, end) {
		return this.strings.join("").substring(start, end);
	},
	charAt: function(pos) {
		return this.strings.join("").charAt(pos);
	},
	delete: function(start, end) {
		var string = this.strings.join("");
		var startString = string.substring(0, start);
		var endString = string.substring(end);
		
	    this.strings = new Array("");
	    this.append(startString);
	    this.append(endString);
	}
});

module.exports = StringBuilder;