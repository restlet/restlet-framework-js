var Template = new [class Class]({
    initialize: function() {
    	var pattern = arguments[0];
    	var matchingMode = Template.MODE_EQUALS;
    	var defaultType = [class Variable].TYPE_ALL;
        var defaultDefaultValue = "";
        var defaultRequired = true
        var defaultFixed = false
        var encodingVariables = false;
        if (arguments.length==2) {
        	matchingMode = arguments[1];
        } else if (arguments.length==6) {
        	matchingMode = arguments[1];
        	defaultType = arguments[2];
            defaultDefaultValue = arguments[3];
            defaultRequired = arguments[4];
            defaultFixed = arguments[5];
        } else if (arguments.length==7) {
        	matchingMode = arguments[1];
        	defaultType = arguments[2];
            defaultDefaultValue = arguments[3];
            defaultRequired = arguments[4];
            defaultFixed = arguments[5];
            encodingVariables = arguments[6];
        }

        //this.logger = (logger == null) ? [class Context].getCurrentLogger() : logger;
        this.pattern = pattern;
        this.defaultVariable = new [class Variable](defaultType, defaultDefaultValue,
                defaultRequired, defaultFixed);
        this.matchingMode = matchingMode;
        this.variables = {};
        this.regexPattern = null;
        this.encodingVariables = encodingVariables;
    },

    format: function(values) {
    	if (arguments.length==1 && !arguments[0] instanceof Resolver) {
    		var values = arguments[0];
    		return this.formatFromResolver([class Resolver].createResolver(values));
    	} else if (arguments.length==1 && arguments[0] instanceof Resolver) {
    		var resolver = arguments[0];
    		return this.formatFromResolver(resolver);
    	} else if (arguments.length==2) {
    		var request = arguments[0];
    		var response = arguments[1];
    		return this.formatFromResolver([class Resolver].createResolver(request, response));
    	}
    },

    formatFromResolver: function(resolver) {
        var result = new [class StringBuilder]();
        var varBuffer = null;
        var next;
        var inVariable = false;
        var patternLength = this.getPattern().length();
        for (var i = 0; i < patternLength; i++) {
            next = this.getPattern().charAt(i);

            if (inVariable) {
                if ([class Reference].isUnreserved(next)) {
                    // Append to the variable name
                    varBuffer.append(next);
                } else if (next == '}') {
                    // End of variable detected
                    if (varBuffer.length() == 0) {
                        /*getLogger().warning(
                                "Empty pattern variables are not allowed : "
                                        + this.regexPattern);*/
                    } else {
                        var varName = varBuffer.toString();
                        var varValue = resolver.resolve(varName);

                        var varb = this.getVariables().get(varName);

                        // Use the default values instead
                        if (varValue == null) {
                            if (varb == null) {
                            	varb = this.getDefaultVariable();
                            }

                            if (varb != null) {
                                varValue = varb.getDefaultValue();
                            }
                        }

                        var varValueString = (varValue == null) ? null
                                : varValue.toString();

                        if (this.encodingVariables) {
                            // In case the values must be encoded.
                            if (varb != null) {
                                result.append(varb.encode(varValueString));
                            } else {
                                result.append([class Reference].encode(varValueString));
                            }
                        } else {
                            if ((varb != null) && varb.isEncodingOnFormat()) {
                                result.append([class Reference].encode(varValueString));
                            } else {
                                result.append(varValueString);
                            }
                        }

                        // Reset the variable name buffer
                        varBuffer = new [class StringBuilder]();
                    }
                    inVariable = false;
                } else {
                    /*getLogger().warning(
                            "An invalid character was detected inside a pattern variable : "
                                    + this.regexPattern);*/
                }
            } else {
                if (next == '{') {
                    inVariable = true;
                    varBuffer = new [class StringBuilder]();
                } else if (next == '}') {
                    /*getLogger().warning(
                            "An invalid character was detected inside a pattern variable : "
                                    + this.regexPattern);*/
                } else {
                    result.append(next);
                }
            }
        }
        return result.toString();
    },

    getDefaultVariable: function() {
        return this.defaultVariable;
    },

    getLogger: function() {
        return this.logger;
    },

    getMatchingMode: function() {
        return this.matchingMode;
    },

    getPattern: function() {
        return this.pattern;
    },

    getRegexPattern: function() {
        if (this.regexPattern == null) {
            this.getRegexVariables().clear();
            var patternBuffer = new [class StringBuilder]();
            var varBuffer = null;
            var next;
            var inVariable = false;
            for (var i = 0; i < this.getPattern().length; i++) {
                next = this.getPattern().charAt(i);

                if (inVariable) {
                    if ([class Reference].isUnreserved(next)) {
                        // Append to the variable name
                        varBuffer.append(next);
                    } else if (next == '}') {
                        // End of variable detected
                        if (varBuffer.length() == 0) {
                            /*getLogger().warning(
                                    "Empty pattern variables are not allowed : "
                                            + this.regexPattern);*/
                        } else {
                            var varName = varBuffer.toString();
                            var varIndex = this.getRegexVariables()
                                    .indexOf(varName);

                            if (varIndex != -1) {
                                // The variable is used several times in
                                // the pattern, ensure that this
                                // constraint is enforced when parsing.
                                patternBuffer.append("\\"
                                        + (varIndex + 1));
                            } else {
                                // New variable detected. Insert a
                                // capturing group.
                                this.getRegexVariables().add(varName);
                                var varb = this.getVariables().get(
                                        varName);
                                if (varb == null) {
                                    varb = this.getDefaultVariable();
                                }
                                patternBuffer
                                        .append(getVariableRegex(varb));
                            }

                            // Reset the variable name buffer
                            varBuffer = new [class StringBuilder]();
                        }
                        inVariable = false;

                    } else {
                        /*getLogger().warning(
                                "An invalid character was detected inside a pattern variable : "
                                        + this.regexPattern);*/
                    }
                } else {
                    if (next == '{') {
                        inVariable = true;
                        varBuffer = new [class StringBuilder]();
                    } else if (next == '}') {
                        /*getLogger().warning(
                                "An invalid character was detected inside a pattern variable : "
                                        + this.regexPattern);*/
                    } else {
                        patternBuffer.append(this.quote(next));
                    }
                }
            }

            this.regexPattern = patternBuffer
                    .toString();
        }

        return this.regexPattern;
    },

    getRegexVariables: function() {
        // Lazy initialization with double-check.
        if (this.regexVariables==null) {
        	this.regexVariables = [];
        }
        return this.regexVariables;
    },

    getVariableNames: function() {
        var result = [];
        var varBuffer = null;
        var next;
        var inVariable = false;
        var pattern = this.getPattern();

        for (var i = 0; i < pattern.length(); i++) {
            next = pattern.charAt(i);

            if (inVariable) {
                if ([class Reference].isUnreserved(next)) {
                    // Append to the variable name
                    varBuffer.append(next);
                } else if (next == '}') {
                    // End of variable detected
                    if (varBuffer.length() == 0) {
                        /*getLogger().warning(
                                "Empty pattern variables are not allowed : "
                                        + this.pattern);*/
                    } else {
                        result.add(varBuffer.toString());

                        // Reset the variable name buffer
                        varBuffer = new [class StringBuilder]();
                    }

                    inVariable = false;
                } else {
                    /*getLogger().warning(
                            "An invalid character was detected inside a pattern variable : "
                                    + this.pattern);*/
                }
            } else {
                if (next == '{') {
                    inVariable = true;
                    varBuffer = new StringBuilder();
                } else if (next == '}') {
                    /*getLogger().warning(
                            "An invalid character was detected inside a pattern variable : "
                                    + this.pattern);*/
                }
            }
        }

        return result;
    },

    getVariables: function() {
        return this.variables;
    },

    isEncodingVariables: function() {
        return this.encodingVariables;
    },

    match: function(formattedString) {
        var result = -1;

        try {
            if (formattedString != null) {
            	var regexPattern = this.getRegexPattern();
                var matcher = new RegExp(regexPattern);//.matcher(
                        //formattedString);

            	var index = -1;
                if ((this.getMatchingMode() == [class Template].MODE_EQUALS) && matcher.test(formattedString)) {
                    //result = matcher.end();
                	result = formattedString.length;
                } else if ((this.getMatchingMode() == [class Template].MODE_STARTS_WITH)
                        && (index=formattedString.search(regexPattern))!=-1) {
                    result = index;
                }
            }
        } catch (err) {
            this.getLogger().warning(
                    "StackOverflowError exception encountered while matching this string : "
                            + formattedString, err);
        }

        return result;
    },

    parse: function() {
    	var formattedString = arguments[0];
    	var variables = null;
    	var loggable = false;
    	if (arguments.length==2 && !arguments[1] instanceof [class Request]) {
    		variables = arguments[1];
    		loggable = true;
    	} else if (arguments.length==2 && arguments[1] instanceof [class Request]) {
    		variables = arguments[1].getAttributes();
    		loggable = arguments[1].isLoggable();
    	} else if (arguments.length==3) {
    		variables = arguments[1];
    		loggable = arguments[2];
    	}

        var result = -1;

        if (formattedString != null) {
            try {
            	var regexPattern = this.getRegexPattern();
                var matcher = new RegExp(regexPattern);//.matcher(
                //formattedString);
                var index = -1;
                var matched = ((this.getMatchingMode() == [class Template].MODE_EQUALS) && matcher
                        .test(formattedString))
                        || ((this.getMatchingMode() == [class Template].MODE_STARTS_WITH) && ((index=formattedString.search(regexPattern))!=-1));

                if (matched) {
                    // Update the number of matched characters
                	if ((this.getMatchingMode() == [class Template].MODE_EQUALS)) {
                		result = formattedString.length;
                	} else if ((this.getMatchingMode() == [class Template].MODE_STARTS_WITH)) {
                		result = index;
                	}

                    // Update the attributes with the variables value
                    var attributeName = null;
                    var attributeValue = null;

                    for (var i = 0; i < this.getRegexVariables().length; i++) {
                        attributeName = this.getRegexVariables()[i];
                        attributeValue = matcher.group(i + 1);
                        var varb = this.getVariables().get(attributeName);

                        if ((varb != null) && varb.isDecodingOnParse()) {
                            attributeValue = [class Reference].decode(attributeValue);
                        }

                        /*if (loggable) {
                            getLogger().fine(
                                    "Template variable \"" + attributeName
                                            + "\" matched with value \""
                                            + attributeValue + "\"");
                        }*/

                        variables.put(attributeName, attributeValue);
                    }
                }
            } catch (err) {
                this.getLogger().warning(
                        "StackOverflowError exception encountered while matching this string : "
                                + formattedString, err);
            }
        }

        return result;
    },

    quote: function(character) {
        switch (character) {
        case '[':
            return "\\[";
        case ']':
            return "\\]";
        case '.':
            return "\\.";
        case '\\':
            return "\\\\";
        case '$':
            return "\\$";
        case '^':
            return "\\^";
        case '?':
            return "\\?";
        case '*':
            return "\\*";
        case '|':
            return "\\|";
        case '(':
            return "\\(";
        case ')':
            return "\\)";
        case ':':
            return "\\:";
        case '-':
            return "\\-";
        case '!':
            return "\\!";
        case '<':
            return "\\<";
        case '>':
            return "\\>";
        default:
        	//TODO: convert char to string with js
            //return [class Character].toString(character);
        	return character;
        }
    },

    setDefaultVariable: function(defaultVariable) {
        this.defaultVariable = defaultVariable;
    },

    setEncodingVariables: function(encodingVariables) {
        this.encodingVariables = encodingVariables;
    },

    setLogger: function(logger) {
        this.logger = logger;
    },

    setMatchingMode: function(matchingMode) {
        this.matchingMode = matchingMode;
    },

    setPattern: function(pattern) {
        this.pattern = pattern;
        this.regexPattern = null;
    },

    setVariables: function(variables) {
        if (variables != this.variables) {
            this.variables.clear();

            if (variables != null) {
                this.variables.putAll(variables);
            }
        }
    }
});

Template.extend({
	/** Mode where all characters must match the template and size be identical. */
	MODE_EQUALS: 2,
	/** Mode where characters at the beginning must match the template. */
	MODE_STARTS_WITH: 1,

    appendClass: function(pattern, content, required) {
        pattern.append("(");

        if (content.equals(".")) {
            // Special case for the TYPE_ALL variable type because the
            // dot looses its meaning inside a character class
            pattern.append(content);
        } else {
            pattern.append("[").append(content).append(']');
        }

        if (required) {
            pattern.append("+");
        } else {
            pattern.append("*");
        }

        pattern.append(")");
    },

    appendGroup: function(pattern, content, required) {
        pattern.append("((?:").append(content).append(')');

        if (required) {
            pattern.append("+");
        } else {
            pattern.append("*");
        }

        pattern.append(")");
    },

    getVariableRegex: function(variable) {
        var result = null;

        if (variable.isFixed()) {
        	//TODO: use native js regexp
            result = "(" + Pattern.quote(variable.getDefaultValue()) + ")";
        } else {
            // Expressions to create character classes
            var ALL = ".";
            var ALPHA = "a-zA-Z";
            var DIGIT = "\\d";
            var ALPHA_DIGIT = ALPHA + DIGIT;
            var HEXA = DIGIT + "ABCDEFabcdef";
            var URI_UNRESERVED = ALPHA_DIGIT + "\\-\\.\\_\\~";
            var URI_GEN_DELIMS = "\\:\\/\\?\\#\\[\\]\\@";
            var URI_SUB_DELIMS = "\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=";
            var URI_RESERVED = URI_GEN_DELIMS + URI_SUB_DELIMS;
            var WORD = "\\w";

            // Basic rules expressed by the HTTP rfc.
            var CRLF = "\\r\\n";
            var CTL = "\\p{Cntrl}";
            var LWS = CRLF + "\\ \\t";
            var SEPARATOR = "\\(\\)\\<\\>\\@\\,\\;\\:\\[\\]\"\\/\\\\?\\=\\{\\}\\ \\t";
            var TOKEN = "[^" + SEPARATOR + "]";
            var COMMENT = "[^" + CTL + "]" + "[^\\(\\)]" + LWS;
            var COMMENT_ATTRIBUTE = "[^\\;\\(\\)]";

            // Expressions to create non-capturing groups
            var PCT_ENCODED = "\\%[" + HEXA + "][" + HEXA + "]";
            // var PCHAR = "[" + URI_UNRESERVED + "]|(?:" + PCT_ENCODED
            // + ")|[" + URI_SUB_DELIMS + "]|\\:|\\@";
            var PCHAR = "[" + URI_UNRESERVED + URI_SUB_DELIMS
                    + "\\:\\@]|(?:" + PCT_ENCODED + ")";
            var QUERY = PCHAR + "|\\/|\\?";
            var FRAGMENT = QUERY;
            var URI_PATH = PCHAR + "|\\/";
            var URI_ALL = "[" + URI_RESERVED + URI_UNRESERVED
                    + "]|(?:" + PCT_ENCODED + ")";

            // Special case of query parameter characters
            var QUERY_PARAM_DELIMS = "\\!\\$\\'\\(\\)\\*\\+\\,\\;";
            var QUERY_PARAM_CHAR = "[" + URI_UNRESERVED
                    + QUERY_PARAM_DELIMS + "\\:\\@]|(?:" + PCT_ENCODED + ")";
            var QUERY_PARAM = QUERY_PARAM_CHAR + "|\\/|\\?";

            var coreRegex = new [class StringBuilder]();

            switch (variable.getType()) {
            case [class Variable].TYPE_ALL:
                appendClass(coreRegex, ALL, variable.isRequired());
                break;
            case [class Variable].TYPE_ALPHA:
                appendClass(coreRegex, ALPHA, variable.isRequired());
                break;
            case [class Variable].TYPE_DIGIT:
                appendClass(coreRegex, DIGIT, variable.isRequired());
                break;
            case [class Variable].TYPE_ALPHA_DIGIT:
                appendClass(coreRegex, ALPHA_DIGIT, variable.isRequired());
                break;
            case [class Variable].TYPE_URI_ALL:
                appendGroup(coreRegex, URI_ALL, variable.isRequired());
                break;
            case [class Variable].TYPE_URI_UNRESERVED:
                appendClass(coreRegex, URI_UNRESERVED, variable.isRequired());
                break;
            case [class Variable].TYPE_WORD:
                appendClass(coreRegex, WORD, variable.isRequired());
                break;
            case [class Variable].TYPE_URI_FRAGMENT:
                appendGroup(coreRegex, FRAGMENT, variable.isRequired());
                break;
            case [class Variable].TYPE_URI_PATH:
                appendGroup(coreRegex, URI_PATH, variable.isRequired());
                break;
            case [class Variable].TYPE_URI_QUERY:
                appendGroup(coreRegex, QUERY, variable.isRequired());
                break;
            case [class Variable].TYPE_URI_QUERY_PARAM:
                appendGroup(coreRegex, QUERY_PARAM, variable.isRequired());
                break;
            case [class Variable].TYPE_URI_SEGMENT:
                appendGroup(coreRegex, PCHAR, variable.isRequired());
                break;
            case [class Variable].TYPE_TOKEN:
                appendClass(coreRegex, TOKEN, variable.isRequired());
                break;
            case [class Variable].TYPE_COMMENT:
                appendClass(coreRegex, COMMENT, variable.isRequired());
                break;
            case [class Variable].TYPE_COMMENT_ATTRIBUTE:
                appendClass(coreRegex, COMMENT_ATTRIBUTE, variable.isRequired());
                break;
            }

            result = coreRegex.toString();
        }

        return result;
    }
});