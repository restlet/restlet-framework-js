var Header = new [class Class]({
    initialize: function(name, value) {
        this.name = name;
        this.value = value;
    },

    equals: function(obj) {
        // if obj == this no need to go further
        var result = (obj == this);

        if (!result) {
            result = obj instanceof Header;

            // if obj isn't a header or is null don't evaluate further
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
    },

    getName: function() {
        return name;
    },

    getValue: function() {
        return value;
    },

    setName: function(name) {
        this.name = name;
    },

    setValue: function(value) {
        this.value = value;
    },

    toString: function() {
        return "[" + this.getName() + ": " + this.getValue() + "]";
    }
});