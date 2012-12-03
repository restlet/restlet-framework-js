var Parameter = new [class Class]({
	initialize: function(name, value) {
		this.name = name;
		this.value = value;
	},
	getName: function() {
		return this.name;
	},
	setName: function(name) {
		this.name = name;
	},
	getValue: function() {
		return this.value;
	},
	setValue: function(value) {
		this.value = value;
	}
});
exports.Parameter = Parameter;