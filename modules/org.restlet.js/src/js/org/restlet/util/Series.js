var Series = new Class({
	initialize: function() {
		this.array = [];
	},

	size: function() {
		return this.array.length;
	},
	
	add: function(name, value) {
		return this.array.push(this.createEntry(name, value));
	},

	equals: function(value1, value2, ignoreCase) {
		var result = (value1 == value2);

		if (!result) {
			if ((value1 != null) && (value2 != null)) {
				if (ignoreCase) {
					result = value1.equalsIgnoreCase(value2);
				} else {
					result = value1.equals(value2);
				}
			}
		}

		return result;
	},

	getFirst: function(name, ignoreCase) {
		if (ignoreCase==null) {
			ignoreCase = false;
		}

		for (var i=0; i<this.array.length; i++) {
			var param = this.array[i];
			if (this.equals(param.getName(), name, ignoreCase)) {
				return param;
			}
		}

		return null;
	},

	getFirstValue: function() {
		var name = arguments[0];
		var ignoreCase= false;
		var defaultValue = null;
		if (arguments.length==2 && typeof arguments[1] == "string") {
			defaultValue = arguments[1];
		} else if (arguments.length==2) {
			ignoreCase = arguments[1]
		}

		var result = defaultValue;
		var param = this.getFirst(name, ignoreCase);

		if ((param != null) && (param.getValue() != null)) {
			result = param.getValue();
		}

		return result;
	},

	//public String getFirstValue(String name, String defaultValue) {

	getNames: function() {
		var result = [];

		for (var i=0; i<this.array.length; i++) {
			var param = this.array[i];
			result.push(param.getName());
		}

		return result;
	},

	getValues: function(name, separator, ignoreCase) {
		if (separator==null) {
			separator = ",";
		}
		if (ignoreCase==null) {
			ignoreCase = true;
		}
		var result = null;
		var sb = null;

		for (var i=0; i<this.array.length; i++) {
			var param = this.array[i];
			if ((ignoreCase && param.getName().equalsIgnoreCase(name))
					|| param.getName().equals(name)) {
				if (sb == null) {
					if (result == null) {
						result = param.getValue();
					} else {
						sb = new StringBuilder();
						sb.append(result).append(separator)
								.append(param.getValue());
					}
				} else {
					sb.append(separator).append(param.getValue());
				}
			}
		}

		if (sb != null) {
			result = sb.toString();
		}

		return result;
	},

	getValuesArray: function() {
		var name = arguments[0];
		var ignoreCase= false;
		var defaultValue = null;
		if (arguments.length==2 && typeof arguments[1] == "string") {
			defaultValue = arguments[1];
		} else if (arguments.length==2) {
			ignoreCase = arguments[1]
		}

		var result = null;
		var params = this.subList(name, ignoreCase);

		if ((params.size() == 0) && (defaultValue != null)) {
			result = [];
			result.push(defaultValue);
		} else {
			result = [];

			for (var i = 0; i < params.length; i++) {
				result.push(params.get[i].getValue());
			}
		}

		return result;
	},

	getValuesMap: function() {
		var result = {};

		for (var i=0; i<this.array.length; i++) {
			if (!result[param.getName()]) {
				result[param.getName()] = param.getValue();
			}
		}

		return result;
	},

	removeAll: function(name, ignoreCase) {
		if (ignoreCase==null) {
			ignoreCase = false;
		}

		var changed = false;
		var param = null;

		for (var i=0; i<this.array.length; i++) {
			var param = this.array[i];

			if (this.equals(param.getName(), name, ignoreCase)) {
				this.array.splice(i, i);
				i--;
				changed = true;
			}
		}

		return changed;
	},

	removeFirst: function(name, ignoreCase) {
		if (ignoreCase==null) {
			ignoreCase = false;
		}
		var changed = false;
		var param = null;

		for (var i=0; i<this.array.length && !changed; i++) {
			param = this.array[i];
			if (this.equals(param.getName(), name, ignoreCase)) {
				this.array.splice(i, i);
				i--;
				changed = true;
			}
		}

		return changed;
	},

	set: function(name, value, ignoreCase) {
		if (ignoreCase==null) {
			ignoreCase = false;
		}
		var result = null;
		var param = null;
		var found = false;

		for (var i=0; i<this.array.length; i++) {
			param = this.array[i];

			if (this.equals(param.getName(), name, ignoreCase)) {
				if (found) {
					// Remove other entries with the same name
					iter.remove();
					this.array.splice(i, i);
					i--;
				} else {
					// Change the value of the first matching entry
					found = true;
					param.setValue(value);
					result = param;
				}
			}
		}

		if (!found) {
			this.add(name, value);
		}

		return result;
		
	},

	subList: function(name, ignoreCase) {
		if (ignoreCase==null) {
			ignoreCase = false;
		}

		var result = [];

		for (var i=0; i<this.array.length; i++) {
			if (this.equals(param.getName(), name, ignoreCase)) {
				result.add(param);
			}
		}

		return result;
	}

});