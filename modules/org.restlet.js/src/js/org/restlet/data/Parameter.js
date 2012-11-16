var Parameter = new [class Class]({
	initialize: function(name, value) {
		this.name = name;
		this.value = value;
	},
	getName: function() {
		return this.name;
	},
	getValue: function() {
		return this.value;
	}
});
exports.Parameter = Parameter;