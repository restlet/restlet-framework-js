var Expectation = new [class Class]({
    initialize: function(name, value) {
        this.name = name;
        this.value = value;
        this.parameters = [];
    },

    equals: function(obj) {
        // if obj == this no need to go further
        var result = (obj == this);

        if (!result) {
            result = obj instanceof Expectation;

            // if obj isn't an expectation or is null don't evaluate further
            if (result) {
                var that = obj;
                result = (((that.getName() == null) && (this.getName() == null)) || ((this.getName() != null) && this.getName()
                        .equals(that.getName())));

                // if names are both null or equal continue
                if (result) {
                    result = (((that.getValue() == null) && (this.getValue() == null)) || ((this.getValue() != null) && this.getValue()
                            .equals(that.getValue())));

                    if (result) {
                        result = this.getParameters().equals(that.getParameters());
                    }
                }
            }
        }

        return result;
    },

    getName: function() {
        return this.name;
    },

    getParameters: function() {
        return this.parameters;
    },

    getValue: function() {
        return this.value;
    },

    setName: function(name) {
        this.name = name;
    },

    setParameters: function(parameters) {
    	this.parameters = parameters;
    },

    setValue: function(value) {
        this.value = value;
    },

    toString: function() {
        return "Expectation [name=" + this.name + ", parameters=" + this.parameters
                + ", value=" + this.value + "]";
    }
});

Expectation.extend({
	continueResponse: function() {
		return new Expectation("100-continue");
	    //return new Expectation([class HeaderConstants].EXPECT_CONTINUE);
	}
});