var HeaderReader = new [class Class]({
	initialize: function(header) {
        this.header = header;
        this.index = ((header == null) || (header.length == 0)) ? -1 : 0;
        this.mark = this.index;
	},
    addValues: function(values) {
        try {
            // Skip leading spaces
        	this.skipSpaces();

            do {
                // Read the first value
                var nextValue = this.readValue();
                if (this.canAdd(nextValue, values)) {
                    // Add the value to the list
                    values.push(nextValue);
                }

                // Attempt to skip the value separator
                this.skipValueSeparator();
            } while (this.peek() != -1);
        } catch (err) {
        	console.log(err.stack);
            [class Context].getCurrentLogger().log([class Level].INFO,
                    "Unable to read a header", err);
        }
    },
    canAdd: function(value, values) {
        if (value!=null) {
        	for (var cpt=0;cpt<values.length;cpt++) {
        		if (values[cpt]==value) {
        			return false;
        		}
        	}
        }
        return true;
    },
    createParameter: function(name, value) {
        return new Parameter(name, value);
    },
    mark: function() {
        this.mark = this.index;
    },
    peek: function() {
        var result = -1;

        if (this.index != -1) {
            result = this.header.charAt(this.index);
        }

        return result;
    },
    read: function() {
        var result = -1;

        if (this.index >= 0) {
            result = this.header.charAt(this.index++);

            if (this.index >= this.header.length) {
                this.index = -1;
            }
        }
        return result;
    },
    readComment: function() {
        var result = null;
        var next = this.read();

        // First character must be a parenthesis
        if (next == '(') {
            var buffer = new [class StringBuilder]();

            while (result == null) {
                next = this.read();

                if ([class HeaderUtils].isCommentText(next)) {
                    buffer.append(next);
                } else if ([class HeaderUtils].isQuoteCharacter(next)) {
                    // Start of a quoted pair (escape sequence)
                    buffer.append(this.read());
                } else if (next == '(') {
                    // Nested comment
                    buffer.append('(').append(this.readComment()).append(')');
                } else if (next == ')') {
                    // End of comment
                    result = buffer.toString();
                } else if (next == -1) {
                    throw new Error(
                            "Unexpected end of comment. Please check your value");
                } else {
                    throw new Error("Invalid character \"" + next
                            + "\" detected in comment. Please check your value");
                }
            }
        } else {
            throw new Error("A comment must start with a parenthesis");
        }

        return result;
    },
    readDigits: function() {
        var sb = new [class StringBuilder]();
        var next = this.read();

        while ([class HeaderUtils].isTokenChar(next)) {
            sb.append(next);
            next = this.read();
        }

        // Unread the last character (separator or end marker)
        this.unread();

        return sb.toString();
    },
    readNamedValue: function(resultClass) {
    	var result = null;
    	var name = this.readToken();
    	var nextChar = this.read();

    	if (name.length > 0) {
    		if (nextChar == '=') {
    			// The parameter has a value
    			result = HeaderReader.createNamedValue(resultClass, name,
    					this.readActualNamedValue());
    		} else {
    			// The parameter has not value
    			this.unread();
    			result = HeaderReader.createNamedValue(resultClass, name);
    		}
    	} else {
    		throw new Error(
    			"Parameter or extension has no name. Please check your value");
    	}

    	return result;
    },
    readParameter: function() {
        var result = null;
        var name = this.readToken();
        var nextChar = this.read();

        if (name.length > 0) {
            if (nextChar == '=') {
                // The parameter has a value
                result = this.createParameter(name, this.readParameterValue());
            } else {
                // The parameter has not value
            	this.unread();
                result = this.createParameter(name);
            }
        } else {
            throw new Error(
                    "Parameter or extension has no name. Please check your value");
        }

        return result;
    },
    readParameterValue: function() {
         var result = null;

        // Discard any leading space
        this.skipSpaces();

        // Detect if quoted string or token available
        var nextChar = this.peek();

        if ([class HeaderUtils].isDoubleQuote(nextChar)) {
            result = this.readQuotedString();
        } else if ([class HeaderUtils].isTokenChar(nextChar)) {
            result = this.readToken();
        }

        return result;
    },
    readQuotedString: function() {
        var result = null;
        var next = this.read();

        // First character must be a double quote
        if ([class HeaderUtils].isDoubleQuote(next)) {
            var buffer = new [class StringBuilder]();

            while (result == null) {
                next = this.read();

                if ([class HeaderUtils].isQuotedText(next)) {
                    buffer.append(next);
                } else if ([class HeaderUtils].isQuoteCharacter(next)) {
                    // Start of a quoted pair (escape sequence)
                    buffer.append(this.read());
                } else if ([class HeaderUtils].isDoubleQuote(next)) {
                    // End of quoted string
                    result = buffer.toString();
                } else if (next == -1) {
                    throw new Error(
                            "Unexpected end of quoted string. Please check your value");
                } else {
                    throw new Error(
                            "Invalid character \""
                                    + next
                                    + "\" detected in quoted string. Please check your value");
                }
            }
        } else {
            throw new Error(
                    "A quoted string must start with a double quote");
        }

        return result;
    },
    readRawText: function() {
        // Read value until end or space
        var sb = null;
        var next = this.read();

        while ((next != -1) && ![class HeaderUtils].isSpace(next) && ![class HeaderUtils].isComma(next)) {
            if (sb == null) {
                sb = new [class StringBuilder]();
            }

            sb.append(next);
            next = this.read();
        }

        // Unread the separator
        if ([class HeaderUtils].isSpace(next) || [class HeaderUtils].isComma(next)) {
            this.unread();
        }

        return (sb == null) ? null : sb.toString();
    },
    readRawValue: function() {
        // Skip leading spaces
    	this.skipSpaces();

        // Read value until end or comma
        var sb = null;
        var next = this.read();

        while ((next != -1) && ![class HeaderUtils].isComma(next)) {
            if (sb == null) {
                sb = new [class StringBuilder]();
            }

            sb.append(next);
            next = this.read();
        }

        // Remove trailing spaces
        if (sb != null) {
            for (var i = sb.length() - 1; (i >= 0)
                    && [class HeaderUtils].isLinearWhiteSpace(sb.charAt(i)); i--) {
                sb.deleteCharAt(i);
            }
        }

        // Unread the separator
        if ([class HeaderUtils].isComma(next)) {
        	this.unread();
        }

        return (sb == null) ? null : sb.toString();
    },
    readToken: function() {
        var sb = new [class StringBuilder]();
        var next = this.read();

        while ([class HeaderUtils].isTokenChar(next)) {
            sb.append(next);
            next = this.read();
        }
        
        // Unread the last character (separator or end marker)
        this.unread();

        return sb.toString();
    },
    /*public V readValue() throws IOException {
        return null;
    },*/
    readValues: function() {
        var result = [];
        this.addValues(result);
        return result;
    },
    reset: function() {
        this.index = this.mark;
    },
    skipParameterSeparator: function() {
        var result = false;
        // Skip leading spaces
        this.skipSpaces();
        // Check if next character is a parameter separator
        if ([class HeaderUtils].isSemiColon(this.read())) {
            result = true;
            // Skip trailing spaces
            this.skipSpaces();
        } else {
            // Probably reached the end of the header
        	this.unread();
        }
        return result;
    },
    skipSpaces: function() {
        var result = false;
        var next = this.peek();

        while ([class HeaderUtils].isLinearWhiteSpace(next) && (next != -1)) {
            result = result || [class HeaderUtils].isLinearWhiteSpace(next);
            this.read();
            next = this.peek();
        }

        return result;
    },
    skipValueSeparator: function() {
        var result = false;
        this.skipSpaces();
        if ([class HeaderUtils].isComma(this.read())) {
            result = true;
            this.skipSpaces();
        } else {
        	this.unread();
        }
        return result;
    },
	unread: function() {
        if (this.index > 0) {
            this.index--;
        }
    }
});

HeaderReader.extend({
    createNamedValue: function(resultClass, name, value) {
        try {
            return new resultClass(name, value);
        } catch (err) {
            /*Context.getCurrentLogger().log(Level.WARNING,
                    "Unable to create named value", e);*/
        	console.log(err.stack);
            return null;
        }
    },
    readDate: function(date, cookie) {
        if (cookie) {
            return DateUtils.parse(date, [class DateUtils].FORMAT_RFC_1036);
        }

        return DateUtils.parse(date, [class DateUtils].FORMAT_RFC_1123);
    },
    readHeader: function(header) {
        var result = null;

        if (header.length > 0) {
            // Detect the end of headers
            var start = 0;
            var index = 0;
            var next = header.charAt(index++);

            if (HeaderUtils.isCarriageReturn(next)) {
                next = header.charAt(index++);

                if (![class HeaderUtils].isLineFeed(next)) {
                    throw new Error(
                            "Invalid end of headers. Line feed missing after the carriage return.");
                }
            } else {
                result = new Parameter();

                // Parse the header name
                while ((index < header.length) && (next != ':')) {
                    next = header.charAt(index++);
                }

                if (index == header.length) {
                    throw new Error(
                            "Unable to parse the header name. End of line reached too early.");
                }

                result.setName(header.substring(start, index - 1).toString());
                next = header.charAt(index++);

                while ([class HeaderUtils].isSpace(next)) {
                    // Skip any separator space between colon and header value
                    next = header.charAt(index++);
                }

                start = index - 1;

                // Parse the header value
                result.setValue(header.substring(start, header.length)
                        .toString());
            }
        }

        return result;
    }
});