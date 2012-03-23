var HeaderWriter = new Class({
    initialize: function() {
    	this.content = [];
    },

    append: function(text) {
		this.content.push(text);
		return this;
	},
	
	toString: function() {
		return this.content.join("");
	},

    appendCollection: function(values) {
        if ((values != null) && !values.isEmpty()) {
            var first = true;

            for (var i=0; i<values.length; i++) {
            	var value = values[i];
                if (this.canWrite(value)) {
                    if (first) {
                        first = false;
                    } else {
                        this.appendValueSeparator();
                    }

                    if (typeof value == "string") {
                    	this.append(value);
                    } else {
                    	this.appendObject(value);
                    }
                }
            }
        }

        return this;
    },

	appendComment: function(content) {
        this.append("(");
        var c;

        for (var i = 0; i < content.length(); i++) {
            c = content.charAt(i);

            if (HeaderUtils.isCommentText(c)) {
                this.append(c);
            } else {
            	this.appendQuotedPair(c);
            }
        }

        return this.append(")");
    },

    appendExtension: function(extension) {
        if (extension != null) {
            return this.appendExtension(extension.getName(), extension.getValue());
        } else {
            return this;
        }
    },

    appendExtension: function(name, value) {
        if ((name != null) && (name.length() > 0)) {
            this.append(name);

            if ((value != null) && (value.length() > 0)) {
            	this.append("=");

                if (HeaderUtils.isToken(value)) {
                	this.append(value);
                } else {
                	this.appendQuotedString(value);
                }
            }
        }

        return this;
    },

    appendParameterSeparator: function() {
        return this.append(";");
    },

    appendProduct: function(name, version) {
        this.appendToken(name);

        if (version != null) {
            this.append("/").appendToken(version);
        }

        return this;
    },

    appendQuotedPair: function(character) {
        return this.append("\\").append(character);
    },

    appendQuotedString: function(content) {
        if ((content != null) && (content.length() > 0)) {
            this.append("\"");
            var c;

            for (var i = 0; i < content.length(); i++) {
                c = content.charAt(i);

                if (HeaderUtils.isQuotedText(c)) {
                    this.append(c);
                } else {
                    this.appendQuotedPair(c);
                }
            }

            this.append("\"");
        }

        return this;
    },

    appendSpace: function() {
        return this.append(" ");
    },

    appendToken: function(token) {
        if (HeaderUtils.isToken(token)) {
            return this.append(token);
        } else {
            throw new Error(
                    "Unexpected character found in token: " + token);
        }
    },

    appendUriEncoded: function(source, characterSet) {
        return this.append(Reference.encode(source.toString(), characterSet));
    },

    appendValueSeparator: function() {
        return this.append(", ");
    },

    canWrite: function(value) {
        return (value != null);
    }
});