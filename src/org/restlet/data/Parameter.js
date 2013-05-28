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
	},

	compareTo: function(o) {
        return this.getName().compareTo(o.getName());
    },

	encode: function() {
		if (arguments.length==1) {
			this._encodeTwoParams(arguments[0]);
		} else if (arguments.length==2) {
			this._encodeTwoParams(arguments[0], arguments[1]);
		}
	},

    _encodeTwoParams: function(buffer, characterSet) {
        if (this.getName() != null) {
            buffer.append([class Reference].encode(getName(), characterSet));

            if (this.getValue() != null) {
                buffer.append('=');
                buffer.append([class Reference].encode(this.getValue(), characterSet));
            }
        }
    },

    _encodeOneParam: function(characterSet) {
        var sb = new [class StringBuilder]();
        this._encodeTwoParams(sb, characterSet);
        return sb.toString();
    },

    equals: function(obj) {
        // if obj == this no need to go further
        var result = (obj == this);

        if (!result) {
            result = obj instanceof Parameter;

            // if obj isn't a parameter or is null don't evaluate further
            if (result) {
                var that = obj;
                result = (((that.getName() == null) && (this.getName() == null)) || ((this.getName() != null) && this.getName()
                        .equals(that.getName())));

                // if names are both null or equal continue
                if (result) {
                    result = (((that.getValue() == null) && (this.getValue() == null)) || ((this.getValue() != null) && this.getValue()
                            .equals(that.getValue())));
                }
            }
        }

        return result;
    }
});

Parameter.extend({
	create: function(name, value) {
	    if (value != null) {
	        return new Parameter(name.toString(), value.toString());
	    } else {
	        return new Parameter(name.toString(), null);
	    }
	}
});

exports.Parameter = Parameter;