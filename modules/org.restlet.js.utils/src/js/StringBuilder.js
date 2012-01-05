var StringBuilder = new Class({
	initialize: function(value) {
	    this.strings = new Array("");
	    this.append(value);
	},
	append: function(value) {
		if (value) {
			this.strings.push(value);
		}
	},
	clear: function() {
		this.strings.length = 1;
	},
	toString: function () {
		return this.strings.join("");
	},
	length: function() {
		return this.string.length;
	}
});
