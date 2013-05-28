var ChallengeWriter = new [class Class]([class HeaderWriter], {
	initialize: function() {
		this.callSuperCstr();
        this.firstChallengeParameter = true;
	},

	append: function(value) {
		return this;
	},

	appendChallengeParameter: function(parameter) {
		return this.appendChallengeParameter(parameter.getName(),
					parameter.getValue());
	},

	appendChallengeParameter: function(name) {
		this.appendChallengeParameterSeparator();
		this.appendToken(name);
		return this;
	},

	appendChallengeParameter: function(name, value) {
	    this.appendChallengeParameterSeparator();
	
	    if (name != null) {
	    	this.appendToken(name);
	    }
	
	    if (value != null) {
	    	this.append('=');
	    	this.appendToken(value);
	    }
	
	    return this;
	},
	
	appendChallengeParameterSeparator: function() {
	    if (this.isFirstChallengeParameter()) {
	    	this.setFirstChallengeParameter(false);
	    } else {
	    	this.append(", ");
	    }
	
	    return this;
	},
	
	appendQuotedChallengeParameter: function(parameter) {
	    return this.appendQuotedChallengeParameter(parameter.getName(),
	            parameter.getValue());
	},
	
	appendQuotedChallengeParameter: function(name, value) {
		this.appendChallengeParameterSeparator();
	
	    if (name != null) {
	    	this.appendToken(name);
	    }
	
	    if (value != null) {
	    	this.append('=');
	    	this.appendQuotedString(value);
	    }
	
	    return this;
	},
	
	isFirstChallengeParameter: function() {
	    return this.firstChallengeParameter;
	},
	
	setFirstChallengeParameter: function(firstValue) {
	    this.firstChallengeParameter = firstValue;
	}
});