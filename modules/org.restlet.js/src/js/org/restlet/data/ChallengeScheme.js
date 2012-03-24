var ChallengeScheme = new Class({
	initialize: function(name, technicalName, description) {
		this.name = name;
		this.description = description;
		this.technicalName = technicalName;
	},

    equals: function(object) {
        return (object instanceof ChallengeScheme)
                && ((ChallengeScheme) object).getName().equalsIgnoreCase(
                        getName());
    },

    getDescription: function() {
        return this.description;
    },

    getName: function() {
        return name;
    },

    getTechnicalName: function() {
        return this.technicalName;
    },

    setTechnicalName: function(technicalName) {
        this.technicalName = technicalName;
    },

    toString: function() {
        return this.getName();
    }
});

ChallengeScheme.extend({
	HTTP_BASIC: new ChallengeScheme(
	        "HTTP_BASIC", "Basic", "Basic HTTP authentication"),
	HTTP_COOKIE: new ChallengeScheme(
	        "HTTP_Cookie", "Cookie", "Cookie HTTP authentication"),
	HTTP_DIGEST = new ChallengeScheme(
	        "HTTP_DIGEST", "Digest", "Digest HTTP authentication")
});
