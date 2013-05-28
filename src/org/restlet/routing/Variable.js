var Variable = new [class Class]({
    initialize: function() {
    	var type = Variable.TYPE_ALL;
    	var defaultValue = "";
    	var required = true;
        var fixed = false;
        var decodingOnParse = false;
        var encodingOnFormat = false;
    	if (arguments.length==1) {
    		type = arguments[0];
    	} else if (arguments.length==4) {
    		type = arguments[0];
        	defaultValue = arguments[1];
        	required = arguments[2];
            fixed = arguments[3];
    	} else if (arguments.length==6) {
    		type = arguments[0];
        	defaultValue = arguments[1];
        	required = arguments[2];
            fixed = arguments[3];
            decodingOnParse = arguments[4];
            encodingOnFormat = arguments[5];
    	}

        this.type = type;
        this.defaultValue = defaultValue;
        this.required = required;
        this.fixed = fixed;
        this.decodingOnParse = decodingOnParse;
        this.encodingOnFormat = encodingOnFormat;
    },

    encode: function(value) {
        switch (this.type) {
        case [class Variable].TYPE_URI_ALL:
            return [class Reference].encode(value);
        case [class Variable].TYPE_URI_UNRESERVED:
            return [class Reference].encode(value);
        case [class Variable].TYPE_URI_FRAGMENT:
            return [class Reference].encode(value);
        case [class Variable].TYPE_URI_PATH:
            return [class Reference].encode(value);
        case [class Variable].TYPE_URI_QUERY:
            return [class Reference].encode(value);
        case [class Variable].TYPE_URI_SEGMENT:
            return [class Reference].encode(value);
        default:
            return value;
        }
    },

    getDefaultValue: function() {
        return this.defaultValue;
    },

    getType: function() {
        return this.type;
    },

    isDecodingOnParse: function() {
        return this.decodingOnParse;
    },

    isEncodingOnFormat: function() {
        return this.encodingOnFormat;
    },

    isFixed: function() {
        return this.fixed;
    },

    isRequired: function() {
        return this.required;
    },

    setDecodingOnParse: function(decodingOnParse) {
        this.decodingOnParse = decodingOnParse;
    },

    setDefaultValue: function(defaultValue) {
        this.defaultValue = defaultValue;
    },

    setEncodingOnFormat: function(encodingOnFormat) {
        this.encodingOnFormat = encodingOnFormat;
    },

    setFixed: function(fixed) {
        this.fixed = fixed;
    },

    setRequired: function(required) {
        this.required = required;
    },

    setType: function(type) {
        this.type = type;
    }
});

Variable.extend({
	/** Matches all characters. */
	TYPE_ALL: 1,
	/** Matches all alphabetical characters. */
	TYPE_ALPHA: 2,
	/** Matches all alphabetical and digital characters. */
	TYPE_ALPHA_DIGIT: 3,
	/** Matches any TEXT excluding "(" and ")". */
	TYPE_COMMENT: 4,
	/** Matches any TEXT inside a comment excluding ";". */
	TYPE_COMMENT_ATTRIBUTE: 5,
	/** Matches all digital characters. */
	TYPE_DIGIT: 6,
	/** Matches any CHAR except CTLs or separators. */
	TYPE_TOKEN: 7,
	/** Matches all URI characters. */
	TYPE_URI_ALL: 8,
	/** Matches URI fragment characters. */
	TYPE_URI_FRAGMENT: 9,
	/** Matches URI path characters (not the query or the fragment parts). */
	TYPE_URI_PATH: 10,
	/** Matches URI query characters. */
	TYPE_URI_QUERY: 11,
	/** Matches URI query parameter characters (name or value). */
	TYPE_URI_QUERY_PARAM: 12,
	/** Matches URI scheme characters. */
	TYPE_URI_SCHEME: 13,
	/** Matches URI segment characters. */
	TYPE_URI_SEGMENT: 14,
	/** Matches unreserved URI characters. */
	TYPE_URI_UNRESERVED: 15,
	/** Matches all alphabetical and digital characters plus the underscore. */
	TYPE_WORD: 16
});