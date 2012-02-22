var Metadata = new Class({
	initialize: function(name, description) {
		if (description==null) {
			description = "Encoding applied to a representation";
		}
        this.name = name;
        this.description = description;
    },
    getName: function() {
    	return this.name;
    },
    getDescription: function() {
    	return this.description;
    },
    toString: function() {
    	return this.getName();
    }
});
