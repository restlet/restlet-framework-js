var Language = new Class(Metadata, {
    initialize: function(name, description) {
        if (description==null) {
        	description = "Language or range of languages";
        }
        this.callSuper(name, description);
        this.subTags = null;
    },

    equals: function(object) {
        return (object instanceof Language)
                && this.getName().equalsIgnoreCase(object.getName());
    },

    getParent: function() {
        var result = null;

        if ((this.getSubTags() != null) && !this.getSubTags().isEmpty()) {
            result = Language.valueOf(this.getPrimaryTag());
        } else {
            result = this.equals(Language.ALL) ? null : Language.ALL;
        }

        return result;
    },

    getPrimaryTag: function() {
        var separator = this.getName().indexOf('-');

        if (separator == -1) {
            return this.getName();
        }

        return this.getName().substring(0, separator);
    },

    getSubTags: function() {
        if (this.subTags==null) {
        	this.subTags = [];
            if (this.getName() != null) {
                var tags = this.getName().split("-");
                var tokens = [];
                if (tags.length > 0) {
                    for (var i = 1; i < tags.length; i++) {
                        tokens.push(tags[i]);
                    }
                }
                this.subTags = tokens;
            }
        }
        return this.subTags;
    },

    includes: function(included) {
        var result = this.equals(Language.ALL) || (included == null) || this.equals(included);

        if (!result && (included instanceof Language)) {
            var includedLanguage = included;

            if (this.getPrimaryTag().equals(includedLanguage.getPrimaryTag())) {
                // Both languages are different
                if (this.getSubTags().equals(includedLanguage.getSubTags())) {
                    result = true;
                } else if (this.getSubTags().isEmpty()) {
                    result = true;
                }
            }
        }

        return result;
    }
});

Language.extend({
	/** All languages acceptable. */
	ALL: new Language("*", "All languages"),
	/** English language. */
	ENGLISH: new Language("en", "English language"),
	/** English language spoken in USA. */
	ENGLISH_US: new Language("en-us", "English language in USA"),
	/** French language. */
	FRENCH: new Language("fr", "French language"),
	/** French language spoken in France. */
	FRENCH_FRANCE: new Language("fr-fr", "French language in France"),
	/** Spanish language. */
	SPANISH: new Language("es", "Spanish language"),

	valueOf: function(name) {
		var result = null;

		if ((name != null) && !name.equals("")) {
			if (name.equalsIgnoreCase(Language.ALL.getName())) {
				result = Language.ALL;
			} else if (name.equalsIgnoreCase(Language.ENGLISH.getName())) {
				result = Language.ENGLISH;
			} else if (name.equalsIgnoreCase(Language.ENGLISH_US.getName())) {
				result = Language.ENGLISH_US;
			} else if (name.equalsIgnoreCase(Language.FRENCH.getName())) {
				result = Language.FRENCH;
			} else if (name.equalsIgnoreCase(Language.FRENCH_FRANCE.getName())) {
				result = Language.FRENCH_FRANCE;
			} else if (name.equalsIgnoreCase(Language.SPANISH.getName())) {
				result = Language.SPANISH;
			} else {
				result = new Language(name);
			}
		}

		return result;
	}
});