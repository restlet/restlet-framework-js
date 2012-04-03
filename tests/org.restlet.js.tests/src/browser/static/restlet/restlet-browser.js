// Utils

function copyElements(obj1, obj2) {
	for (var elt in obj1) {
		//console.log("copy "+elt+" ("+typeof obj1[elt]+")");
		if (elt!="initialize" || typeof obj1[elt] != "function") {
			//console.log("  -> ok");
			obj2[elt] = obj1[elt];
		} else {
			obj2["_"+elt] = obj1[elt];
		}
	}
}

var Class = function() {
	var parent = null;
	var content = null;
	if (arguments.length==1) {
		content = arguments[0];
	} else if (arguments.length==2) {
		parent = arguments[0];
		content = arguments[1];
	}
	
	var clazz = function() {
		//console.log("clazz.initializeExtend = "+clazz.initializeExtend);
		if (clazz.initializeExtend!=null && clazz.initializeExtend==true) {
			return;
		}
		if (content!=null && content["initialize"]!=null) {
			content["initialize"].apply(this, arguments);
		}
	}
	if (parent!=null) {
		copyElements(parent, clazz);
		parent.initializeExtend = true;
		//console.log("> new parent");
		clazz.prototype = new parent();
		//console.log("< new parent");
		clazz.parent = parent.prototype;
		parent.initializeExtend = null;
		copyElements(content, clazz.prototype);
		//console.log("adding call super");
		clazz.prototype["callSuper"] = function() {
			//console.log("clazz.parent.prototype = "+clazz.parent.prototype);
			/*console.log("clazz.parent = "+clazz.parent);
			for(var elt in clazz.parent) {
				console.log("- elt "+elt);
			}*/
			if (clazz.parent["_initialize"]!=null) {
				var superInitialize = clazz.parent["_initialize"];
				/*console.log("superInitialize = "+superInitialize);
				console.log("this = "+this);*/
				superInitialize.apply(this, arguments);
			}
		};
		//console.log("added call super");
	} else {
		clazz.prototype = {};
		copyElements(content, clazz.prototype);
	}
	//copyElements(parent, clazz);
	/*console.log("clazz.prototype:");
	for (var elt in clazz.prototype) {
		console.log(" - "+elt);
	}*/

	clazz.extend = function(content) {
		copyElements(content, this);
	};
	return clazz;
};

String.prototype.equalsIgnoreCase = function(arg) {               
    return (new String(this.toLowerCase())
             ==(new String(arg)).toLowerCase());
};
String.prototype.equals = function(arg) {
	return (this.toString()==arg.toString());
};
String.prototype.startsWith = function(arg) {
	if (this.length>=arg.length) {
		for (var i = 0; i<arg.length; i++) {
			if (this.charAt(i)!=arg.charAt(i)) {
				return false;
			}
		}
		return true;
	} else {
		return false;
	}
};

var StringBuilder = new Class({
	initialize: function(value) {
	    this.strings = new Array("");
	    this.append(value);
	},
	append: function(value) {
		if (value) {
			this.strings.push(value);
		}
		return this;
	},
	clear: function() {
		this.strings.length = 1;
	},
	toString: function () {
		return this.strings.join("");
	},
	length: function() {
		return this.string.length;
	}
});

Array.prototype.getFirstValue = function(key, ignoreCase) {
	for (var cpt=0; cpt<this.length; cpt++) {
		var elt = this[cpt];
		if (elt instanceof Parameter) {
			if (ignoreCase && elt.getName().equalsIgnoreCase(key)) {
				return elt;
			}
			if (!ignoreCase && elt.getName().equals(key)) {
				return elt;
			}
		}
	}
	return null;
};

Array.prototype.isEmpty = function() {
	return (this.length==0);
};

Array.prototype.size = function() {
	return this.length;
};

function isNumber(x) { 
	return ( (typeof x === typeof 1) && (null !== x) && isFinite(x) );
}

var DateFormat = new Class({
	initialize: function(formatPattern) {
		this.formatPattern = formatPattern;
	},
	_isPattern: function(character) {
		for(var cpt=0;cpt<DateFormat.PATTERN_CHARACTERS.length;cpt++) {
			if (character==DateFormat.PATTERN_CHARACTERS[cpt]) {
				return true;
			}
		}
		return false;
	},
	_getTokens: function(s) {
		var tokens = [];
		var currentToken = "";
		var previousCharacter = "";
		var quoteOpened = false;
		var pattern = false;
		for (var cpt=0;cpt<s.length;cpt++) {
			var c = s[cpt];
			if (quoteOpened) {
				currentToken += c;
				if (s[cpt]=="'") {
					tokens.push(currentToken);
					quoteOpened = false;
					currentToken = "";
				}
				previousCharacter = c;
				continue;
			}
			if (this._isPattern(s[cpt])) {
				pattern = true;
				if (previousCharacter==c) {
					currentToken += c;
				} else {
					if (currentToken!="") {
						tokens.push(currentToken);
					}
					currentToken = c;
				}
			} else if (c=="'") {
				quoteOpened = true;
				if (currentToken!="") {
					tokens.push(currentToken);
				}
				currentToken = c;
			} else {
				if (pattern) {
					tokens.push(currentToken);
					currentToken = s[cpt];
					pattern = false;
				} else {
					currentToken += s[cpt];
				}
			}
			previousCharacter = c;
		}
		if (currentToken!="") {
			tokens.push(currentToken);
		}
		return tokens;
	},
	_getDateTokens: function(tokens, s) {
		var currentIndex = 0;
		var dateTokens = [];
		for (var cpt=0;cpt<tokens.length; cpt++) {
			var token = tokens[cpt];
			dateTokens.push(s.substr(currentIndex, token.length));
			currentIndex += token.length;
		}
		return dateTokens;
	},
	_getShortDayInWeekIndex: function(shortDay) {
		for (var cpt=0;cpt<DateFormat.SHORT_DAYS_IN_WEEK.length;cpt++) {
			if (DateFormat.SHORT_DAYS_IN_WEEK[cpt]==shortDay) {
				return cpt;
			}
		}
		return -1;
	},
	_getDayInWeekIndex: function(day) {
		for (var cpt=0;cpt<DateFormat.DAYS_IN_WEEK.length;cpt++) {
			if (DateFormat.DAYS_IN_WEEK[cpt]==day) {
				return cpt;
			}
		}
		return -1;
	},
	_getShortMonthIndex: function(shortMonth) {
		for (var cpt=0;cpt<DateFormat.SHORT_MONTHS.length;cpt++) {
			if (DateFormat.SHORT_MONTHS[cpt]==shortMonth) {
				return cpt;
			}
		}
		return -1;
	},
	_getMonthIndex: function(month, shortNames) {
		var monthNames = shortNames ? DateFormat.SHORT_MONTHS : DateFormat.MONTHS;
		for (var cpt=0;cpt<monthNames.length;cpt++) {
			if (monthNames[cpt]==month) {
				return cpt;
			}
		}
		return -1;
	},
	_checkTokens: function(tokens, dateTokens) {
		if (tokens.length!=dateTokens.length) {
			throw new Error("Date doesn't match to pattern.");
		}
		for (var cpt=0;cpt<tokens.length;cpt++) {
			var token = tokens[cpt];
			var dateToken = dateTokens[cpt];
			if (token=="MM" || token=="dd" || token=="yyyy"
					|| token=="yy" || token=="HH"
					|| token=="mm" || token=="ss") {
				var error = false;
				try {
					var tmp = parseInt(dateToken);
					if (!isNumber(tmp)) {
						error = true;
					}
				} catch(err) {
					error = true;
				}
				if (error) {
					throw new Error("Unable to parse the token '"
							+dateToken+"' (format '"+token+"') as integer.");
				}
			}
		}
	},
	parse: function(s) {
		var tokens = this._getTokens(this.formatPattern);
		var dateTokens = this._getDateTokens(tokens, s);
		this._checkTokens(tokens, dateTokens);
		var date = new Date();
		date.setTime(0);
		for (var cpt=0;cpt<tokens.length;cpt++) {
			var token = tokens[cpt];
			var dateToken = dateTokens[cpt];
			if (token=="EEEE") {
				//Do nothing
			} else if(token=="EEE") {
				//Do nothing
			} else if(token=="MMMMM") {
				date.setMonth(this._getMonthIndex(dateToken, false));
			} else if(token=="MMM") {
				date.setMonth(this._getMonthIndex(dateToken, true));
			} else if(token=="MM") {
				date.setMonth(parseInt(dateToken)-1);
			} else if(token=="dd") {
				date.setDate(parseInt(dateToken));
			} else if(token=="yyyy") {
				date.setFullYear(parseInt(dateToken));
			} else if(token=="yy") {
				date.setYear(parseInt(dateToken));
			} else if(token=="HH") {
				date.setHours(parseInt(dateToken));
			} else if(token=="mm") {
				date.setMinutes(parseInt(dateToken));
			} else if(token=="ss") {
				date.setSeconds(parseInt(dateToken));
			} else if(token=="zzz") {
			} else if(token=="z") {
			} else if(token=="aaa") {
			} else if(token=="a") {
			}
		}
		return date;
	},
	format: function(date) {
		var formattedDate = "";
		var tokens = this._getTokens(this.formatPattern);
		for (var cpt=0;cpt<tokens.length;cpt++) {
			var token = tokens[cpt];
			if (token=="EEEE") {
				formattedDate += DateFormat.DAYS_IN_WEEK[date.getDay()];
			} else if(token=="EEE") {
				formattedDate += DateFormat.SHORT_DAYS_IN_WEEK[date.getDay()];
			} else if(token=="MMMMM") {
				formattedDate += DateFormat.MONTHS[date.getMonth()];
			} else if(token=="MMM") {
				formattedDate += DateFormat.SHORT_MONTHS[date.getMonth()];
			} else if(token=="MM") {
				if (date.getMonth()+1<10) {
					formattedDate += "0";
				}
				formattedDate += date.getMonth()+1;
			} else if(token=="dd") {
				if (date.getDate()<10) {
					formattedDate += "0";
				}
				formattedDate += date.getDate();
			} else if(token=="yyyy") {
				formattedDate += date.getFullYear();
			} else if(token=="yy") {
				if (date.getYear()<10) {
					formattedDate += "0";
				}
				formattedDate += date.getYear();
			} else if(token=="HH") {
				if (date.getHours()<10) {
					formattedDate += "0";
				}
				formattedDate += date.getHours();
			} else if(token=="mm") {
				if (date.getMinutes()<10) {
					formattedDate += "0";
				}
				formattedDate += date.getMinutes();
			} else if(token=="ss") {
				if (date.getSeconds()<10) {
					formattedDate += "0";
				}
				formattedDate += date.getSeconds();
			} else if(token=="zzz") {
				// Pacific Daylight Time
				formattedDate += "GMT";
			} else if(token=="z") {
				// PDT
				formattedDate += "GMT";
			} else if(token=="Z") {
				//+ or - value. for example -0700
			} else if(token=="aaa") {
			} else if(token=="a") {
				
			} else {
				formattedDate += token;
			}
		}
		return formattedDate;
	}
});

DateFormat.extend({
	PATTERN_CHARACTERS: ["E","M","d","H","m","s","y","z","a"],
	DAYS_IN_WEEK: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
	SHORT_DAYS_IN_WEEK: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
	MONTHS: ["January","February","March","April","May","June","July","August","September","October","November","December"],
	SHORT_MONTHS: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
});

//End Utils

// Restlet

var Context = new Class({
	initialize: function() {
		this.clientDispatcher = null;
	},
	getClientDispatcher: function() {
		return this.clientDispatcher;
	},
	setClientDispatcher: function(clientDispatcher) {
		this.clientDispatcher = clientDispatcher;
	}
});

var Protocol = new Class({
	initialize: function(schemeName,name,technicalName,description,
						defaultPort,confidential,version) {
		this.schemeName = schemeName;
		this.name = name;
		this.technicalName = technicalName;
        this.description = description;
        this.defaultPort = defaultPort;
        this.confidential = confidential;
        this.version = version;
	}
});

Protocol.extend({
	HTTP: new Protocol("http", "HTTP",
        "HyperText Transport Protocol", 80, false, "1.1"),
    HTTPS: new Protocol("https", "HTTPS", "HTTP",
        "HyperText Transport Protocol (Secure)", 443, true, "1.1")
});

var ClientInfo = new Class({
	initialize: function() {
        this.address = null;
        this.agent = null;
        this.port = -1;
        this.acceptedCharacterSets = [];
        this.acceptedEncodings = [];
        this.acceptedLanguages = [];
		this.acceptedMediaTypes = [];
		if (arguments.length==1 && arguments[0] instanceof MediaType) {
			this.acceptedMediaTypes.push(new Preference(arguments[0]));
		}
        this.forwardedAddresses = [];
        this.from = null;
	},
	
	getAddress: function() {
		return this.address;
	},
	getAgent: function() {
		return this.agent;
	},
	getPort: function() {
		return this.port;
	},
	getAcceptedCharacterSets: function() {
		return this.acceptedCharacterSets;
	},
	getAcceptedEncodings: function() {
		return this.acceptedEncodings;
	},
	getAcceptedLanguages: function() {
		return this.acceptedLanguages;
	},
	getAcceptedMediaTypes: function() {
		return this.acceptedMediaTypes;
	},
	getForwardedAddresses: function() {
		return this.forwardedAddresses;
	},
	getFrom: function() {
	    return this.from;
	}
});

var ServerInfo =new Class({
    initialize: function() {
        this.address = null;
        this.agent = null;
        this.port = -1;
        this.acceptingRanges = false;
    },
	getAcceptingRanges: function() {
		return this.acceptingRanges;
	},
	setAcceptingRanges: function(acceptingRanges) {
		this.acceptingRanges = acceptingRanges;
	},
	getAddress: function() {
		return this.address;
	},
	setAddress: function(address) {
		this.address = address;
	},
	getAgent: function() {
		return this.agent;
	},
	setAgent: function(agent) {
		this.agent = agent;
	},
	getPort: function() {
		return this.port;
	},
	setPort: function(port) {
		this.port = port;
	}
});

var Message = new Class({
	initialize: function(entity) {
    	this.attributes = null;
    	this.cacheDirectives = null;
    	this.date = null;
    	this.entity = entity;
    	this.entityText = null;
    	this.recipientsInfo = null;
	},

	getAttributes: function() {
		if (this.attributes==null) {
			this.attributes = {};
		}
		return this.attributes;
	}, 

	getCacheDirectives: function() {
		if (this.cacheDirectives==null) {
			this.cacheDirectives = [];
		}
		return this.cacheDirectives;
	}, 

	getDate: function() {
		return this.date;
	},

	getEntity: function() {
		return this.entity;
	},

	getEntityAsText: function() {
        if (this.entityText == null) {
            this.entityText = (this.getEntity() == null) ? null : this.getEntity()
                        .getText();
        }
        return this.entityText;
    },

    getRecipientsInfo: function() {
		if (this.recipientsInfo==null) {
			this.recipientsInfo = [];
		}
		return this.recipientsInfo;
	},

	getWarnings: function() {
		if (this.warnings==null) {
			this.warnings = [];
		}
		return this.warnings;
	},

    isConfidential: function() {
    	return false;
    },

    isEntityAvailable: function() {
        return (this.getEntity() != null) && this.getEntity().isAvailable();
    },

    release: function() {
        if (this.getEntity() != null) {
        	this.getEntity().release();
        }
    },

	setAttributes: function(attributes) {
		this.attributes = attributes;
	},

	setCacheDirectives: function(cacheDirectives) {
		this.cacheDirectives = cacheDirectives;
	}, 

	setDate: function(date) {
		this.date = date;
	},

	setEntity: function(entity) {
		if (arguments.length==1) {
			var entity = arguments[0];
			this.entity = entity;
		} else if (arguments.length==2) {
			var value = arguments[0];
			var mediaType = arguments[1];
			this.entity = new StringRepresentation(value, mediaType);
		}
	},

	setRecipientsInfo: function(recipientsInfo) {
		this.recipientsInfo = recipientsInfo;
	}, 

	setWarnings: function(warnings) {
		this.warnings = warnings;
	}
});

var Reference = new Class({
	initialize: function(urlString) {
		this.internalRef = urlString;
		var tmp = this.internalRef;
		var index = tmp.indexOf("://");
		if (index!=-1) {
			this.protocol = tmp.substring(0, index);
			tmp = tmp.substring(index+3);
		}
		index = tmp.indexOf(":");
		if (index!=-1) {
			this.host = tmp.substring(0, index);
			tmp = tmp.substring(index+1);
			index = tmp.indexOf("/");
			if (index!=-1) {
				this.port = parseInt(tmp.substring(0, index));
				tmp = tmp.substring(index);
				this.path = tmp;
			}
		} else {
			if (this.protocol=="http") {
				this.port = 80;
			} if (this.protocol=="https") {
				this.port = 443;
			}
			index = tmp.indexOf("/");
			if (index!=-1) {
				this.host = tmp.substring(0, index);
				tmp = tmp.substring(index);
				this.path = tmp;
			}			
		}
		
		this.updateIndexes();
	},
	getUrl: function() {
		return this.url;
	},
	getScheme: function() {
		return this.scheme;
	},
	getPort: function() {
		return this.port;
	},
	getHost: function() {
		return this.host;
	},
	getPath: function() {
		return this.path;
	},

	addQueryParameter: function() {
		var name = null;
		var value = null;
		if (arguments.length==1) {
			name = arguments[0].getName();
			value = arguments[0].getValue();
		} else if (arguments.length==2) {
			name = arguments[0];
			value = arguments[1];
		}
		
		var query = this.getQuery();

        if (query == null) {
            if (value == null) {
            	this.setQuery(Reference.encode(name));
            } else {
            	this.setQuery(Reference.encode(name) + '=' + Reference.encode(value));
            }
        } else {
            if (value == null) {
            	this.setQuery(query + '&' + Reference.encode(name));
            } else {
                this.setQuery(query + '&' + Reference.encode(name) + '=' + Reference.encode(value));
            }
        }

        return this;
    },

    addQueryParameters: function(parameters) {
        for (var i=0; i<parameters.length; i++) {
        	var param = parameters[i];
            this.addQueryParameter(param);
        }

        return this;
    },

    addSegment: function(value) {
        var path = this.getPath();

        if (value != null) {
            if (path == null) {
                this.setPath("/" + value);
            } else {
                if (path.endsWith("/")) {
                	this.setPath(path + Reference.encode(value));
                } else {
                	this.setPath(path + "/" + Reference.encode(value));
                }
            }
        }

        return this;
    },

    clone: function() {
        var newRef = new Reference();

        if (this.baseRef == null) {
            newRef.baseRef = null;
        } else if (this.equals(this.baseRef)) {
            newRef.baseRef = newRef;
        } else {
            newRef.baseRef = this.baseRef.clone();
        }

        newRef.fragmentIndex = this.fragmentIndex;
        newRef.internalRef = this.internalRef;
        newRef.queryIndex = this.queryIndex;
        newRef.schemeIndex = this.schemeIndex;
        return newRef;
    },

    encodeInvalidCharacters: function(uriRef) {
        var result = uriRef;

        if (uriRef != null) {
            var valid = true;

            // Ensure that all characters are valid, otherwise encode them
            for (var i = 0; valid && (i < uriRef.length); i++) {
                if (!Reference.isValid(uriRef.charCodeAt(i))) {
                    valid = false;
                    //Context.getCurrentLogger().fine(
                    //        "Invalid character detected in URI reference at index '"
                    //                + i + "': \"" + uriRef.charAt(i)
                    //                + "\". It will be automatically encoded.");
                } else if ((uriRef.charAt(i) == '%')
                        && (i > uriRef.length - 2)) {
                    // A percent encoding character has been detected but
                    // without the necessary two hexadecimal digits following
                    valid = false;
                    //Context.getCurrentLogger().fine(
                    //        "Invalid percent encoding detected in URI reference at index '"
                    //                + i + "': \"" + uriRef.charAt(i)
                    //                + "\". It will be automatically encoded.");
                }
            }

            if (!valid) {
                var sb = new StringBuilder();

                for (var i = 0; (i < uriRef.length); i++) {
                    if (Reference.isValid(uriRef.charCodeAt(i))) {
                        if ((uriRef.charAt(i) == "%")
                                && (i > uriRef.length - 2)) {
                            sb.append("%25");
                        } else {
                            sb.append(uriRef.charAt(i));
                        }
                    } else {
                        sb.append(Reference.encode(uriRef.charAt(i)));
                    }
                }

                result = sb.toString();
            }
        }

        return result;
    },

    equals: function(object) {
        if (object instanceof Reference) {
            var ref = object;
            if (this.internalRef == null) {
                return ref.internalRef == null;
            }
            return this.internalRef.equals(ref.internalRef);

        }

        return false;
    },

    _getAuthority: function() {
    	var part = this.isRelative() ? this.getRelativePart()
                : this.getSchemeSpecificPart();

        if ((part != null) && part.startsWith("//")) {
            var index = part.indexOf('/', 2);

            if (index != -1) {
                return part.substring(2, index);
            }

            index = part.indexOf('?');
            if (index != -1) {
                return part.substring(2, index);
            }

            return part.substring(2);

        }

        return null;
    },

    getAuthority: function(decode) {
    	if (decode==null) {
    		decode = false;
    	}

        return decode ? Reference.decode(this._getAuthority()) : this._getAuthority();
    },

    getBaseRef: function() {
        return this.baseRef;
    },

    getExtensions: function() {
        var result = null;
        var lastSegment = this.getLastSegment();

        if (lastSegment != null) {
            var extensionIndex = lastSegment.indexOf('.');
            var matrixIndex = lastSegment.indexOf(';');

            if (extensionIndex != -1) {
                // Extensions found
                if (matrixIndex != -1) {
                    result = lastSegment.substring(extensionIndex + 1,
                            matrixIndex);
                } else {
                    // No matrix found
                    result = lastSegment.substring(extensionIndex + 1);
                }
            }
        }

        return result;
    },

    getExtensionsAsArray: function() {
        var result = null;
        var extensions = this.getExtensions();

        if (extensions != null) {
        	//TODO: check if split function correctly works
            result = extensions.split("\\.");
        }

        return result;
    },

    _getFragment: function() {
        if (this.hasFragment()) {
            return this.internalRef.substring(this.fragmentIndex + 1);
        }

        return null;
    },

    getFragment: function(decode) {
    	if (decode==null) {
    		decode = false;
    	}
        return decode ? Reference.decode(this._getFragment()) : this._getFragment();
    },

    _getHierarchicalPart: function() {
        if (this.hasScheme()) {
            // Scheme found
            if (this.hasQuery()) {
                // Query found
                return this.internalRef.substring(this.schemeIndex + 1,
                        this.queryIndex);
            }

            // No query found
            if (this.hasFragment()) {
                // Fragment found
                return this.internalRef.substring(this.schemeIndex + 1,
                        this.fragmentIndex);
            }

            // No fragment found
            return this.internalRef.substring(this.schemeIndex + 1);
        }

        // No scheme found
        if (this.hasQuery()) {
            // Query found
            return this.internalRef.substring(0, this.queryIndex);
        }
        if (this.hasFragment()) {
            // Fragment found
            return this.internalRef.substring(0, this.fragmentIndex);
        }

        // No fragment found
        return this.internalRef;
    },

    getHierarchicalPart: function(decode) {
    	if (decode==null) {
    		decode = false;
    	}
        return this.decode ? Reference.decode(this._getHierarchicalPart()) : this._getHierarchicalPart();
    },

    _getHostDomain: function() {
        var result = null;
        var authority = this.getAuthority();

        if (authority != null) {
            var index1 = authority.indexOf('@');
            // We must prevent the case where the userinfo part contains ':'
            var index2 = authority.indexOf(':', (index1 == -1 ? 0
                    : index1));

            if (index1 != -1) {
                // User info found
                if (index2 != -1) {
                    // Port found
                    result = authority.substring(index1 + 1, index2);
                } else {
                    // No port found
                    result = authority.substring(index1 + 1);
                }
            } else {
                // No user info found
                if (index2 != -1) {
                    // Port found
                    result = authority.substring(0, index2);
                } else {
                    // No port found
                    result = authority;
                }
            }
        }

        return result;
    },

    getHostDomain: function(decode) {
    	if (decode==null) {
    		decode = false;
    	}
        return decode ? Reference.decode(this._getHostDomain()) : this._getHostDomain();
    },

    _getHostIdentifier: function() {
        var result = new StringBuilder();
        result.append(this.getScheme()).append("://").append(this.getAuthority());
        return result.toString();
    },

    getHostIdentifier: function(decode) {
    	if (decode==null) {
    		decode = false;
    	}
        return decode ? Reference.decode(this._getHostIdentifier()) : this._getHostIdentifier();
    },

    getHostPort: function() {
        var result = -1;
        var authority = this.getAuthority();

        if (authority != null) {
            var index1 = authority.indexOf('@');
            // We must prevent the case where the userinfo part contains ':'
            var index = authority.indexOf(':',
                    (index1 == -1 ? 0 : index1));

            if (index != -1) {
                try {
                    result = parseInt(authority.substring(index + 1));
                } catch (err) {
                    //Context.getCurrentLogger().log(
                	//        Level.WARNING,
                	//        "Can't parse hostPort : [hostRef,requestUri]=["
                	//                + getBaseRef() + "," + this.internalRef
                	//                + "]");
                }
            }
        }

        return result;
    },

    _getIdentifier: function() {
        if (this.hasFragment()) {
            // Fragment found
            return this.internalRef.substring(0, this.fragmentIndex);
        }

        // No fragment found
        return this.internalRef;
    },

    getIdentifier: function(decode) {
    	if (decode==null) {
    		decode = false;
    	}
        return decode ? Reference.decode(this._getIdentifier()) : this._getIdentifier();
    },

    _getLastSegment: function() {
        var result = null;
        var path = this.getPath();

        if (path != null) {
            if (path.endsWith("/")) {
                path = path.substring(0, path.length() - 1);
            }

            var lastSlash = path.lastIndexOf('/');

            if (lastSlash != -1) {
                result = path.substring(lastSlash + 1);
            }
        }

        return result;
    },

    getLastSegment: function(decode, excludeMatrix) {
    	if (decode==null) {
    		decode = false;
    	}
    	if (excludeMatrix==null) {
    		excludeMatrix = false;
    	}
        var result = this._getLastSegment();

        if (excludeMatrix && (result != null)) {
            var matrixIndex = result.indexOf(';');

            if (matrixIndex != -1) {
                result = result.substring(0, matrixIndex);
            }
        }

        return decode ? Reference.decode(result) : result;
    },

    _getMatrix: function() {
        var lastSegment = this.getLastSegment();
        if (lastSegment != null) {
            var matrixIndex = lastSegment.indexOf(';');

            if (matrixIndex != -1) {
                return lastSegment.substring(matrixIndex + 1);
            }
        }

        // No matrix found
        return null;
    },

    getMatrix: function(decode) {
    	if (decode==null) {
    		decode = false;
    	}
        return decode ? Reference.decode(this._getMatrix()) : this._getMatrix();
    },

    //TODO:
    getMatrixAsForm: function() {
        return new Form(this.getMatrix(), ';');
    },

    //TODO:
    getMatrixAsForm: function(characterSet) {
        return new Form(this.getMatrix(), characterSet, ';');
    },

    getParentRef: function() {
        var result = null;

        if (this.isHierarchical()) {
            var parentRef = null;
            var path = this.getPath();
            if (!path.equals("/") && !path.equals("")) {
                if (path.endsWith("/")) {
                    path = path.substring(0, path.length() - 1);
                }

                parentRef = this.getHostIdentifier()
                        + path.substring(0, path.lastIndexOf('/') + 1);
            } else {
                parentRef = this.internalRef;
            }

            result = new Reference(parentRef);
        }

        return result;
    },

    _getPath: function() {
        var result = null;
        var part = this.isRelative() ? this.getRelativePart()
                : this.getSchemeSpecificPart();

        if (part != null) {
            if (part.startsWith("//")) {
                // Authority found
                var index1 = part.indexOf('/', 2);

                if (index1 != -1) {
                    // Path found
                    var index2 = part.indexOf('?');
                    if (index2 != -1) {
                        // Query found
                        result = part.substring(index1, index2);
                    } else {
                        // No query found
                        result = part.substring(index1);
                    }
                } else {
                    // Path must be empty in this case
                }
            } else {
                // No authority found
                var index = part.indexOf('?');
                if (index != -1) {
                    // Query found
                    result = part.substring(0, index);
                } else {
                    // No query found
                    result = part;
                }
            }
        }

        return result;
    },

    getPath: function(decode) {
        return decode ? Reference.decode(this._getPath()) : this._getPath();
    },

    _getQuery: function() {
        if (this.hasQuery()) {
            // Query found
            if (this.hasFragment()) {
                if (this.queryIndex < this.fragmentIndex) {
                    // Fragment found and query sign not inside fragment
                    return this.internalRef.substring(this.queryIndex + 1,
                            this.fragmentIndex);
                }

                return null;
            }

            // No fragment found
            return this.internalRef.substring(this.queryIndex + 1);
        }

        // No query found
        return null;
    },

    getQuery: function(decode) {
        return decode ? Reference.decode(this._getQuery()) : this._getQuery();
    },

    /*public Form getQueryAsForm() {
        return new Form(getQuery());
    }

    public Form getQueryAsForm(boolean decode) {
        return new Form(getQuery(), decode);
    }

    public Form getQueryAsForm(CharacterSet characterSet) {
        return new Form(getQuery(), characterSet);
    }*/

    _getRelativePart: function() {
        return this.isRelative() ? this.toString(false, false) : null;
    },

    getRelativePart: function(decode) {
    	if (decode==null) {
    		decode = false;
    	}
        return decode ? Reference.decode(this._getRelativePart()) : this.getRelativePart();
    },

    getRelativeRef: function(base) {
    	if (base==null) {
    		base = this.getBaseRef();
    	}
        var result = null;

        if (base == null) {
            result = this;
        } else if (!this.isAbsolute() || !this.isHierarchical()) {
            throw new Error(
                    "The reference must have an absolute hierarchical path component");
        } else if (!base.isAbsolute() || !base.isHierarchical()) {
            throw new Error(
                    "The base reference must have an absolute hierarchical path component");
        } else if (!this.getHostIdentifier().equals(base.getHostIdentifier())) {
            result = this;
        } else {
            var localPath = this.getPath();
            var basePath = base.getPath();
            var relativePath = null;

            if ((basePath == null) || (localPath == null)) {
                relativePath = localPath;
            } else {
                // Find the junction point
                var diffFound = false;
                var lastSlashIndex = -1;
                var i = 0;
                var current;
                while (!diffFound && (i < localPath.length)
                        && (i < basePath.length)) {
                    current = localPath.charAt(i);

                    if (current != basePath.charAt(i)) {
                        diffFound = true;
                    } else {
                        if (current == "/") {
                            lastSlashIndex = i;
                        }
                        i++;
                    }
                }

                if (!diffFound) {
                    if (localPath.length == basePath.length) {
                        // Both paths are strictly equivalent
                        relativePath = ".";
                    } else if (i == localPath.length) {
                        // End of local path reached
                        if (basePath.charAt(i) == "/") {
                            if ((i + 1) == basePath.length) {
                                // Both paths are strictly equivalent
                                relativePath = ".";
                            } else {
                                // The local path is a direct parent of the base
                                // path
                                // We need to add enough ".." in the relative
                                // path
                                var sb = new StringBuilder();

                                // Count segments
                                var segments = 0;
                                for (var j = basePath.indexOf('/', i); j != -1; j = basePath
                                        .indexOf('/', j + 1))
                                    segments++;

                                // Build relative path
                                for (var j = 0; j < segments; j++)
                                    sb.append("../");

                                var lastLocalSlash = localPath.lastIndexOf('/');
                                sb.append(localPath
                                        .substring(lastLocalSlash + 1));

                                relativePath = sb.toString();
                            }
                        } else {
                            // The base path has a segment that starts like
                            // the last local path segment
                            // But that is longer. Situation similar to a
                            // junction
                            var sb = new StringBuilder();

                            // Count segments
                            var segments = 0;
                            for (var j = basePath.indexOf('/', i); j != -1; j = basePath
                                    .indexOf('/', j + 1))
                                segments++;

                            // Build relative path
                            for (var j = 0; j < segments; j++)
                                if (j > 0)
                                    sb.append("/..");
                                else
                                    sb.append("..");

                            relativePath = sb.toString();

                            if (relativePath.equals("")) {
                                relativePath = ".";
                            }
                        }
                    } else if (i == basePath.length) {
                        if (localPath.charAt(i) == "/") {
                            if ((i + 1) == localPath.length) {
                                // Both paths are strictly equivalent
                                relativePath = ".";
                            } else {
                                // The local path is a direct child of the base
                                // path
                                relativePath = localPath.substring(i + 1);
                            }
                        } else {
                            if (lastSlashIndex == (i - 1)) {
                                // The local path is a direct subpath of the
                                // base path
                                relativePath = localPath.substring(i);
                            } else {
                                relativePath = ".."
                                        + localPath.substring(lastSlashIndex);
                            }
                        }
                    }
                } else {
                    // We found a junction point, we need to add enough ".." in
                    // the relative path and append the rest of the local path
                    // the local path is a direct subpath of the base path
                    var sb = new StringBuilder();

                    // Count segments
                    var segments = 0;
                    for (var j = basePath.indexOf('/', i); j != -1; j = basePath
                            .indexOf('/', j + 1))
                        segments++;

                    // Build relative path
                    for (var j = 0; j < segments; j++)
                        sb.append("../");

                    sb.append(localPath.substring(lastSlashIndex + 1));

                    relativePath = sb.toString();
                }
            }

            // Build the result reference
            result = new Reference();
            var query = this.getQuery();
            var fragment = this.getFragment();
            var modified = false;

            if ((query != null) && (!query.equals(base.getQuery()))) {
                result.setQuery(query);
                modified = true;
            }

            if ((fragment != null) && (!fragment.equals(base.getFragment()))) {
                result.setFragment(fragment);
                modified = true;
            }

            if (!modified || !relativePath.equals(".")) {
                result.setPath(relativePath);
            }
        }

        return result;
    },

    getRemainingPart: function() {
        return this._getRemainingPart(false, true);
    },

    getRemainingPart: function(decode) {
        return this._getRemainingPart(true, true);
    },

    _getRemainingPart: function(decode, query) {
        var result = null;
        var all = this.toString(query, false);

        if (this.getBaseRef() != null) {
            var base = this.getBaseRef().toString(query, false);

            if ((base != null) && all.startsWith(base)) {
                result = all.substring(base.length);
            }
        } else {
            result = all;
        }

        return decode ? Reference.decode(result) : result;
    },

    _getScheme: function() {
        if (this.hasScheme()) {
            // Scheme found
            return this.internalRef.substring(0, this.schemeIndex);
        }

        // No scheme found
        return null;
    },

    getScheme: function(decode) {
    	if (decode==null) {
    		decode = false;
    	}
        return decode ? Reference.decode(this._getScheme()) : this._getScheme();
    },

    getSchemeProtocol: function() {
        return Protocol.valueOf(this.getScheme());
    },

    _getSchemeSpecificPart: function() {
        var result = null;

        if (this.hasScheme()) {
            // Scheme found
            if (this.hasFragment()) {
                // Fragment found
                result = this.internalRef.substring(this.schemeIndex + 1,
                        this.fragmentIndex);
            } else {
                // No fragment found
                result = this.internalRef.substring(this.schemeIndex + 1);
            }
        }

        return result;
    },

    getSchemeSpecificPart: function(decode) {
    	if (decode==null) {
    		decode = false;
    	}
        return decode ? Reference.decode(this._getSchemeSpecificPart())
                 : this._getSchemeSpecificPart();
    },

    _getSegments: function() {
        var result = [];
        var path = this.getPath();
        var start = -2; // The index of the slash starting the segment
        var current;

        if (path != null) {
            for (var i = 0; i < path.length; i++) {
                current = path.charAt(i);

                if (current == "/") {
                    if (start == -2) {
                        // Beginning of an absolute path or sequence of two
                        // separators
                        start = i;
                    } else {
                        // End of a segment
                        result.push(path.substring(start + 1, i));
                        start = i;
                    }
                } else {
                    if (start == -2) {
                        // Starting a new segment for a relative path
                        start = -1;
                    } else {
                        // Looking for the next character
                    }
                }
            }

            if (start != -2) {
                // Add the last segment
                result.push(path.substring(start + 1));
            }
        }

        return result;
    },

    getSegments: function(decode) {
    	if (decode==null) {
    		decode = false;
    	}
        var result = this._getSegments();

        if (decode) {
            for (var i = 0; i < result.length; i++) {
                result.set(i, decode(result.get(i)));
            }
        }

        return result;
    },

    getTargetRef: function() {
        var result = null;

        // Step 1 - Resolve relative reference against their base reference
        if (this.isRelative() && (this.baseRef != null)) {
            var baseReference = null;

            if (this.baseRef.isAbsolute()) {
                baseReference = this.baseRef;
            } else {
                baseReference = this.baseRef.getTargetRef();
            }

            if (baseReference.isRelative()) {
                throw new Error(
                        "The base reference must have an absolute hierarchical path component");
            }

            // Relative URI detected
            var authority = this.getAuthority();
            var path = this.getPath();
            var query = this.getQuery();
            var fragment = this.getFragment();

            // Create an empty reference
            result = new Reference();
            result.setScheme(baseReference.getScheme());

            if (authority != null) {
                result.setAuthority(authority);
                result.setPath(path);
                result.setQuery(query);
            } else {
                result.setAuthority(baseReference.getAuthority());

                if ((path == null) || (path.equals(""))) {
                    result.setPath(baseReference.getPath());

                    if (query != null) {
                        result.setQuery(query);
                    } else {
                        result.setQuery(baseReference.getQuery());
                    }
                } else {
                    if (path.startsWith("/")) {
                        result.setPath(path);
                    } else {
                        var basePath = baseReference.getPath();
                        var mergedPath = null;

                        if ((baseReference.getAuthority() != null)
                                && ((basePath == null) || (basePath.equals("")))) {
                            mergedPath = "/" + path;
                        } else {
                            // Remove the last segment which may be empty if
                            // the path is ending with a slash
                            var lastSlash = basePath.lastIndexOf('/');
                            if (lastSlash == -1) {
                                mergedPath = path;
                            } else {
                                mergedPath = basePath.substring(0,
                                        lastSlash + 1) + path;
                            }
                        }

                        result.setPath(mergedPath);
                    }

                    result.setQuery(query);
                }
            }

            result.setFragment(fragment);
        } else if (this.isRelative()) {
            // Relative reference with no baseRef detected
            throw new Error(
                    "Relative references are only usable when a base reference is set.");
        } else {
            // Absolute URI detected
            result = new Reference(this.internalRef);
        }

        // Step 2 - Normalize the target reference
        result.normalize();

        return result;
    },

    _getUserInfo: function() {
        var result = null;
        var authority = this.getAuthority();

        if (authority != null) {
            var index = authority.indexOf('@');

            if (index != -1) {
                result = authority.substring(0, index);
            }
        }

        return result;
    },

    getUserInfo: function(decode) {
    	if (decode==null) {
    		decode = false;
    	}
        return decode ? decode(this._getUserInfo()) : this._getUserInfo();
    },

    hasExtensions: function() {
        var result = false;

        // If these reference ends with a "/", it cannot be a file.
        var path = this.getPath();
        if (!((path != null) && path.endsWith("/"))) {
            var lastSegment = this.getLastSegment();

            if (lastSegment != null) {
                var extensionsIndex = lastSegment.indexOf('.');
                var matrixIndex = lastSegment.indexOf(';');
                result = (extensionsIndex != -1)
                        && ((matrixIndex == -1) || (extensionsIndex < matrixIndex));
            }
        }

        return result;
    },

    hasFragment: function() {
        return (this.fragmentIndex != -1);
    },

    hasMatrix: function() {
        return (this.getLastSegment().indexOf(';') != -1);
    },

    hasQuery: function() {
        return (this.queryIndex != -1);
    },

    hasScheme: function() {
        return (this.schemeIndex != -1);
    },

    isAbsolute: function() {
        return (this.getScheme() != null);
    },

    isEquivalentTo: function(ref) {
        return this.getTargetRef().equals(ref.getTargetRef());
    },

    isHierarchical: function() {
        return this.isRelative() || (this.getSchemeSpecificPart().charAt(0) == '/');
    },

    isOpaque: function() {
        return this.isAbsolute() && (this.getSchemeSpecificPart().charAt(0) != '/');
    },

    isParent: function(childRef) {
        var result = false;

        if ((childRef != null) && (childRef.isHierarchical())) {
            result = childRef.toString(false, false).startsWith(
                    				this.toString(false, false));
        }

        return result;
    },

    isRelative: function() {
        return (this.getScheme() == null);
    },

    /*public Reference normalize() {
        // 1. The input buffer is initialized with the now-appended path
        // components and the output buffer is initialized to the empty string.
        final StringBuilder output = new StringBuilder();
        final StringBuilder input = new StringBuilder();
        final String path = getPath();
        if (path != null) {
            input.append(path);
        }

        // 2. While the input buffer is not empty, loop as follows:
        while (input.length() > 0) {
            // A. If the input buffer begins with a prefix of "../" or "./",
            // then remove that prefix from the input buffer; otherwise,
            if ((input.length() >= 3) && input.substring(0, 3).equals("../")) {
                input.delete(0, 3);
            } else if ((input.length() >= 2)
                    && input.substring(0, 2).equals("./")) {
                input.delete(0, 2);
            }

            // B. if the input buffer begins with a prefix of "/./" or "/.",
            // where "." is a complete path segment, then replace that
            // prefix with "/" in the input buffer; otherwise,
            else if ((input.length() >= 3)
                    && input.substring(0, 3).equals("/./")) {
                input.delete(0, 2);
            } else if ((input.length() == 2)
                    && input.substring(0, 2).equals("/.")) {
                input.delete(1, 2);
            }

            // C. if the input buffer begins with a prefix of "/../" or "/..",
            // where ".." is a complete path segment, then replace that prefix
            // with "/" in the input buffer and remove the last segment and its
            // preceding "/" (if any) from the output buffer; otherwise,
            else if ((input.length() >= 4)
                    && input.substring(0, 4).equals("/../")) {
                input.delete(0, 3);
                removeLastSegment(output);
            } else if ((input.length() == 3)
                    && input.substring(0, 3).equals("/..")) {
                input.delete(1, 3);
                removeLastSegment(output);
            }

            // D. if the input buffer consists only of "." or "..", then remove
            // that from the input buffer; otherwise,
            else if ((input.length() == 1) && input.substring(0, 1).equals(".")) {
                input.delete(0, 1);
            } else if ((input.length() == 2)
                    && input.substring(0, 2).equals("..")) {
                input.delete(0, 2);
            }

            // E. move the first path segment in the input buffer to the end of
            // the output buffer, including the initial "/" character (if any)
            // and any subsequent characters up to, but not including, the next
            // "/" character or the end of the input buffer.
            else {
                int max = -1;
                for (int i = 1; (max == -1) && (i < input.length()); i++) {
                    if (input.charAt(i) == '/') {
                        max = i;
                    }
                }

                if (max != -1) {
                    // We found the next "/" character.
                    output.append(input.substring(0, max));
                    input.delete(0, max);
                } else {
                    // End of input buffer reached
                    output.append(input);
                    input.delete(0, input.length());
                }
            }
        }

        // Finally, the output buffer is returned as the result
        setPath(output.toString());

        // Ensure that the scheme and host names are reset in lower case
        setScheme(getScheme());
        setHostDomain(getHostDomain());

        // Remove the port if it is equal to the default port of the reference's
        // Protocol.
        final int hostPort = getHostPort();
        if (hostPort != -1) {
            final int defaultPort = Protocol.valueOf(getScheme())
                    .getDefaultPort();
            if (hostPort == defaultPort) {
                setHostPort(null);
            }
        }

        return this;
    }

    private void removeLastSegment(StringBuilder output) {
        int min = -1;
        for (int i = output.length() - 1; (min == -1) && (i >= 0); i--) {
            if (output.charAt(i) == '/') {
                min = i;
            }
        }

        if (min != -1) {
            // We found the previous "/" character.
            output.delete(min, output.length());
        } else {
            // End of output buffer reached
            output.delete(0, output.length());
        }

    }*/

    setAuthority: function(authority) {
        var oldPart = this.isRelative() ? this.getRelativePart()
                : this.getSchemeSpecificPart();
        var newPart;
        var newAuthority = (authority == null) ? "" : "//" + authority;

        if (oldPart == null) {
            newPart = newAuthority;
        } else if (oldPart.startsWith("//")) {
            var index = oldPart.indexOf('/', 2);

            if (index != -1) {
                newPart = newAuthority + oldPart.substring(index);
            } else {
                index = oldPart.indexOf('?');
                if (index != -1) {
                    newPart = newAuthority + oldPart.substring(index);
                } else {
                    newPart = newAuthority;
                }
            }
        } else {
            newPart = newAuthority + oldPart;
        }

        if (this.isAbsolute()) {
        	this.setSchemeSpecificPart(newPart);
        } else {
        	this.setRelativePart(newPart);
        }
    },

    setBaseRef: function(base) {
    	if (typeof base == "string") {
    		this.baseRef = new Reference(base);
    	} else {
    		this.baseRef = base;
    	}
    },

    /*public void setExtensions(String extensions) {
        final String lastSegment = getLastSegment();

        if (lastSegment != null) {
            final int extensionIndex = lastSegment.indexOf('.');
            final int matrixIndex = lastSegment.indexOf(';');
            final StringBuilder sb = new StringBuilder();

            if (extensionIndex != -1) {
                // Extensions found
                sb.append(lastSegment.substring(0, extensionIndex));

                if ((extensions != null) && (extensions.length() > 0)) {
                    sb.append('.').append(extensions);
                }

                if (matrixIndex != -1) {
                    sb.append(lastSegment.substring(matrixIndex));
                }
            } else {
                // Extensions not found
                if ((extensions != null) && (extensions.length() > 0)) {
                    if (matrixIndex != -1) {
                        // Matrix found, make sure we append it
                        // after the extensions
                        sb.append(lastSegment.substring(0, matrixIndex))
                                .append('.').append(extensions)
                                .append(lastSegment.substring(matrixIndex));
                    } else {
                        // No matrix found, just append the extensions
                        sb.append(lastSegment).append('.').append(extensions);
                    }
                } else {
                    // No change necessary
                    sb.append(lastSegment);
                }
            }

            // Finally update the last segment
            setLastSegment(sb.toString());
        } else {
            setLastSegment('.' + extensions);
        }
    }

    public void setExtensions(String[] extensions) {
        String exts = null;

        if (extensions != null) {
            final StringBuilder sb = new StringBuilder();

            for (int i = 0; i < extensions.length; i++) {
                if (i > 0) {
                    sb.append('.');
                }

                sb.append(extensions[i]);
            }

            exts = sb.toString();
        }

        setExtensions(exts);
    }*/

    setFragment: function(fragment) {
        fragment = this.encodeInvalidCharacters(fragment);

        if ((fragment != null) && (fragment.indexOf('#') != -1)) {
            throw new Error(
                    "Illegal '#' character detected in parameter");
        }

        if (this.hasFragment()) {
            // Existing fragment
            if (fragment != null) {
                this.internalRef = this.internalRef.substring(0,
                        this.fragmentIndex + 1) + fragment;
            } else {
                this.internalRef = this.internalRef.substring(0,
                        this.fragmentIndex);
            }
        } else {
            // No existing fragment
            if (fragment != null) {
                if (this.internalRef != null) {
                    this.internalRef = this.internalRef + '#' + fragment;
                } else {
                    this.internalRef = '#' + fragment;
                }
            } else {
                // Do nothing
            }
        }

        this.updateIndexes();
    },

    setHostDomain: function(domain) {
        var authority = this.getAuthority();

        if (authority == null) {
            this.setAuthority(domain);
        } else {
            if (domain == null) {
                domain = "";
            } else {
                // URI specification indicates that host names should be
                // produced in lower case
                domain = domain.toLowerCase();
            }

            var index1 = authority.indexOf('@');
            // We must prevent the case where the userinfo part contains ':'
            var index2 = authority.indexOf(':', (index1 == -1 ? 0
                    : index1));

            if (index1 != -1) {
                // User info found
                if (index2 != -1) {
                    // Port found
                    this.setAuthority(authority.substring(0, index1 + 1) + domain
                            + authority.substring(index2));
                } else {
                    // No port found
                	this.setAuthority(authority.substring(0, index1 + 1) + domain);
                }
            } else {
                // No user info found
                if (index2 != -1) {
                    // Port found
                	this.setAuthority(domain + authority.substring(index2));
                } else {
                    // No port found
                	this.setAuthority(domain);
                }
            }
        }
    },

    setHostPort: function(port) {
        var authority = this.getAuthority();

        if (authority != null) {
            var index1 = authority.indexOf('@');
            // We must prevent the case where the userinfo part contains ':'
            var index = authority.indexOf(':',
                    (index1 == -1 ? 0 : index1));
            var newPort = (port == null) ? "" : ":" + port;

            if (index != -1) {
            	this.setAuthority(authority.substring(0, index) + newPort);
            } else {
            	this.setAuthority(authority + newPort);
            }
        } else {
            throw new Error(
                    "No authority defined, please define a host name first");
        }
    },

    setIdentifier: function(identifier) {
        identifier = this.encodeInvalidCharacters(identifier);

        if (identifier == null) {
            identifier = "";
        }

        if (identifier.indexOf('#') != -1) {
            throw new Error(
                    "Illegal '#' character detected in parameter");
        }

        if (this.hasFragment()) {
            // Fragment found
            this.internalRef = identifier
                    + this.internalRef.substring(this.fragmentIndex);
        } else {
            // No fragment found
            this.internalRef = identifier;
        }

        this.updateIndexes();
    },

    setLastSegment: function(lastSegment) {
        var path = this.getPath();
        var lastSlashIndex = path.lastIndexOf('/');

        if (lastSlashIndex != -1) {
        	this.setPath(path.substring(0, lastSlashIndex + 1) + lastSegment);
        } else {
        	this.setPath('/' + lastSegment);
        }
    },

    setPath: function(path) {
        var oldPart = this.isRelative() ? this.getRelativePart()
                : this.getSchemeSpecificPart();
        var newPart = null;

        if (oldPart != null) {
            if (path == null) {
                path = "";
            }

            if (oldPart.startsWith("//")) {
                // Authority found
                var index1 = oldPart.indexOf('/', 2);

                if (index1 != -1) {
                    // Path found
                    var index2 = oldPart.indexOf('?');

                    if (index2 != -1) {
                        // Query found
                        newPart = oldPart.substring(0, index1) + path
                                + oldPart.substring(index2);
                    } else {
                        // No query found
                        newPart = oldPart.substring(0, index1) + path;
                    }
                } else {
                    // No path found
                    var index2 = oldPart.indexOf('?');

                    if (index2 != -1) {
                        // Query found
                        newPart = oldPart.substring(0, index2) + path
                                + oldPart.substring(index2);
                    } else {
                        // No query found
                        newPart = oldPart + path;
                    }
                }
            } else {
                // No authority found
                var index = oldPart.indexOf('?');

                if (index != -1) {
                    // Query found
                    newPart = path + oldPart.substring(index);
                } else {
                    // No query found
                    newPart = path;
                }
            }
        } else {
            newPart = path;
        }

        if (this.isAbsolute()) {
        	this.setSchemeSpecificPart(newPart);
        } else {
        	this.setRelativePart(newPart);
        }
    },

    setProtocol: function(protocol) {
        this.setScheme(protocol.getSchemeName());
    },

    setQuery: function(query) {
        query = this.encodeInvalidCharacters(query);
        var emptyQueryString = ((query == null) || (query.length <= 0));

        if (this.hasQuery()) {
            // Query found
            if (this.hasFragment()) {
                // Fragment found
                if (!emptyQueryString) {
                    this.internalRef = this.internalRef.substring(0,
                            this.queryIndex + 1)
                            + query
                            + this.internalRef.substring(this.fragmentIndex);
                } else {
                    this.internalRef = this.internalRef.substring(0,
                            this.queryIndex)
                            + this.internalRef.substring(this.fragmentIndex);
                }
            } else {
                // No fragment found
                if (!emptyQueryString) {
                    this.internalRef = this.internalRef.substring(0,
                            this.queryIndex + 1) + query;
                } else {
                    this.internalRef = this.internalRef.substring(0,
                            this.queryIndex);
                }
            }
        } else {
            // No query found
            if (this.hasFragment()) {
                // Fragment found
                if (!emptyQueryString) {
                    this.internalRef = this.internalRef.substring(0,
                            this.fragmentIndex)
                            + '?'
                            + query
                            + this.internalRef.substring(this.fragmentIndex);
                } else {
                    // Do nothing;
                }
            } else {
                // No fragment found
                if (!emptyQueryString) {
                    if (this.internalRef != null) {
                        this.internalRef = this.internalRef + '?' + query;
                    } else {
                        this.internalRef = '?' + query;
                    }
                } else {
                    // Do nothing;
                }
            }
        }

        this.updateIndexes();
    },

    setRelativePart: function(relativePart) {
        relativePart = this.encodeInvalidCharacters(relativePart);

        if (relativePart == null) {
            relativePart = "";
        }

        if (!this.hasScheme()) {
            // This is a relative reference, no scheme found
            if (this.hasQuery()) {
                // Query found
                this.internalRef = relativePart
                        + this.internalRef.substring(this.queryIndex);
            } else if (this.hasFragment()) {
                // Fragment found
                this.internalRef = relativePart
                        + this.internalRef.substring(this.fragmentIndex);
            } else {
                // No fragment found
                this.internalRef = relativePart;
            }
        }

        this.updateIndexes();
    },

    setScheme: function(scheme) {
        scheme = this.encodeInvalidCharacters(scheme);

        if (scheme != null) {
            // URI specification indicates that scheme names should be
            // produced in lower case
            scheme = scheme.toLowerCase();
        }

        if (this.hasScheme()) {
            // Scheme found
            if (scheme != null) {
                this.internalRef = scheme
                        + this.internalRef.substring(this.schemeIndex);
            } else {
                this.internalRef = this.internalRef
                        .substring(this.schemeIndex + 1);
            }
        } else {
            // No scheme found
            if (scheme != null) {
                if (this.internalRef == null) {
                    this.internalRef = scheme + ':';
                } else {
                    this.internalRef = scheme + ':' + this.internalRef;
                }
            }
        }

        this.updateIndexes();
    },

    setSchemeSpecificPart: function(schemeSpecificPart) {
        schemeSpecificPart = this.encodeInvalidCharacters(schemeSpecificPart);

        if (schemeSpecificPart == null) {
            schemeSpecificPart = "";
        }

        if (this.hasScheme()) {
            // Scheme found
            if (this.hasFragment()) {
                // Fragment found
                this.internalRef = this.internalRef.substring(0,
                        this.schemeIndex + 1)
                        + schemeSpecificPart
                        + this.internalRef.substring(this.fragmentIndex);
            } else {
                // No fragment found
                this.internalRef = this.internalRef.substring(0,
                        this.schemeIndex + 1) + schemeSpecificPart;
            }
        } else {
            // No scheme found
            if (this.hasFragment()) {
                // Fragment found
                this.internalRef = schemeSpecificPart
                        + this.internalRef.substring(this.fragmentIndex);
            } else {
                // No fragment found
                this.internalRef = schemeSpecificPart;
            }
        }

        this.updateIndexes();
    },

    setSegments: function(segments) {
        var sb = new StringBuilder();

        for (var i=0; i<segments.length; i++) {
        	var segment = segments[i];
            sb.append('/').append(segment);
        }

        this.setPath(sb.toString());
    },

    setUserInfo: function(userInfo) {
        var authority = this.getAuthority();

        if (authority != null) {
            var index = authority.indexOf('@');
            var newUserInfo = (userInfo == null) ? "" : userInfo + '@';

            if (index != -1) {
            	this.setAuthority(newUserInfo + authority.substring(index + 1));
            } else {
            	this.setAuthority(newUserInfo + authority);
            }
        } else {
            throw new Error(
                    "No authority defined, please define a host name first");
        }
    },

    toString: function() {
        return this.internalRef;
    },

    toString: function(query, fragment) {
        if (query) {
            if (fragment) {
                return this.internalRef;
            }

            if (this.hasFragment()) {
                return this.internalRef.substring(0, this.fragmentIndex);
            }
            return this.internalRef;
        }

        if (fragment) {
            // Fragment should be included
            if (this.hasQuery()) {
                // Query found
                if (this.hasFragment()) {
                    // Fragment found
                    return this.internalRef.substring(0, this.queryIndex) + "#"
                            + this.getFragment();
                }

                // No fragment found
                return this.internalRef.substring(0, this.queryIndex);
            }

            // No query found
            return this.internalRef;
        }

        // Fragment should not be included
        if (this.hasQuery()) {
            // Query found
            return this.internalRef.substring(0, this.queryIndex);
        }
        if (this.hasFragment()) {
            // Fragment found
            return this.internalRef.substring(0, this.fragmentIndex);
        }

        return this.internalRef;
    },

    updateIndexes: function() {
        if (this.internalRef != null) {
            // Compute the indexes
            var firstSlashIndex = this.internalRef.indexOf('/');
            this.schemeIndex = this.internalRef.indexOf(':');

            if ((firstSlashIndex != -1) && (this.schemeIndex > firstSlashIndex)) {
                // We are in the rare case of a relative reference where one of
                // the path segments contains a colon character. In this case,
                // we ignore the colon as a valid scheme index.
                // Note that this colon can't be in the first segment as it is
                // forbidden by the URI RFC.
                this.schemeIndex = -1;
            }

            this.queryIndex = this.internalRef.indexOf('?');
            this.fragmentIndex = this.internalRef.indexOf('#');

            if (this.hasQuery() && this.hasFragment()
                    && (this.queryIndex > this.fragmentIndex)) {
                // Query sign inside fragment
                this.queryIndex = -1;
            }

            if (this.hasQuery() && this.schemeIndex > this.queryIndex) {
                // Colon sign inside query
                this.schemeIndex = -1;
            }

            if (this.hasFragment() && this.schemeIndex > this.fragmentIndex) {
                // Colon sign inside fragment
                this.schemeIndex = -1;
            }
        } else {
            this.schemeIndex = -1;
            this.queryIndex = -1;
            this.fragmentIndex = -1;
        }
    }
});

Reference.extend({
	charValidityMap: [],

    decode: function(toDecode, characterSet) {
    	if (characterSet==null) {
    		characterSet = CharacterSet.UTF_8;
    	}

    	var result = unescape(toDecode);

        return result;
    },

    //public static String encode(String toEncode) {
    //public static String encode(String toEncode, boolean queryString) {
    //public static String encode(String toEncode, CharacterSet characterSet) {
    encode: function(toEncode, queryString, characterSet) {
    	if (queryString==null) {
    		queryString = true;
    	}
    	if (characterSet==null) {
    		characterSet = CharacterSet.UTF_8;
    	}

        var result = escape(toEncode);

        if (queryString) {
            result = result.replace("+", "%20").replace("*", "%2A")
                    .replace("%7E", "~");
        }

        return result;
    },

    isAlpha: function(character) {
        return Reference.isUpperCase(character) || Reference.isLowerCase(character);
    },

    isDigit: function(character) {
        return (character >= "0".charCodeAt(0)) && (character <= "9".charCodeAt(0));
    },

    isGenericDelimiter: function(character) {
        return (character == ":".charCodeAt(0))
        		|| (character == "/".charCodeAt(0)) || (character == "?".charCodeAt(0))
                || (character == "#".charCodeAt(0)) || (character == "[".charCodeAt(0))
                || (character == "]".charCodeAt(0)) || (character == "@".charCodeAt(0));
    },

    isLowerCase: function(character) {
        return (character >= "a".charCodeAt(0)) && (character <= "z".charCodeAt(0));
    },

    isReserved: function(character) {
        return Reference.isGenericDelimiter(character) || Reference.isSubDelimiter(character);
    },

    isSubDelimiter: function(character) {
        return (character == "!".charCodeAt(0))
        		|| (character == "$".charCodeAt(0)) || (character == "&".charCodeAt(0))
                || (character == "\'".charCodeAt(0)) || (character == "(".charCodeAt(0))
                || (character == ")".charCodeAt(0)) || (character == "*".charCodeAt(0))
                || (character == "+".charCodeAt(0)) || (character == ",".charCodeAt(0))
                || (character == ";".charCodeAt(0)) || (character == "=".charCodeAt(0));
    },

    isUnreserved: function(character) {
        return Reference.isAlpha(character) || Reference.isDigit(character)
        		|| (character == "-".charCodeAt(0))
                || (character == ".".charCodeAt(0))
                || (character == "_".charCodeAt(0))
                || (character == "~".charCodeAt(0));
    },

    isUpperCase: function(character) {
        return (character >= "A".charCodeAt(0)) && (character <= "Z".charCodeAt(0));
    },

    isValid: function(character) {
        return character >= 0 && character < 127 && Reference.charValidityMap[character];
    },
    
    toString: function() {
    	if (arguments.length==6) {
    		Reference._toString1.apply(Reference, arguments);
    	} else if (arguments.length==3) {
    		Reference._toString2.apply(Reference, arguments);
    	} else if (arguments.length==5) {
    		Reference._toString3.apply(Reference, arguments);
    	}
    },

    _toString1: function(scheme, hostName, hostPort, path, query, fragment) {
        var host = hostName;

        // Appends the host port number
        if (hostPort != null) {
            var defaultPort = Protocol.valueOf(scheme).getDefaultPort();
            if (hostPort != defaultPort) {
                host = hostName + ':' + hostPort;
            }
        }

        return Reference.toString3(scheme, host, path, query, fragment);
    },

    _toString2: function(relativePart, query, fragment) {
        var sb = new StringBuilder();

        // Append the path
        if (relativePart != null) {
            sb.append(relativePart);
        }

        // Append the query string
        if (query != null) {
            sb.append('?').append(query);
        }

        // Append the fragment identifier
        if (fragment != null) {
            sb.append('#').append(fragment);
        }

        // Actually construct the reference
        return sb.toString();
    },

    _toString3: function(scheme, host, path, query, fragment) {
        var sb = new StringBuilder();

        if (scheme != null) {
            // Append the scheme and host name
            sb.append(scheme.toLowerCase()).append("://").append(host);
        }

        // Append the path
        if (path != null) {
            sb.append(path);
        }

        // Append the query string
        if (query != null) {
            sb.append('?').append(query);
        }

        // Append the fragment identifier
        if (fragment != null) {
            sb.append('#').append(fragment);
        }

        // Actually construct the reference
        return sb.toString();
    }

});

// Initialize the map of valid characters.
for (var character = 0; character < 127; character++) {
	Reference.charValidityMap[character] = Reference.isReserved(character)
			|| Reference.isUnreserved(character) || (character == "%".charCodeAt(0));
}

var Request = new Class(Message, {
	//initialize: function(method, resourceRef, url) {
	initialize: function(method, resourceRef, entity) {
		this.callSuper(entity);
		this.method = method;
		this.clientInfo = new ClientInfo();
		if (typeof resourceRef == "string") {
			this.resourceRef = new Reference(resourceRef);
		} else if (resourceRef instanceof Reference) {
			this.resourceRef = resourceRef;
		}
		this.ranges = [];
		this.conditions = new Conditions();
		this.cookies = new Series();
	},
	
    abort: function() {
        return false;
    },

    commit: function(response) {
    },

    getChallengeResponse: function() {
        return this.challengeResponse;
    },

    getClientInfo: function() {
        if (this.clientInfo==null) {
        	this.clientInfo = new ClientInfo();
        }
        return this.clientInfo;
    },

    getConditions: function() {
        if (this.conditions==null) {
        	this.conditions = new Conditions();
        }
        return this.conditions;
    },

    getCookies: function() {
        if (this.cookies==null) {
        	this.cookies = new Series();
        }
        return this.cookies;
    },

    getHostRef: function() {
        return this.hostRef;
    },

    getMaxForwards: function() {
        return this.maxForwards;
    },

    getMethod: function() {
        return this.method;
    },

    getOriginalRef: function() {
        return this.originalRef;
    },

    getProtocol: function() {
        var result = this.protocol;

        if ((result == null) && (this.getResourceRef() != null)) {
            // Attempt to guess the protocol to use
            // from the target reference scheme
            result = this.getResourceRef().getSchemeProtocol();
            // Fallback: look at base reference scheme
            if (result == null) {
                result = (this.getResourceRef().getBaseRef() != null) ? this.getResourceRef()
                        .getBaseRef().getSchemeProtocol() : null;
            }
        }

        return result;
    },

    getProxyChallengeResponse: function() {
        return this.proxyChallengeResponse;
    },

    getRanges: function() {
        if (this.ranges==null) {
        	this.ranges = [];
        }
        return this.ranges;
    },

    getReferrerRef: function() {
        return this.referrerRef;
    },

    getResourceRef: function() {
        return this.resourceRef;
    },

    getRootRef: function() {
        return this.rootRef;
    },

    isConfidential: function() {
        return (this.getProtocol() == null) ? false : this.getProtocol().isConfidential();
    },

    isEntityAvailable: function() {
        var result = (Method.GET.equals(this.getMethod())
                || Method.HEAD.equals(this.getMethod()) || Method.DELETE
                .equals(this.getMethod()));
        if (result) {
            return false;
        }

        //return super.isEntityAvailable();
        return (this.getEntity() != null) && this.getEntity().isAvailable();

    },

    isExpectingResponse: function() {
        return (this.getMethod() == null) ? false : this.getMethod().isReplying();
    },

    isLoggable: function() {
        return this.loggable;
    },

    setChallengeResponse: function(challengeResponse) {
        this.challengeResponse = challengeResponse;
    },

    setClientInfo: function(clientInfo) {
        this.clientInfo = clientInfo;
    },

    setConditions: function(conditions) {
        this.conditions = conditions;
    },

    setCookies: function(cookies) {
    	this.cookies = cookies;
    },

    _setHostRef: function(hostRef) {
        this.hostRef = hostRef;
    },

    setHostRef: function(host) {
    	if (typeof host == "string") {
    		this._setHostRef(new Reference(host));
    	} else {
    		this._setHostRef(host);
    	}
    },

    setLoggable: function(loggable) {
        this.loggable = loggable;
    },

    setMaxForwards: function(maxForwards) {
        this.maxForwards = maxForwards;
    },

    setMethod: function(method) {
        this.method = method;
    },

    setOriginalRef: function(originalRef) {
        this.originalRef = originalRef;
    },

    setProtocol: function(protocol) {
        this.protocol = protocol;
    },

    setProxyChallengeResponse: function(challengeResponse) {
        this.proxyChallengeResponse = challengeResponse;
    },

    setRanges: function(ranges) {
    	this.ranges = ranges;
    },

    _setReferrerRef: function(referrerRef) {
        this.referrerRef = referrerRef;

        // A referrer reference must not include a fragment.
        if ((this.referrerRef != null)
                && (this.referrerRef.getFragment() != null)) {
            this.referrerRef.setFragment(null);
        }
    },

    setReferrerRef: function(referrer) {
    	if (typeof referrer == "string") {
    		this._setReferrerRef(new Reference(referrer));
    	} else {
    		this._setReferrerRef(referrer);
    	}
    },

    _setResourceRef: function(resourceRef) {
        this.resourceRef = resourceRef;
    },

    setResourceRef: function(resource) {
    	if (typeof resource == "string") {
    		if (this.getResourceRef() != null) {
    			// Allow usage of URIs relative to the current base reference
    			this._setResourceRef(new Reference(this.getResourceRef().getBaseRef(),
    								resource));
    		} else {
    			this._setResourceRef(new Reference(resource));
    		}
    	} else {
    		this._setResourceRef(resource);
    	}
    },

    setRootRef: function(rootRef) {
        this.rootRef = rootRef;
    },

    toString: function() {
        return ((this.getMethod() == null) ? "" : this.getMethod().toString())
                + " "
                + ((this.getResourceRef() == null) ? "" : this.getResourceRef()
                        .toString())
                + " "
                + ((this.getProtocol() == null) ? ""
                        : (this.getProtocol().getName() + ((this.getProtocol()
                                .getVersion() == null) ? "" : "/"
                                + this.getProtocol().getVersion())));
    }
});

var Response = new Class(Message, {
	initialize: function(request) {
		this.callSuper();
        this.age = 0;
        this.allowedMethods = null;
        this.autoCommitting = true;
        this.challengeRequests = null;
        this.cookieSettings = null;
        this.committed = false;
        this.dimensions = null;
        this.locationRef = null;
        this.proxyChallengeRequests = null;
        this.request = request;
        this.retryAfter = null;
        this.serverInfo = new ServerInfo();
        this.status = Status.SUCCESS_OK;
	},
	
    abort: function() {
        this.getRequest().abort();
    },

    commit: function() {
        this.getRequest().commit(this);
    },

    getAge: function() {
        return this.age;
    },

    getAllowedMethods: function() {
        if (this.allowedMethods==null) {
        	this.allowedMethods = [];
        }
        return this.allowedMethods;
    },

    functiongetAuthenticationInfo: function() {
        return this.authenticationInfo;
    },

    getChallengeRequests: function() {
        if (this.challengeRequests==null) {
        	this.challengeRequests = [];
        }
        return this.challengeRequests;
    },

    getCookieSettings: function() {
        if (this.cookieSettings==null) {
        	this.cookieSettings = new Series();
        }
        return this.cookieSettings;
    },

    getDimensions: function() {
        if (this.dimensions==null) {
            this.dimensions = new [];
        }
        return this.dimensions;
    },

    getLocationRef: function() {
        return this.locationRef;
    },

    getProxyChallengeRequests: function() {
    	if (this.proxyChallengeRequests==null) {
    		this.proxyChallengeRequests = [];
    	}
    	return this.proxyChallengeRequests;
    },

    getRequest: function() {
        return this.request;
    },

    getRetryAfter: function() {
        return this.retryAfter;
    },

    getServerInfo: function() {
    	if (this.serverInfo==null) {
    		this.serverInfo = new ServerInfo();
    	}
        return this.serverInfo;
    },

    getStatus: function() {
        return this.status;
    },

    isAutoCommitting: function() {
        return this.autoCommitting;
    },

    isCommitted: function() {
        return this.committed;
    },

    isConfidential: function() {
        return this.getRequest().isConfidential();
    },

    isFinal: function() {
        return !this.getStatus().isInformational();
    },

    isProvisional: function() {
        return this.getStatus().isInformational();
    },

    redirectPermanent: function(target) {
        this.setLocationRef(target);
        this.setStatus(Status.REDIRECTION_PERMANENT);
    },

    redirectSeeOther: function(target) {
    	this.setLocationRef(target);
    	this.setStatus(Status.REDIRECTION_SEE_OTHER);
    },

    redirectTemporary: function(target) {
    	this.setLocationRef(target);
    	this.setStatus(Status.REDIRECTION_TEMPORARY);
    },

    setAge: function(age) {
        this.age = age;
    },

	setAllowedMethods: function(allowedMethods) {
		this.allowedMethods = allowedMethods;
    },

    setAuthenticationInfo: function(authenticationInfo) {
        this.authenticationInfo = authenticationInfo;
    },

    setAutoCommitting: function(autoCommitting) {
        this.autoCommitting = autoCommitting;
    },

    setChallengeRequests: function(challengeRequests) {
    	this.challengeRequests = challengeRequests;
    },

    setCommitted: function(committed) {
        this.committed = committed;
    },

    setCookieSettings: function(cookieSettings) {
    	this.cookieSettings = cookieSettings;
    },

    setDimensions: function(dimensions) {
    	this.dimensions = dimensions;
    },

    _setLocationRef: function(locationRef) {
        this.locationRef = locationRef;
    },

    setLocationRef: function(location) {
    	if (typeof location == "string") {
    		var baseRef = null;

    		if (this.getRequest().getResourceRef() != null) {
    			if (this.getRequest().getResourceRef().getBaseRef() != null) {
    				baseRef = this.getRequest().getResourceRef().getBaseRef();
    			} else {
    				baseRef = this.getRequest().getResourceRef();
    			}
    		}

    		this._setLocationRef(new Reference(baseRef, location).getTargetRef());
    	} else {
    		this._setLocationRef(location);
    	}
    },

	setProxyChallengeRequests: function(proxyChallengeRequests) {
		this.proxyChallengeRequests = proxyChallengeRequests;
    },

    setRequest: function(request) {
        this.request = request;
    },

    setRetryAfter: function(retryAfter) {
        this.retryAfter = retryAfter;
    },

    setServerInfo: function(serverInfo) {
        this.serverInfo = serverInfo;
    },

    _setStatus: function(status) {
        this.status = status;
    },

    setStatus: function(status, description) {
    	if (arguments.length==2 && arguments[0] instanceof Status && typeof arguments[1] == "string") {
    		var status = arguments[0];
    		var description = arguments[1];
            this._setStatus(new Status(status, description));
    	} else if (arguments.length==2 && arguments[0] instanceof Status && arguments[1] instanceof Error) {
    		var status = arguments[0];
    		var error = arguments[1];
    		this._setStatus(new Status(status, error));
    	} else if (arguments.length==3 && arguments[0] instanceof Status
    			&& arguments[1] instanceof Error && typeof arguments[2] == "string") {
    		var status = arguments[0];
    		var error = arguments[1];
    		var message = arguments[2];
    		this._setStatus(new Status(status, error, message));
    	}
    },

    toString: function() {
        return ((this.getRequest() == null) ? "?" : this.getRequest().getProtocol())
                					+ " - " + this.getStatus();
    }
});

var Method = new Class({
	initialize: function(name, description, uri, safe, idempotent) {
		this.name = name;
		this.description = description;
		this.uri = uri;
		this.safe = safe;
		this.idempotent = idempotent;
	},
	getName: function() {
		return this.name;
	},
    equals: function(status) {
    	return (this.getName()==status.getName());
    }
});

Method.extend({
    BASE_HTTP: "http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html",
    CONNECT: new Method("CONNECT",
        "Used with a proxy that can dynamically switch to being a tunnel",
        Method.BASE_HTTP + "#sec9.9", false, false),
	DELETE: new Method("DELETE",
	    "Requests that the origin server deletes the resource identified by the request URI",
	    Method.BASE_HTTP + "#sec9.7", false, true),
	GET: new Method("GET",
        "Retrieves whatever information (in the form of an entity) that is identified by the request URI",
        Method.BASE_HTTP + "#sec9.3", true, true),
	HEAD: new Method("HEAD",
        "Identical to GET except that the server must not return a message body in the response",
        Method.BASE_HTTP + "#sec9.4", true, true),
	OPTIONS: new Method("OPTIONS",
        "Requests for information about the communication options available on the request/response chain identified by the URI",
        Method.BASE_HTTP + "#sec9.2", true, true),
	POST: new Method("POST",
        "Requests that the origin server accepts the entity enclosed in the request as a new subordinate of the resource identified by the request URI",
        Method.BASE_HTTP + "#sec9.5", false, false),
	PUT: new Method("PUT",
        "Requests that the enclosed entity be stored under the supplied request URI",
        Method.BASE_HTTP + "#sec9.6", false, true),
	TRACE: new Method("TRACE",
        "Used to invoke a remote, application-layer loop-back of the request message",
        Method.BASE_HTTP + "#sec9.8", true, true)
});

var HeaderConstants = new Class({});

HeaderConstants.extend({
	EXPECT_CONTINUE: "100-continue",
    // --- Cache directives ---
	CACHE_NO_CACHE: "no-cache",
	CACHE_NO_STORE: "no-store",
	CACHE_MAX_AGE: "max-age",
	CACHE_MAX_STALE: "max-stale",
	CACHE_MIN_FRESH: "min-fresh",
	CACHE_NO_TRANSFORM: "no-transform",
	CACHE_ONLY_IF_CACHED: "only-if-cached",
	CACHE_PUBLIC: "public",
	CACHE_PRIVATE: "private",
	CACHE_MUST_REVALIDATE: "must-revalidate",
	CACHE_PROXY_MUST_REVALIDATE: "proxy-revalidate",
	CACHE_SHARED_MAX_AGE: "s-maxage",
	// --- Header names ---
	HEADER_ACCEPT: "Accept",
	HEADER_ACCEPT_CHARSET: "Accept-Charset",
	HEADER_ACCEPT_ENCODING: "Accept-Encoding",
	HEADER_ACCEPT_LANGUAGE: "Accept-Language",
	HEADER_ACCEPT_RANGES: "Accept-Ranges",
	HEADER_AGE: "Age",
	HEADER_ALLOW: "Allow",
	HEADER_AUTHENTICATION_INFO: "Authentication-Info",
	HEADER_AUTHORIZATION: "Authorization",
	HEADER_CACHE_CONTROL: "Cache-Control",
	HEADER_CONNECTION: "Connection",
	HEADER_CONTENT_DISPOSITION: "Content-Disposition",
	HEADER_CONTENT_ENCODING: "Content-Encoding",
	HEADER_CONTENT_LANGUAGE: "Content-Language",
	HEADER_CONTENT_LENGTH: "Content-Length",
	HEADER_CONTENT_LOCATION: "Content-Location",
	HEADER_CONTENT_MD5: "Content-MD5",
	HEADER_CONTENT_RANGE: "Content-Range",
	HEADER_CONTENT_TYPE: "Content-Type",
	HEADER_COOKIE: "Cookie",
	HEADER_DATE: "Date",
	HEADER_ETAG: "ETag",
	HEADER_EXPECT: "Expect",
	HEADER_EXPIRES: "Expires",
	HEADER_FROM: "From",
	HEADER_HOST: "Host",
	HEADER_IF_MATCH: "If-Match",
	HEADER_IF_MODIFIED_SINCE: "If-Modified-Since",
	HEADER_IF_NONE_MATCH: "If-None-Match",
	HEADER_IF_RANGE: "If-Range",
	HEADER_IF_UNMODIFIED_SINCE: "If-Unmodified-Since",
	HEADER_LAST_MODIFIED: "Last-Modified",
	HEADER_LOCATION: "Location",
	HEADER_MAX_FORWARDS: "Max-Forwards",
	HEADER_PRAGMA: "Pragma",
	HEADER_PROXY_AUTHENTICATE: "Proxy-Authenticate",
	HEADER_PROXY_AUTHORIZATION: "Proxy-Authorization",
	HEADER_RANGE: "Range",
	HEADER_REFERRER: "Referer",
	HEADER_RETRY_AFTER: "Retry-After",
	HEADER_SERVER: "Server",
	HEADER_SET_COOKIE: "Set-Cookie",
	HEADER_SET_COOKIE2: "Set-Cookie2",
	HEADER_SLUG: "Slug",
	HEADER_TRAILER: "Trailer",
	HEADER_TRANSFER_ENCODING: "Transfer-Encoding",
	HEADER_TRANSFER_EXTENSION: "TE",
	HEADER_UPGRADE: "Upgrade",
	HEADER_USER_AGENT: "User-Agent",
	HEADER_VARY: "Vary",
	HEADER_VIA: "Via",
	HEADER_WARNING: "Warning",
	HEADER_WWW_AUTHENTICATE: "WWW-Authenticate",
	HEADER_X_FORWARDED_FOR: "X-Forwarded-For",
	HEADER_X_HTTP_METHOD_OVERRIDE: "X-HTTP-Method-Override",
    // --- Attribute names ---
	ATTRIBUTE_HEADERS: "org.restlet.http.headers",
	ATTRIBUTE_VERSION: "org.restlet.http.version",
	ATTRIBUTE_HTTPS_CLIENT_CERTIFICATES: "org.restlet.https.clientCertificates",
	ATTRIBUTE_HTTPS_CIPHER_SUITE: "org.restlet.https.cipherSuite",
	ATTRIBUTE_HTTPS_KEY_SIZE: "org.restlet.https.keySize",
	ATTRIBUTE_HTTPS_SSL_SESSION_ID: "org.restlet.https.sslSessionId"
});

var CacheDirective = new Class(Parameter, {
    initialize: function(name, value, digit) {
        this.name = name;
        this.value = value;
        this.digit = digit;
    },

    isDigit: function() {
        return this.digit;
    },
    setDigit: function(digit) {
        this.digit = digit;
    }
});

CacheDirective.extend({ 
	maxAge: function(maxAge) {
		return new CacheDirective(HeaderConstants.CACHE_MAX_AGE,
						maxAge.toString(), true);
	},

	maxStale: function(maxStale) {
		if (maxStale==null) {
			return new CacheDirective(HeaderConstants.CACHE_MAX_STALE);
		} else {
		    return new CacheDirective(HeaderConstants.CACHE_MAX_STALE,
		            		maxStale.toString(), true);
		}
	},

	minFresh: function(minFresh) {
		return new CacheDirective(HeaderConstants.CACHE_MIN_FRESH,
						minFresh.toString(), true);
	},

	mustRevalidate: function() {
		return new CacheDirective(HeaderConstants.CACHE_MUST_REVALIDATE);
	},

	noCache: function(fieldNames) {
		if (fieldNames==null) {
			return new CacheDirective(HeaderConstants.CACHE_NO_CACHE);
		} else if (typeof fieldNames == "string") {
		    return new CacheDirective(HeaderConstants.CACHE_NO_CACHE, "\""
		            + fieldNames + "\"");
		} else {
		    var sb = new StringBuilder();

		    if (fieldNames != null) {
		        for (var i = 0; i < fieldNames.length; i++) {
		            sb.append("\"" + fieldNames[i] + "\"");

		            if (i < fieldNames.length - 1) {
		                sb.append(',');
		            }
		        }
		    }

		    return new CacheDirective(HeaderConstants.CACHE_NO_CACHE, sb.toString());
		}
	},

	noStore: function() {
		return new CacheDirective(HeaderConstants.CACHE_NO_STORE);
	},

	noTransform: function() {
		return new CacheDirective(HeaderConstants.CACHE_NO_TRANSFORM);
	},

	onlyIfCached: function() {
		return new CacheDirective(HeaderConstants.CACHE_ONLY_IF_CACHED);
	},

	privateInfo: function(fieldNames) {
		if (fieldNames==null) {
			return new CacheDirective(HeaderConstants.CACHE_PRIVATE);
		} else if (typeof fieldNames == "string") {
			var fieldName = fieldNames;
			return new CacheDirective(HeaderConstants.CACHE_PRIVATE, "\"" + fieldName + "\"");
		} else {
			var sb = new StringBuilder();

			if (fieldNames != null) {
				for (var i = 0; i < fieldNames.length; i++) {
					sb.append("\"" + fieldNames[i] + "\"");

					if (i < fieldNames.length - 1) {
						sb.append(',');
					}
				}
			}

			return new CacheDirective(HeaderConstants.CACHE_PRIVATE, sb.toString());
		}
	},

	proxyMustRevalidate: function() {
		return new CacheDirective(HeaderConstants.CACHE_PROXY_MUST_REVALIDATE);
	},

	publicInfo: function() {
		return new CacheDirective(HeaderConstants.CACHE_PUBLIC);
	},

	sharedMaxAge: function(sharedMaxAge) {
		return new CacheDirective(HeaderConstants.CACHE_SHARED_MAX_AGE,
						sharedMaxAge.toString(), true);
	}
});

var CharacterSet = new Class(Metadata, {
	initialize: function(name, description) {
		this.name = name;
		this.description = description;
	},
	getName: function() {
		return this.name;
	},
	getDescription: function() {
		return this.description;
	}
});

CharacterSet.extend({
	ALL: new CharacterSet("*", "All character sets"),
	ISO_8859_1: new CharacterSet(
        "ISO-8859-1", "ISO/IEC 8859-1 or Latin 1 character set"),
	ISO_8859_2: new CharacterSet(
        "ISO-8859-2", "ISO/IEC 8859-2 or Latin 2 character set"),
	ISO_8859_3: new CharacterSet(
        "ISO-8859-3", "ISO/IEC 8859-3 or Latin 3 character set"),
	ISO_8859_4: new CharacterSet(
        "ISO-8859-4", "ISO/IEC 8859-4 or Latin 4 character set"),
	ISO_8859_5: new CharacterSet(
        "ISO-8859-5", "ISO/IEC 8859-5 or Cyrillic character set"),
	ISO_8859_6: new CharacterSet(
        "ISO-8859-6", "ISO/IEC 8859-6 or Arabic character set"),
	ISO_8859_7: new CharacterSet(
        "ISO-8859-7", "ISO/IEC 8859-7 or Greek character set"),
	ISO_8859_8: new CharacterSet(
        "ISO-8859-8", "ISO/IEC 8859-8 or Hebrew character set"),
	ISO_8859_9: new CharacterSet(
        "ISO-8859-9", "ISO/IEC 8859-9 or Latin 5 character set"),
	ISO_8859_10: new CharacterSet(
        "ISO-8859-10", "ISO/IEC 8859-10 or Latin 6 character set"),
	MACINTOSH: new CharacterSet("macintosh",
        "Mac OS Roman character set"),
	US_ASCII: new CharacterSet("US-ASCII",
        "US ASCII character set"),
	UTF_16: new CharacterSet("UTF-16",
        "UTF 16 character set"),
	UTF_8: new CharacterSet("UTF-8",
        "UTF 8 character set"),
	WINDOWS_1252: new CharacterSet(
        "windows-1252", "Windows 1232 character set")
});

var Cookie = new Class({
    initialize: function() {
    	if (arguments.length==2 && typeof arguments[0]=="string") {
    		this.version = 0;
    		this.name = arguments[0];
    		this.value = arguments[1];
    	} else {
    		if (arguments.length>0) {
    			this.version = arguments[0];
    		}
    		if (arguments.length>1) {
    			this.name = arguments[1];
    		}
    		if (arguments.length>2) {
    			this.value = arguments[2];
    		}
    		if (arguments.length>3) {
    			this.path = arguments[3];
    		}
    		if (arguments.length>4) {
    			this.domain = arguments[4];
    		}
    	}
    },

    equals: function(obj) {
        // if obj == this no need to go further
        var result = (obj == this);

        if (!result) {
            result = obj instanceof Cookie;

            // if obj isn't a cookie or is null don't evaluate further
            if (result) {
                var that = obj;
                result = (((that.getName() == null) && (this.getName() == null)) || ((this.getName() != null) && this.getName()
                        .equals(that.getName())));

                // if names are both null or equal continue
                if (result) {
                    result = (((that.getValue() == null) && (this.getValue() == null)) || ((this.getValue() != null) && this.getValue()
                            .equals(that.getValue())));

                    // if values are both null or equal continue
                    if (result) {
                        result = (this.version == that.version);

                        // if versions are equal continue
                        if (result) {
                            result = (((that.getDomain() == null) && (this.getDomain() == null)) || ((this.getDomain() != null) && this.getDomain()
                                    .equals(that.getDomain())));

                            // if domains are equal continue
                            if (result) {
                                // compare paths taking
                                result = (((that.getPath() == null) && (this.getPath() == null)) || ((this.getPath() != null) && this.getPath()
                                        .equals(that.getPath())));
                            }
                        }
                    }
                }
            }
        }

        return result;
    },

    getDomain: function() {
        return this.domain;
    },

    getName: function() {
        return this.name;
    },

    getPath: function() {
        return this.path;
    },

    getValue: function() {
        return this.value;
    },

    getVersion: function() {
        return this.version;
    },

    setDomain: function(domain) {
        this.domain = domain;
    },

    setName: function(name) {
        this.name = name;
    },

    setPath: function(path) {
        this.path = path;
    },

    setValue: function(value) {
        this.value = value;
    },

    setVersion: function(version) {
        this.version = version;
    },

    toString: function() {
        return "Cookie [domain=" + this.domain + ", name=" + this.name + ", path=" + this.path
                + ", value=" + this.value + ", version=" + this.version + "]";
    }
});

var CookieSetting = new Class(Cookie, {
	initialize: function() {
    	if (arguments.length==2 && typeof arguments[0]=="string") {
    		this.version = 0;
    		this.name = arguments[0];
    		this.value = arguments[1];
    	} else {
    		if (arguments.length>0) {
    			this.version = arguments[0];
    		}
    		if (arguments.length>1) {
    			this.name = arguments[1];
    		}
    		if (arguments.length>2) {
    			this.value = arguments[2];
    		}
    		if (arguments.length>3) {
    			this.path = arguments[3];
    		}
    		if (arguments.length>4) {
    			this.domain = arguments[4];
    		}
    		if (arguments.length>5) {
    			this.comment = arguments[5];
    		}
    		if (arguments.length>6) {
    			this.maxAge = arguments[6];
    		}
    		if (arguments.length>7) {
    			this.secure = arguments[7];
    		}
    		if (arguments.length>8) {
    			this.accessRestricted = arguments[8];
    		}
    	}
    },

    equals: function(obj) {
        var result = (obj == this);

        // if obj == this no need to go further
        if (!result) {
            // test for equality at Cookie level i.e. name and value.
            if (this.callSuper(obj)) {
                // if obj isn't a cookie setting or is null don't evaluate
                // further
                if (obj instanceof CookieSetting) {
                    var that = obj;
                    result = (this.maxAge == that.maxAge)
                            && (this.secure == that.secure);

                    if (result) // if "maxAge" and "secure" properties are equal
                    // test comments
                    {
                        if (!(this.comment == null)) // compare comments
                        // taking care of nulls
                        {
                            result = (this.comment.equals(that.comment));
                        } else {
                            result = (that.comment == null);
                        }
                    }
                }
            }
        }

        return result;
    },

    getComment: function() {
        return this.comment;
    },

    getDescription: function() {
        return "Cookie setting";
    },

    getMaxAge: function() {
        return this.maxAge;
    },

    isAccessRestricted: function() {
        return this.accessRestricted;
    },

    isSecure: function() {
        return this.secure;
    },

    setAccessRestricted: function(accessRestricted) {
        this.accessRestricted = accessRestricted;
    },

    setComment: function(comment) {
        this.comment = comment;
    },

    setMaxAge: function(maxAge) {
        this.maxAge = maxAge;
    },

    setSecure: function(secure) {
        this.secure = secure;
    },

    toString: function() {
        return "CookieSetting [accessRestricted=" + this.accessRestricted
                + ", comment=" + this.comment + ", maxAge=" + this.maxAge + ", secure="
                + this.secure + ", domain=" + this.getDomain() + ", name=" + this.getName()
                + ", path=" + this.getPath() + ", value=" + this.getValue()
                + ", version=" + this.getVersion() + "]";
    }
});

var Conditions = new Class({
	initialize: function() {
		this.match = [];
		this.noneMatch = [];
	},

	getMatch: function() {
		if (this.match == null) {
			this.match = [];
		}
		return this.match;
	},

	getModifiedSince: function() {
		return this.modifiedSince;
	},

	getNoneMatch: function() {
		if (this.noneMatch == null) {
			this.noneMatch = [];
        }
		return this.noneMatch;
	},

	getRangeDate: function() {
		return this.rangeDate;
	},

	getRangeStatus: function() {
		var tag = null;
		var modificationDate = null;
		if (arguments.length==1) {
			var representationInfo = arguments[0];
            tag = (representationInfo == null) ? null
                    		: representationInfo.getTag();
            modificationDate = (representationInfo == null) ? null
            				: representationInfo.getModificationDate();
		} else if (arguments.length==2) {
			tag = arguments[0];
			modificationDate = arguments[1];
        } else {
        	throw new Error("The number of arguments isn't correct.");
		}

		var result = Status.CLIENT_ERROR_PRECONDITION_FAILED;
		if (this.getRangeTag() != null) {
			var all = this.getRangeTag().equals(Tag.ALL);

			// If a tag exists
			if (tag != null) {
				if (all || this.getRangeTag().equals(tag)) {
					result = Status.SUCCESS_OK;
				}
			}
		} else if (this.getRangeDate() != null) {
			// If a modification date exists
			if (this.getRangeDate().equals(modificationDate)) {
				result = Status.SUCCESS_OK;
			}
		}
		
		return result;
	},

	getRangeTag: function() {
		return this.rangeTag;
	},

	getStatus: function() {
		var method = null;
		var entityExists = false;
		var tag = null;
        var modificationDate = null;
        if (arguments.length==2) {
            method = arguments[0];
            var representationInfo = arguments[1];
            tag = (representationInfo == null) ? null : representationInfo.getTag();
            modificationDate = (representationInfo == null) ? null
                    		: representationInfo.getModificationDate();
        } else if (arguments.length==4) {
    		var method = arguments[0];
    		var entityExists = arguments[1];
    		var tag = arguments[2];
            var modificationDate = arguments[3];
        } else {
        	throw new Error("The number of arguments isn't correct.");
        }

	    var result = null;
	
	    // Is the "if-Match" rule followed or not?
	    if ((this.match != null) && !this.match.isEmpty()) {
	        var matched = false;
	        var failed = false;
	        var all = (this.getMatch().length > 0)
	                && this.getMatch()[0].equals(Tag.ALL);
	        var statusMessage = null;
	
	        if (entityExists) {
	            // If a tag exists
	            if (!all && (tag != null)) {
	                // Check if it matches one of the representations already
	                // cached by the client
	                var matchTag;
	
	                for (var i=0; !matched && i<this.getMatch().length; i++) {
	                	matchTag = this.getMatch()[i];
	                    matched = matchTag.equals(tag, false);
	                }
	            } else {
	                matched = all;
	            }
	        } else {
	            // See
	            // http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.24
	            // If none of the entity tags match, or if "*" is given and no
	            // current entity exists, the server MUST NOT perform the
	            // requested method
	            failed = all;
	            statusMessage = "A non existing resource can't match any tag.";
	        }
	
	        failed = failed || !matched;
	
	        if (failed) {
	            result = Status.CLIENT_ERROR_PRECONDITION_FAILED;
	            if (statusMessage != null) {
	                result = new Status(result, statusMessage);
	            }
	        }
	    }
	
	    // Is the "if-None-Match" rule followed or not?
	    if ((result == null) && (this.noneMatch != null)
	            && !this.noneMatch.isEmpty()) {
	        var matched = false;
	
	        if (entityExists) {
	            // If a tag exists
	            if (tag != null) {
	                // Check if it matches one of the representations
	                // already cached by the client
	                var noneMatchTag;
	
	                for (var i=0; !matched && i<this.getNoneMatch().length; i++) {
	                    noneMatchTag = this.getNoneMatch()[i];
	                    matched = noneMatchTag.equals(tag, (Method.GET
	                            .equals(method) || Method.HEAD.equals(method)));
	                }
	
	                // The current representation matches one of those already
	                // cached by the client
	                if (matched) {
	                    // Check if the current representation has been updated
	                    // since the "if-modified-since" date. In this case, the
	                    // rule is followed.
	                    var modifiedSince = this.getModifiedSince();
	                    var isModifiedSince = (modifiedSince != null)
	                            && (DateUtils.after(new Date(), modifiedSince)
	                                    || (modificationDate == null) || DateUtils
	                                    .after(modifiedSince, modificationDate));
	                    matched = !isModifiedSince;
	                }
	            } else {
	                matched = (this.getNoneMatch().size() > 0)
	                        && this.getNoneMatch().get(0).equals(Tag.ALL);
	            }
	        }
	
	        if (matched) {
	            if (Method.GET.equals(method) || Method.HEAD.equals(method)) {
	                result = Status.REDIRECTION_NOT_MODIFIED;
	            } else {
	                result = Status.CLIENT_ERROR_PRECONDITION_FAILED;
	            }
	        }
	    }
	
	    // Is the "if-Modified-Since" rule followed or not?
	    if ((result == null) && (this.getModifiedSince() != null)) {
	        var modifiedSince = this.getModifiedSince();
	        var isModifiedSince = (DateUtils.after(new Date(),
	                modifiedSince) || (modificationDate == null) || DateUtils
	                .after(modifiedSince, modificationDate));
	
	        if (!isModifiedSince) {
	            if (Method.GET.equals(method) || Method.HEAD.equals(method)) {
	                result = Status.REDIRECTION_NOT_MODIFIED;
	            } else {
	                result = Status.CLIENT_ERROR_PRECONDITION_FAILED;
	            }
	        }
	    }
	
	    // Is the "if-Unmodified-Since" rule followed or not?
	    if ((result == null) && (this.getUnmodifiedSince() != null)) {
	        var unModifiedSince = this.getUnmodifiedSince();
	        var isUnModifiedSince = ((unModifiedSince == null)
	                || (modificationDate == null) || !DateUtils.before(
	                modificationDate, unModifiedSince));
	
	        if (!isUnModifiedSince) {
	            result = Status.CLIENT_ERROR_PRECONDITION_FAILED;
	        }
	    }
	
	    return result;
	},

	getUnmodifiedSince: function() {
		return this.unmodifiedSince;
	},

	hasSome: function() {
		return (((this.match != null) && !this.match.isEmpty())
				|| ((this.noneMatch != null) && !this.noneMatch.isEmpty())
				|| (this.getModifiedSince() != null) || (this.getUnmodifiedSince() != null));
	},

	hasSomeRange: function() {
		return this.getRangeTag() != null || this.getRangeDate() != null;
	},

	setMatch: function(tags) {
		this.match = tags;
	},

	setModifiedSince: function(date) {
		//TODO: unmodifiable date
		this.modifiedSince = date;
	},

	setNoneMatch: function(tags) {
		this.noneMatch = tags;
	},

	setRangeDate: function(rangeDate) {
		this.rangeDate = rangeDate;
	},

	setRangeTag: function(rangeTag) {
		this.rangeTag = rangeTag;
	},

	setUnmodifiedSince: function(date) {
		//TODO: unmodifiable date
		this.unmodifiedSince = date;
	}
});

var Dimension = new Class({});

Dimension.extend({
	AUTHORIZATION: "authorization",
	CHARACTER_SET: "character_set",
	CLIENT_ADDRESS: "client_address",
	CLIENT_AGENT: "client_agent",
	UNSPECIFIED: "unspecified",
	ENCODING: "encoding",
	LANGUAGE: "language",
	MEDIA_TYPE: "media_type",
	TIME: "time"
});

var Disposition = new Class({
    initialize: function(type, parameters) {
        this.type = type;
        this.parameters = parameters;
    },

    addDate: function(name, value) {
        this.getParameters().add(name,
                DateUtils.format(value, DateUtils.FORMAT_RFC_822.get(0)));
    },

    getFilename: function() {
        return this.getParameters().getFirstValue(Disposition.NAME_FILENAME, true);
    },

    getParameters: function() {
        if (this.parameters == null) {
            this.parameters = new Series();
        }

        return this.parameters;
    },

    getType: function() {
        return this.type;
    },

    setCreationDate: function(value) {
        this.setDate(Disposition.NAME_CREATION_DATE, value);
    },

    setDate: function(name, value) {
        this.getParameters().set(name,
                DateUtils.format(value, DateUtils.FORMAT_RFC_822.get(0)), true);
    },

    setFilename: function(fileName) {
        this.getParameters().set(Disposition.NAME_FILENAME, fileName, true);
    },

    setModificationDate: function(value) {
        this.setDate(Disposition.NAME_MODIFICATION_DATE, value);
    },

    setParameters: function(parameters) {
        this.parameters = parameters;
    },

    setReadDate: function(value) {
        this.setDate(Disposition.NAME_READ_DATE, value);
    },

    setSize: function(size) {
        this.getParameters().set(Disposition.NAME_SIZE, size.toString(), true);
    },

    setType: function(type) {
        this.type = type;
    }

});

Disposition.extend({
    NAME_CREATION_DATE: "creation-date",
    NAME_FILENAME: "filename",
    NAME_MODIFICATION_DATE: "modification-date",
    NAME_READ_DATE: "read-date",
    NAME_SIZE: "size",
    TYPE_ATTACHMENT: "attachment",
    TYPE_INLINE: "inline",
    TYPE_NONE: "none"
});

var ContentType = new Class({
	initialize: function(value) {
		var index = -1;
		if ((index = value.indexOf(";"))!=-1) {
			this.mediaType = new MediaType(value.substring(0,index));
			this.characterSet = new CharacterSet(value.substring(index+1));
		} else {
			this.mediaType = new MediaType(value);
		}
	},
	getMediaType: function() {
		return this.mediaType;
	},
	getCharacterSet: function() {
		return this.characterSet;
	} 
});

var Parameter = new Class({
	initialize: function(name, value) {
		this.name = name;
		this.value = value;
	},
	getName: function() {
		return this.name;
	},
	getValue: function() {
		return this.value;
	}
});

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

var Encoding = new Class(Metadata, {
	initialize: function(name, description) {
		this.callSuper(name, description);
		/*if (description==null) {
			description = "Encoding applied to a representation";
		}
        this.name = name;
        this.description = description;*/
	}
});
Encoding.extend({
    /** All encodings acceptable. */
    ALL: new Encoding("*", "All encodings"),
    /** The common Unix file compression. */
    COMPRESS: new Encoding("compress",
            	"Common Unix compression"),
    /** The zlib format defined by RFC 1950 and 1951. */
    DEFLATE: new Encoding("deflate",
            "Deflate compression using the zlib format"),
    FREEMARKER: new Encoding("freemarker",
            "FreeMarker templated representation"),
    /** The GNU Zip encoding. */
    GZIP: new Encoding("gzip", "GZip compression"),
    /** The default (identity) encoding. */
    IDENTITY: new Encoding("identity",
            "The default encoding with no transformation"),
    /** The Velocity encoding. */
    VELOCITY: new Encoding("velocity",
            "Velocity templated representation"),
    /** The Info-Zip encoding. */
    ZIP: new Encoding("zip", "Zip compression"),
    valueOf: function(name) {
        var result = null;

        if ((name != null) && !name.equals("")) {
            if (name.equalsIgnoreCase(Encoding.ALL.getName())) {
                result = Encoding.ALL;
            } else if (name.equalsIgnoreCase(Encoding.GZIP.getName())) {
                result = Encoding.GZIP;
            } else if (name.equalsIgnoreCase(Encoding.ZIP.getName())) {
                result = Encoding.ZIP;
            } else if (name.equalsIgnoreCase(Encoding.COMPRESS.getName())) {
                result = Encoding.COMPRESS;
            } else if (name.equalsIgnoreCase(Encoding.DEFLATE.getName())) {
                result = Encoding.DEFLATE;
            } else if (name.equalsIgnoreCase(Encoding.IDENTITY.getName())) {
                result = Encoding.IDENTITY;
            } else if (name.equalsIgnoreCase(Encoding.FREEMARKER.getName())) {
                result = Encoding.FREEMARKER;
            } else if (name.equalsIgnoreCase(Encoding.VELOCITY.getName())) {
                result = Encoding.VELOCITY;
            } else {
                result = new Encoding(name);
            }
        }

        return result;
    }
});

var Series = new Class({
	initialize: function() {
		this.array = [];
	},

	// Specific method for JS
	getElements: function() {
		return this.array;
	},
	
	size: function() {
		return this.array.length;
	},
	
	isEmpty: function() {
		return (this.size()==0);
	},
	
	add: function() {
		if (arguments.length==1) {
			return this.array.push(arguments[0]);
		} else if (arguments.length==2) {
			var name = arguments[0];
			var value = arguments[1];
			return this.array.push(this.createEntry(name, value));
		} else {
			throw new Error("The number of arguments isn't correct.");
		}
	},

	createEntry: function(name, value) {
		return new Parameter(name, value);
	},
	
	equals: function(value1, value2, ignoreCase) {
		var result = (value1 == value2);

		if (!result) {
			if ((value1 != null) && (value2 != null)) {
				if (ignoreCase) {
					result = value1.equalsIgnoreCase(value2);
				} else {
					result = value1.equals(value2);
				}
			}
		}

		return result;
	},

	getFirst: function(name, ignoreCase) {
		if (ignoreCase==null) {
			ignoreCase = false;
		}

		for (var i=0; i<this.array.length; i++) {
			var param = this.array[i];
			if (this.equals(param.getName(), name, ignoreCase)) {
				return param;
			}
		}

		return null;
	},

	getFirstValue: function() {
		var name = arguments[0];
		var ignoreCase= false;
		var defaultValue = null;
		if (arguments.length==2 && typeof arguments[1] == "string") {
			defaultValue = arguments[1];
		} else if (arguments.length==2) {
			ignoreCase = arguments[1]
		}

		var result = defaultValue;
		var param = this.getFirst(name, ignoreCase);

		if ((param != null) && (param.getValue() != null)) {
			result = param.getValue();
		}

		return result;
	},

	//public String getFirstValue(String name, String defaultValue) {

	getNames: function() {
		var result = [];

		for (var i=0; i<this.array.length; i++) {
			var param = this.array[i];
			result.push(param.getName());
		}

		return result;
	},

	getValues: function(name, separator, ignoreCase) {
		if (separator==null) {
			separator = ",";
		}
		if (ignoreCase==null) {
			ignoreCase = true;
		}
		var result = null;
		var sb = null;

		for (var i=0; i<this.array.length; i++) {
			var param = this.array[i];
			if ((ignoreCase && param.getName().equalsIgnoreCase(name))
					|| param.getName().equals(name)) {
				if (sb == null) {
					if (result == null) {
						result = param.getValue();
					} else {
						sb = new StringBuilder();
						sb.append(result).append(separator)
								.append(param.getValue());
					}
				} else {
					sb.append(separator).append(param.getValue());
				}
			}
		}

		if (sb != null) {
			result = sb.toString();
		}

		return result;
	},

	getValuesArray: function() {
		var name = arguments[0];
		var ignoreCase= false;
		var defaultValue = null;
		if (arguments.length==2 && typeof arguments[1] == "string") {
			defaultValue = arguments[1];
		} else if (arguments.length==2) {
			ignoreCase = arguments[1]
		}

		var result = null;
		var params = this.subList(name, ignoreCase);

		if ((params.size() == 0) && (defaultValue != null)) {
			result = [];
			result.push(defaultValue);
		} else {
			result = [];

			for (var i = 0; i < params.length; i++) {
				result.push(params.get[i].getValue());
			}
		}

		return result;
	},

	getValuesMap: function() {
		var result = {};

		for (var i=0; i<this.array.length; i++) {
			var param = this.array[i];
			if (!result[param.getName()]) {
				result[param.getName()] = param.getValue();
			}
		}

		return result;
	},

	removeAll: function(name, ignoreCase) {
		if (ignoreCase==null) {
			ignoreCase = false;
		}

		var changed = false;
		var param = null;

		for (var i=0; i<this.array.length; i++) {
			var param = this.array[i];
			if (this.equals(param.getName(), name, ignoreCase)) {
				this.array.splice(i, i);
				i--;
				changed = true;
			}
		}

		return changed;
	},

	removeFirst: function(name, ignoreCase) {
		if (ignoreCase==null) {
			ignoreCase = false;
		}
		var changed = false;
		var param = null;

		for (var i=0; i<this.array.length && !changed; i++) {
			param = this.array[i];
			if (this.equals(param.getName(), name, ignoreCase)) {
				this.array.splice(i, i);
				i--;
				changed = true;
			}
		}

		return changed;
	},

	set: function(name, value, ignoreCase) {
		if (ignoreCase==null) {
			ignoreCase = false;
		}
		var result = null;
		var param = null;
		var found = false;

		for (var i=0; i<this.array.length; i++) {
			param = this.array[i];
			if (this.equals(param.getName(), name, ignoreCase)) {
				if (found) {
					// Remove other entries with the same name
					this.array.splice(i, i);
					i--;
				} else {
					// Change the value of the first matching entry
					found = true;
					param.setValue(value);
					result = param;
				}
			}
		}

		if (!found) {
			this.add(name, value);
		}

		return result;
		
	},

	subList: function(name, ignoreCase) {
		if (ignoreCase==null) {
			ignoreCase = false;
		}

		var result = [];

		for (var i=0; i<this.array.length; i++) {
			var param = this.array[i];
			if (this.equals(param.getName(), name, ignoreCase)) {
				result.add(param);
			}
		}

		return result;
	}

});

var Form = new Class(Series, {
	initialize: function() {
		this.callSuper();
	},

	createEntry: function(name, value) {
		return new Parameter(name, value);
	},

	encode: function(characterSet, separator) {
		if (characterSet==null) {
			characterSet = CharacterSet.UTF_8;
		}
		if (separator==null) {
			separator = "&";
		}
		var sb = new StringBuilder();

		for (var i = 0; i < this.size(); i++) {
			if (i > 0) {
				sb.append(separator);
			}

			this.get(i).encode(sb, characterSet);
		}

		return sb.toString();
	},

	getMatrixString: function(characterSet) {
		if (characterSet==null) {
			characterSet = CharacterSet.UTF_8;
		}

		try {
			return this.encode(characterSet, ';');
		} catch (err) {
			return null;
		}
	},

	getQueryString: function(characterSet) {
		if (characterSet==null) {
			characterSet = CharacterSet.UTF_8;
		}

		try {
			return this.encode(characterSet);
		} catch (err) {
			return null;
		}
	},

	getWebRepresentation: function(characterSet) {
		if (characterSet==null) {
			characterSet = CharacterSet.UTF_8;
		}

		return new StringRepresentation(this.getQueryString(characterSet),
				MediaType.APPLICATION_WWW_FORM, null, characterSet);
	}
});

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

var Preference = new Class({
	initialize: function(metadata, quality, parameters) {
        this.metadata = metadata;
        if (quality==null) {
        	this.quality = 1;
        } else {
        	this.quality = quality;
        }
        
        this.parameters = parameters;
	},

    getMetadata: function() {
        return this.metadata;
    },

    getParameters: function() {
        if (this.parameters == null) {
        	this.parameters = new Series();
        }
        return this.parameters;
    },

    getQuality: function() {
        return this.quality;
    },

    setMetadata: function(metadata) {
        this.metadata = metadata;
    },

    setParameters: function(parameters) {
        this.parameters = parameters;
    },

    setQuality: function(quality) {
        this.quality = quality;
    },

    toString: function() {
        return (this.getMetadata() == null) ? ""
                : (this.getMetadata().getName() + ":" + this.getQuality());
    }
});

var Range = new Class({
	initialize: function(index, size) {
		if (index==null) {
			this.index = Range.INDEX_FIRST;
		} else {
			this.index = index;
		}
		
		if (size==null) {
			this.size = Range.SIZE_MAX;
		} else {
			this.size = size;
		}
	},

    equals: function(object) {
        return (object instanceof Range)
                && object.getIndex() == this.getIndex()
                && object.getSize() == this.getSize();
    },

    getIndex: function() {
        return this.index;
    },

    getSize: function() {
        return this.size;
    },

    isIncluded: function(position, totalSize) {
        var result = false;

        if (this.getIndex() == Range.INDEX_LAST) {
            // The range starts from the end
            result = (0 <= position) && (position < totalSize);

            if (result) {
                result = position >= (totalSize - this.getSize());
            }
        } else {
            // The range starts from the beginning
            result = position >= this.getIndex();

            if (result && (this.getSize() != Range.SIZE_MAX)) {
                result = position < this.getIndex() + this.getSize();
            }
        }

        return result;
    },

    setIndex: function(index) {
        this.index = index;
    },

    setSize: function(size) {
        this.size = size;
    }
});

Range.extend({
	INDEX_FIRST: 0,
    INDEX_LAST: -1,
	SIZE_MAX: -1
});

var RecipientInfo = new Class({
	initialize: function(protocol, name, agent) {
        this.protocol = protocol;
        this.name = name;
        this.comment = agent;
    },

    getComment: function() {
        return this.comment;
    },

    getName: function() {
        return this.name;
    },

    getProtocol: function() {
        return this.protocol;
    },

    setComment: function(comment) {
        this.comment = comment;
    },

    setName: function(name) {
        this.name = name;
    },

    setProtocol: function(protocol) {
        this.protocol = protocol;
    }
});

var Tag = new Class({
	initialize: function(opaqueTag, weak) {
		this.name = opaqueTag;
		if (weak==null) {
			this.weak = true;
		} else {
			this.weak = weak;
		}
	},

    equals: function(object, checkWeakness) {
    	if (checkWeakness==null) {
    		checkWeakness = true;
    	}
        var result = (object != null) && (object instanceof Tag);

        if (result) {
            var that = object;

            if (checkWeakness) {
                result = (that.isWeak() == this.isWeak());
            }

            if (result) {
                if (this.getName() == null) {
                    result = (that.getName() == null);
                } else {
                    result = this.getName().equals(that.getName());
                }
            }
        }

        return result;
    },

    format: function() {
        if (this.getName().equals("*")) {
            return "*";
        }

        var sb = new StringBuilder();
        if (this.isWeak()) {
            sb.append("W/");
        }
        return sb.append('"').append(this.getName()).append('"').toString();
    },

    getName: function() {
        return this.name;
    },

    isWeak: function() {
        return this.weak;
    },

    toString: function() {
        return this.getName();
    }
});

Tag.extend({
    parse: function(httpTag) {
        var result = null;
        var weak = false;
        var httpTagCopy = httpTag;

        if (httpTagCopy.startsWith("W/")) {
            weak = true;
            httpTagCopy = httpTagCopy.substring(2);
        }

        if (httpTagCopy.startsWith("\"") && httpTagCopy.endsWith("\"")) {
            result = new Tag(
                    httpTagCopy.substring(1, httpTagCopy.length() - 1), weak);
        } else if (httpTagCopy.equals("*")) {
            result = new Tag("*", weak);
        } else {
            /*Context.getCurrentLogger().log(Level.WARNING,
                    "Invalid tag format detected: " + httpTagCopy);*/
        }

        return result;
    }
});

Tag.ALL = Tag.parse("*");

var Warning = new Class({
    getAgent: function() {
        return this.agent;
    },

    getDate: function() {
        return this.date;
    },

    getStatus: function() {
        return this.status;
    },

    getText: function() {
        return this.text;
    },

    setAgent: function(agent) {
        this.agent = agent;
    },

    setDate: function(date) {
        this.date = date;
    },

    setStatus: function(status) {
        this.status = status;
    },

    setText: function(text) {
        this.text = text;
    }
});

var HeaderReaderUtils = new Class({});

HeaderReaderUtils.extend({
	
});

var HeaderWriterUtils = new Class({});

HeaderWriterUtils.extend({
	
});

var HeaderUtils = new Class({});

HeaderUtils.extend({
	addEntityHeaders: function(entity, headers) {
        if (entity == null || !entity.isAvailable()) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_CONTENT_LENGTH, "0", headers);
        } else if (entity.getAvailableSize() != Representation.UNKNOWN_SIZE) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_CONTENT_LENGTH,
                    entity.getAvailableSize().toString(), headers);
        }

        if (entity != null) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_CONTENT_ENCODING,
                    EncodingWriter.write(entity.getEncodings()), headers);
        	HeaderUtils.addHeader(HeaderConstants.HEADER_CONTENT_LANGUAGE,
                    LanguageWriter.write(entity.getLanguages()), headers);

            if (entity.getLocationRef() != null) {
            	HeaderUtils.addHeader(HeaderConstants.HEADER_CONTENT_LOCATION, entity
                        .getLocationRef().getTargetRef().toString(), headers);
            }

            if (entity.getRange() != null) {
            	HeaderUtils.addHeader(HeaderConstants.HEADER_CONTENT_RANGE,
                        RangeWriter.write(entity.getRange(), entity.getSize()),
                        headers);
            }

            if (entity.getMediaType() != null) {
                var contentType = entity.getMediaType().toString();
 
                // Specify the character set parameter if required
                if ((entity.getMediaType().getParameters()
                        .getFirstValue("charset") == null)
                        && (entity.getCharacterSet() != null)) {
                    contentType = contentType + "; charset="
                            + entity.getCharacterSet().getName();
                }

                HeaderUtils.addHeader(HeaderConstants.HEADER_CONTENT_TYPE, contentType,
                        headers);
            }

            if (entity.getExpirationDate() != null) {
            	HeaderUtils.addHeader(HeaderConstants.HEADER_EXPIRES,
                        DateWriter.write(entity.getExpirationDate()), headers);
            }

            if (entity.getModificationDate() != null) {
            	HeaderUtils.addHeader(HeaderConstants.HEADER_LAST_MODIFIED,
                        DateWriter.write(entity.getModificationDate()), headers);
            }

            if (entity.getTag() != null) {
            	HeaderUtils.addHeader(HeaderConstants.HEADER_ETAG,
                        TagWriter.write(entity.getTag()), headers);
            }

            if (entity.getDisposition() != null
                    && !Disposition.TYPE_NONE.equals(entity.getDisposition()
                            .getType())) {
            	HeaderUtils.addHeader(HeaderConstants.HEADER_CONTENT_DISPOSITION,
                        DispositionWriter.writeObject(entity.getDisposition()),
                        headers);
            }
        }
	},
	addExtensionHeaders: function(existingHeaders, additionalHeaders) {
        if (additionalHeaders != null) {
        	var elements = additionalHeaders.getElements();
            for (var cpt=0;cpt<elements.length;cpt++) {
            	var param = elements[cpt];
                if (param.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_ACCEPT)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_ACCEPT_CHARSET)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_ACCEPT_ENCODING)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_ACCEPT_LANGUAGE)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_ACCEPT_RANGES)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_AGE)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_ALLOW)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_AUTHENTICATION_INFO)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_AUTHORIZATION)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_CACHE_CONTROL)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_CONNECTION)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_CONTENT_DISPOSITION)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_CONTENT_ENCODING)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_CONTENT_LANGUAGE)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_CONTENT_LENGTH)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_CONTENT_LOCATION)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_CONTENT_MD5)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_CONTENT_RANGE)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_CONTENT_TYPE)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_COOKIE)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_DATE)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_ETAG)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_EXPECT)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_EXPIRES)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_FROM)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_HOST)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_IF_MATCH)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_IF_MODIFIED_SINCE)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_IF_NONE_MATCH)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_IF_RANGE)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_IF_UNMODIFIED_SINCE)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_LAST_MODIFIED)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_LOCATION)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_MAX_FORWARDS)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_PROXY_AUTHENTICATE)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_PROXY_AUTHORIZATION)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_RANGE)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_REFERRER)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_RETRY_AFTER)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_SERVER)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_SET_COOKIE)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_SET_COOKIE2)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_USER_AGENT)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_VARY)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_VIA)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_WARNING)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_WWW_AUTHENTICATE)) {
                    // Standard headers that can't be overridden
                    /*Context.getCurrentLogger()
                            .warning(
                                    "Addition of the standard header \""
                                            + param.getName()
                                            + "\" is not allowed. Please use the equivalent property in the Restlet API.");*/
                } else if (param.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_PRAGMA)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_TRAILER)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_TRANSFER_ENCODING)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_TRANSFER_EXTENSION)
                        || param.getName().equalsIgnoreCase(
                                HeaderConstants.HEADER_UPGRADE)) {
                    // Standard headers that shouldn't be overridden
                    /*Context.getCurrentLogger()
                            .info("Addition of the standard header \""
                                    + param.getName()
                                    + "\" is discouraged as a future version of the Restlet API will directly support it.");*/
                    existingHeaders.push(param);
                } else {
                    existingHeaders.push(param);
                }
            }
        }
	},
	addGeneralHeaders: function(message, headers) {
		HeaderUtils.addHeader(HeaderConstants.HEADER_CACHE_CONTROL,
                CacheDirectiveWriter.write(message.getCacheDirectives()),
                headers);
        if (message.getDate() == null) {
            message.setDate(new Date());
        }
        HeaderUtils.addHeader(HeaderConstants.HEADER_DATE,
                DateWriter.write(message.getDate()), headers);
        HeaderUtils.addHeader(HeaderConstants.HEADER_VIA,
                RecipientInfoWriter.write(message.getRecipientsInfo()), headers);
        HeaderUtils.addHeader(HeaderConstants.HEADER_WARNING,
                WarningWriter.write(message.getWarnings()), headers);
	},
	addHeader: function(headerName, headerValue, headers) {
        if ((headerName != null) && (headerValue != null)
                && (headerValue.length > 0)) {
            try {
                headers.push(new Parameter(headerName, headerValue));
            } catch (err) {
                /*Context.getCurrentLogger().log(Level.WARNING,
                        "Unable to format the " + headerName + " header", t);*/
            }
        }
	},
	addNotModifiedEntityHeaders: function(entity, headers) {
        if (entity != null) {
            if (entity.getTag() != null) {
                HeaderUtils.addHeader(HeaderConstants.HEADER_ETAG,
                        TagWriter.write(entity.getTag()), headers);
            }

            if (entity.getLocationRef() != null) {
                HeaderUtils.addHeader(HeaderConstants.HEADER_CONTENT_LOCATION,
                        entity.getLocationRef().getTargetRef().toString(),
                        headers);
            }
        }
	},
	addRequestHeaders: function(request, headers) {
        var clientInfo = request.getClientInfo();

        if (!clientInfo.getAcceptedMediaTypes().isEmpty()) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_ACCEPT,
                    PreferenceWriter.write(clientInfo.getAcceptedMediaTypes()),
                    headers);
        } else {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_ACCEPT, MediaType.ALL.getName(),
                    headers);
        }

        if (!clientInfo.getAcceptedCharacterSets().isEmpty()) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_ACCEPT_CHARSET,
                    PreferenceWriter.write(clientInfo
                            .getAcceptedCharacterSets()), headers);
        }

        if (!clientInfo.getAcceptedEncodings().isEmpty()) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_ACCEPT_ENCODING,
                    PreferenceWriter.write(clientInfo.getAcceptedEncodings()),
                    headers);
        }

        if (!clientInfo.getAcceptedLanguages().isEmpty()) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_ACCEPT_LANGUAGE,
                    PreferenceWriter.write(clientInfo.getAcceptedLanguages()),
                    headers);
        }

        if (clientInfo.getFrom() != null) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_FROM, request.getClientInfo()
                    .getFrom(), headers);
        }

        // Manually add the host name and port when it is potentially
        // different from the one specified in the target resource reference.
        var hostRef = (request.getResourceRef().getBaseRef() != null) ? request
                .getResourceRef().getBaseRef() : request.getResourceRef();

        if (hostRef.getHostDomain() != null) {
            var host = hostRef.getHostDomain();
            var hostRefPortValue = hostRef.getHostPort();

            if ((hostRefPortValue != -1)
                    && (hostRefPortValue != request.getProtocol()
                            .getDefaultPort())) {
                host = host + ':' + hostRefPortValue;
            }

            HeaderUtils.addHeader(HeaderConstants.HEADER_HOST, host, headers);
        }

        var conditions = request.getConditions();
        HeaderUtils.addHeader(HeaderConstants.HEADER_IF_MATCH,
                TagWriter.write(conditions.getMatch()), headers);
        HeaderUtils.addHeader(HeaderConstants.HEADER_IF_NONE_MATCH,
                TagWriter.write(conditions.getNoneMatch()), headers);

        if (conditions.getModifiedSince() != null) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_IF_MODIFIED_SINCE,
                    DateWriter.write(conditions.getModifiedSince()), headers);
        }

        if (conditions.getRangeTag() != null
                && conditions.getRangeDate() != null) {
            //Context.getCurrentLogger()
            //        .log(Level.WARNING,
            //                "Unable to format the HTTP If-Range header due to the presence of both entity tag and modification date.");
        } else if (conditions.getRangeTag() != null) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_IF_RANGE,
                    TagWriter.write(conditions.getRangeTag()), headers);
        } else if (conditions.getRangeDate() != null) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_IF_RANGE,
                    DateWriter.write(conditions.getRangeDate()), headers);
        }

        if (conditions.getUnmodifiedSince() != null) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_IF_UNMODIFIED_SINCE,
                    DateWriter.write(conditions.getUnmodifiedSince()), headers);
        }

        if (request.getMaxForwards() > -1) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_MAX_FORWARDS,
                    request.getMaxForwards().toString(), headers);
        }

        if (!request.getRanges().isEmpty()) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_RANGE,
                    RangeWriter.write(request.getRanges()), headers);
        }

        if (request.getReferrerRef() != null) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_REFERRER, request.getReferrerRef()
                    .toString(), headers);
        }

        if (request.getClientInfo().getAgent() != null) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_USER_AGENT, request
                    .getClientInfo().getAgent(), headers);
        } else {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_USER_AGENT, Engine.VERSION_HEADER,
                    headers);
        }

        // ----------------------------------
        // 3) Add supported extension headers
        // ----------------------------------

        if (request.getCookies().size() > 0) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_COOKIE,
                    CookieWriter.writeCollection(request.getCookies()), headers);
        }

        // -------------------------------------
        // 4) Add user-defined extension headers
        // -------------------------------------
        var additionalHeaders = request
                .getAttributes()[HeaderConstants.ATTRIBUTE_HEADERS];
        HeaderUtils.addExtensionHeaders(headers, additionalHeaders);

        // ---------------------------------------
        // 5) Add authorization headers at the end
        // ---------------------------------------

        // Add the security headers. NOTE: This must stay at the end because
        // the AWS challenge scheme requires access to all HTTP headers
        /*ChallengeResponse challengeResponse = request.getChallengeResponse();
        if (challengeResponse != null) {
            this.addHeader(
                    HeaderConstants.HEADER_AUTHORIZATION,
                    AuthenticatorUtils
                            .formatResponse(challengeResponse, request, headers),
                    headers);
        }

        ChallengeResponse proxyChallengeResponse = request
                .getProxyChallengeResponse();
        if (proxyChallengeResponse != null) {
            addHeader(HeaderConstants.HEADER_PROXY_AUTHORIZATION,
                    AuthenticatorUtils
                            .formatResponse(proxyChallengeResponse, request,
                                    headers), headers);
        }*/
	},
	addResponseHeaders: function(response, headers) {
        if (response.getServerInfo().isAcceptingRanges()) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_ACCEPT_RANGES, "bytes", headers);
        }

        if (response.getAge() > 0) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_AGE,
                    	response.getAge().toString(), headers);
        }

        if (response.getStatus().equals(Status.CLIENT_ERROR_METHOD_NOT_ALLOWED)
                || Method.OPTIONS.equals(response.getRequest().getMethod())) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_ALLOW,
                    MethodWriter.write(response.getAllowedMethods()), headers);
        }

        if (response.getLocationRef() != null) {
            // The location header must contain an absolute URI.
        	HeaderUtils.addHeader(HeaderConstants.HEADER_LOCATION, response
                    .getLocationRef().getTargetRef().toString(), headers);
        }

        //TODO:
        /*if (response.getProxyChallengeRequests() != null) {
            for (ChallengeRequest challengeRequest : response
                    .getProxyChallengeRequests()) {
                addHeader(HeaderConstants.HEADER_PROXY_AUTHENTICATE,
                        org.restlet.engine.security.AuthenticatorUtils
                                .formatRequest(challengeRequest, response,
                                        headers), headers);
            }
        }*/

        if (response.getRetryAfter() != null) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_RETRY_AFTER,
                    DateWriter.write(response.getRetryAfter()), headers);
        }

        if ((response.getServerInfo() != null)
                && (response.getServerInfo().getAgent() != null)) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_SERVER, response.getServerInfo()
                    .getAgent(), headers);
        } else {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_SERVER, Engine.VERSION_HEADER,
                    headers);
        }

        // Send the Vary header only to none-MSIE user agents as MSIE seems
        // to support partially and badly this header (cf issue 261).
        if (!((response.getRequest().getClientInfo().getAgent() != null) && response
                .getRequest().getClientInfo().getAgent().contains("MSIE"))) {
            // Add the Vary header if content negotiation was used
        	HeaderUtils.addHeader(HeaderConstants.HEADER_VARY,
                    DimensionWriter.write(response.getDimensions()), headers);
        }

        // Set the security data
        //TODO:
        /*if (response.getChallengeRequests() != null) {
            for (ChallengeRequest challengeRequest : response
                    .getChallengeRequests()) {
                addHeader(HeaderConstants.HEADER_WWW_AUTHENTICATE,
                        org.restlet.engine.security.AuthenticatorUtils
                                .formatRequest(challengeRequest, response,
                                        headers), headers);
            }
        }*/

        // ----------------------------------
        // 3) Add supported extension headers
        // ----------------------------------

        // Add the Authentication-Info header
        /*if (response.getAuthenticationInfo() != null) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_AUTHENTICATION_INFO,
                    org.restlet.engine.security.AuthenticatorUtils
                            .formatAuthenticationInfo(response
                                    .getAuthenticationInfo()), headers);
        }*/

        // Cookies settings should be written in a single header, but Web
        // browsers does not seem to support it.
        //TODO:
        /*for (CookieSetting cookieSetting : response.getCookieSettings()) {
        	HeaderUtils.addHeader(HeaderConstants.HEADER_SET_COOKIE,
                    CookieSettingWriter.write(cookieSetting), headers);
        }*/

        // -------------------------------------
        // 4) Add user-defined extension headers
        // -------------------------------------

        var additionalHeaders = response
                .getAttributes()[HeaderConstants.ATTRIBUTE_HEADERS];
        HeaderUtils.addExtensionHeaders(headers, additionalHeaders);
	},
	extractEntityHeaders: function(headers, representation) {
	    var result = (representation == null) ? new EmptyRepresentation()
	            : representation;
	    var entityHeaderFound = false;
	
	    if (headers != null) {
	        for (var cpt = 0; cpt<headers.length; cpt++) {
	        	var header = headers[cpt];
	            if (header.getName().equalsIgnoreCase(
	                    HeaderConstants.HEADER_CONTENT_TYPE)) {
	                var contentType = new ContentType(header.getValue());
	                result.setMediaType(contentType.getMediaType());
	
	                if ((result.getCharacterSet() == null)
	                        || (contentType.getCharacterSet() != null)) {
	                    result.setCharacterSet(contentType.getCharacterSet());
	                }
	
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    HeaderConstants.HEADER_CONTENT_LENGTH)) {
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    HeaderConstants.HEADER_EXPIRES)) {
	                result.setExpirationDate(HeaderReader.readDate(
	                        header.getValue(), false));
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    HeaderConstants.HEADER_CONTENT_ENCODING)) {
	                new EncodingReader(header.getValue()).addValues(result
	                        .getEncodings());
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    HeaderConstants.HEADER_CONTENT_LANGUAGE)) {
	                new LanguageReader(header.getValue()).addValues(result
	                        .getLanguages());
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    HeaderConstants.HEADER_LAST_MODIFIED)) {
	                result.setModificationDate(HeaderReader.readDate(
	                        header.getValue(), false));
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    HeaderConstants.HEADER_ETAG)) {
	                result.setTag(Tag.parse(header.getValue()));
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    HeaderConstants.HEADER_CONTENT_LOCATION)) {
	                result.setLocationRef(header.getValue());
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    HeaderConstants.HEADER_CONTENT_DISPOSITION)) {
	                /*try {
	                    result.setDisposition(new DispositionReader(header
	                            .getValue()).readValue());
	                    entityHeaderFound = true;
	                } catch (IOException ioe) {
	                    Context.getCurrentLogger().log(
	                            Level.WARNING,
	                            "Error during Content-Disposition header parsing. Header: "
	                                    + header.getValue(), ioe);
	                }*/
	            } else if (header.getName().equalsIgnoreCase(
	                    HeaderConstants.HEADER_CONTENT_RANGE)) {
	                /*org.restlet.engine.header.RangeReader.update(
	                        header.getValue(), result);*/
	                entityHeaderFound = true;
	            } else if (header.getName().equalsIgnoreCase(
	                    HeaderConstants.HEADER_CONTENT_MD5)) {
	                /*result.setDigest(new org.restlet.data.Digest(
	                        org.restlet.data.Digest.ALGORITHM_MD5,
	                        org.restlet.engine.util.Base64.decode(header
	                                .getValue())));*/
	                entityHeaderFound = true;
	            }
	        }
	    }
	
	    // If no representation was initially expected and no entity header
	    // is found, then do not return any representation
	    if ((representation == null) && !entityHeaderFound) {
	        result = null;
	    }
	
	    return result;
	},
	copyResponseTransportHeaders: function(headers, response) {
		if (headers != null) {
            for (var cpt=0; cpt<headers.length; cpt++) {
            	var header = headers[cpt]; 
                if (header.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_LOCATION)) {
                    response.setLocationRef(header.getValue());
                } else if (header.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_AGE)) {
                    try {
                        response.setAge(parseInt(header.getValue()));
                    } catch (err) {
                        /*Context.getCurrentLogger().log(
                                Level.WARNING,
                                "Error during Age header parsing. Header: "
                                        + header.getValue(), nfe);*/
                    }
                } else if (header.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_DATE)) {
                    var date = DateUtils.parse(header.getValue());

                    if (date == null) {
                        date = new Date();
                    }

                    response.setDate(date);
                /*} else if (header.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_RETRY_AFTER)) {
                    Date retryAfter = DateUtils.parse(header.getValue());

                    if (retryAfter == null) {
                        // The date might be expressed as a number of seconds
                        try {
                            int retryAfterSecs = Integer.parseInt(header
                                    .getValue());
                            java.util.Calendar calendar = java.util.Calendar
                                    .getInstance();
                            calendar.add(java.util.Calendar.SECOND,
                                    retryAfterSecs);
                            retryAfter = calendar.getTime();
                        } catch (NumberFormatException nfe) {
                            Context.getCurrentLogger().log(
                                    Level.WARNING,
                                    "Error during Retry-After header parsing. Header: "
                                            + header.getValue(), nfe);
                        }
                    }

                    response.setRetryAfter(retryAfter);
                } else if ((header.getName()
                        .equalsIgnoreCase(HeaderConstants.HEADER_SET_COOKIE))
                        || (header.getName()
                                .equalsIgnoreCase(HeaderConstants.HEADER_SET_COOKIE2))) {
                    try {
                        CookieSettingReader cr = new CookieSettingReader(
                                header.getValue());
                        response.getCookieSettings().add(cr.readValue());
                    } catch (Exception e) {
                        Context.getCurrentLogger().log(
                                Level.WARNING,
                                "Error during cookie setting parsing. Header: "
                                        + header.getValue(), e);
                    }
                } else if (header.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_WWW_AUTHENTICATE)) {
                    List<ChallengeRequest> crs = org.restlet.engine.security.AuthenticatorUtils
                            .parseRequest(response, header.getValue(), headers);
                    response.getChallengeRequests().addAll(crs);
                } else if (header.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_PROXY_AUTHENTICATE)) {
                    List<ChallengeRequest> crs = org.restlet.engine.security.AuthenticatorUtils
                            .parseRequest(response, header.getValue(), headers);
                    response.getProxyChallengeRequests().addAll(crs);
                } else if (header.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_AUTHENTICATION_INFO)) {
                    AuthenticationInfo authenticationInfo = org.restlet.engine.security.AuthenticatorUtils
                            .parseAuthenticationInfo(header.getValue());
                    response.setAuthenticationInfo(authenticationInfo);
                } else if (header.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_SERVER)) {
                    response.getServerInfo().setAgent(header.getValue());
                /*} else if (header.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_ALLOW)) {
                    MethodReader
                            .addValues(header, response.getAllowedMethods());*/
                } else if (header.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_VARY)) {
                    DimensionReader.addValues(header, response.getDimensions());
                /*} else if (header.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_VIA)) {
                    RecipientInfoReader.addValues(header,
                            response.getRecipientsInfo());
                } else if (header.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_WARNING)) {
                    WarningReader.addValues(header, response.getWarnings());
                } else if (header.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_CACHE_CONTROL)) {
                    CacheDirectiveReader.addValues(header,
                            response.getCacheDirectives());
                } else if (header.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_ACCEPT_RANGES)) {
                    TokenReader tr = new TokenReader(header.getValue());
                    response.getServerInfo().setAcceptingRanges(
                            tr.readValues().contains("bytes"));*/
                }
            }
        }
	},
	getContentLength: function(headers) {
        var contentLength = Representation.UNKNOWN_SIZE;

        if (headers != null) {
            // Extract the content length header
            for (var cpt=0; cpt<headers.length; cpt++) {
            	var header = headers[cpt]
                if (header.getName().equalsIgnoreCase(
                        HeaderConstants.HEADER_CONTENT_LENGTH)) {
                    try {
                        contentLength = parseFloat(header.getValue());
                    } catch (err) {
                        contentLength = Representation.UNKNOWN_SIZE;
                    }
                }
            }
        }

        return contentLength;
	},
	getCharacterCode: function(character) {
    	return character.charCodeAt(0);
	},
    isAlpha: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return HeaderUtils.isUpperCase(character)
        			|| HeaderUtils.isLowerCase(character);
    },
    isAsciiChar: function(character) {
    	if (character==-1) {
    		return false;
    	}
    	var code = HeaderUtils.getCharacterCode(character);
        return (code >= 0) && (code <= 127);
    },
    isCarriageReturn: function(character) {
    	if (character==-1) {
    		return false;
    	}
    	var code = HeaderUtils.getCharacterCode(character);
        return (code == 13);
    },
    isChunkedEncoding: function(headers) {
        var result = false;

        if (headers != null) {
            var header = headers.getFirstValue(
                    HeaderConstants.HEADER_TRANSFER_ENCODING, true);
            result = "chunked".equalsIgnoreCase(header);
        }

        return result;
    },
    isComma: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return (character == ',');
    },
    isCommentText: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return HeaderUtils.isText(character) && (character != '(') && (character != ')');
    },
    isConnectionClose: function(headers) {
        var result = false;

        if (headers != null) {
            var header = headers.getFirstValue(
                    HeaderConstants.HEADER_CONNECTION, true);
            result = "close".equalsIgnoreCase(header);
        }

        return result;
    },
    isControlChar: function(character) {
    	if (character==-1) {
    		return false;
    	}
    	var code = HeaderUtils.getCharacterCode(character);
        return ((code >= 0) && (code <= 31)) || (code == 127);
    },
    isDigit: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return (character >= '0') && (character <= '9');
    },
    isDoubleQuote: function(character) {
    	if (character==-1) {
    		return false;
    	}
    	var code = HeaderUtils.getCharacterCode(character);
        return (code == 34);
    },
    isHorizontalTab: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return (character == 9);
    },
    isLatin1Char: function(character) {
    	if (character==-1) {
    		return false;
    	}
    	var code = HeaderUtils.getCharacterCode(character);
        return (code >= 0) && (code <= 255);
    },
    isLinearWhiteSpace: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return (HeaderUtils.isCarriageReturn(character)
        		|| HeaderUtils.isSpace(character)
                || HeaderUtils.isLineFeed(character)
                || HeaderUtils.isHorizontalTab(character));
    },
    isLineFeed: function(character) {
    	if (character==-1) {
    		return false;
    	}
    	var code = HeaderUtils.getCharacterCode(character);
        return (code == 10);
    },
    isLowerCase: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return (character >= 'a') && (character <= 'z');
    },
    isQuoteCharacter: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return (character == '\\');
    },
    isQuotedText: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return HeaderUtils.isText(character) && !HeaderUtils.isDoubleQuote(character);
    },
    isSemiColon: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return (character == ';');
    },
    isSeparator: function(character) {
    	if (character==-1) {
    		return false;
    	}
        switch (character) {
        case '(':
        case ')':
        case '<':
        case '>':
        case '@':
        case ',':
        case ';':
        case ':':
        case '\\':
        case '"':
        case '/':
        case '[':
        case ']':
        case '?':
        case '=':
        case '{':
        case '}':
        case ' ':
        case '\t':
            return true;

        default:
            return false;
        }
    },
    isSpace: function(character) {
    	if (character==-1) {
    		return false;
    	}
    	var code = HeaderUtils.getCharacterCode(character);
        return (code == 32);
    },
    isText: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return HeaderUtils.isLatin1Char(character)
        		&& !HeaderUtils.isControlChar(character);
    },
    isToken: function(token) {
    	if (character==-1) {
    		return false;
    	}
        for (var i = 0; i < token.length; i++) {
            if (!HeaderUtils.isTokenChar(token.charAt(i))) {
                return false;
            }
        }

        return true;
    },
    isTokenChar: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return HeaderUtils.isAsciiChar(character)
        		&& !HeaderUtils.isSeparator(character);
    },
    isUpperCase: function(character) {
    	if (character==-1) {
    		return false;
    	}
        return (character >= 'A') && (character <= 'Z');
    }
});

var HeaderReader = new Class({
	initialize: function(header) {
        this.header = header;
        this.index = ((header == null) || (header.length == 0)) ? -1 : 0;
        this.mark = this.index;
	},
    readDate: function(date, cookie) {
        if (cookie) {
            return DateUtils.parse(date, DateUtils.FORMAT_RFC_1036);
        }

        return DateUtils.parse(date, DateUtils.FORMAT_RFC_1123);
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

                if (!HeaderUtils.isLineFeed(next)) {
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

                while (HeaderUtils.isSpace(next)) {
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
            //Context.getCurrentLogger().log(Level.INFO,
            //        "Unable to read a header", ioe);
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
            var buffer = new StringBuilder();

            while (result == null) {
                next = this.read();

                if (HeaderUtils.isCommentText(next)) {
                    buffer.append(next);
                } else if (HeaderUtils.isQuoteCharacter(next)) {
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
        var sb = new StringBuilder();
        var next = this.read();

        while (HeaderUtils.isTokenChar(next)) {
            sb.append(next);
            next = this.read();
        }

        // Unread the last character (separator or end marker)
        this.unread();

        return sb.toString();
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

        if (HeaderUtils.isDoubleQuote(nextChar)) {
            result = this.readQuotedString();
        } else if (HeaderUtils.isTokenChar(nextChar)) {
            result = this.readToken();
        }

        return result;
    },
    readQuotedString: function() {
        var result = null;
        var next = this.read();

        // First character must be a double quote
        if (HeaderUtils.isDoubleQuote(next)) {
            var buffer = new StringBuilder();

            while (result == null) {
                next = this.read();

                if (HeaderUtils.isQuotedText(next)) {
                    buffer.append(next);
                } else if (HeaderUtils.isQuoteCharacter(next)) {
                    // Start of a quoted pair (escape sequence)
                    buffer.append(this.read());
                } else if (HeaderUtils.isDoubleQuote(next)) {
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

        while ((next != -1) && !HeaderUtils.isSpace(next) && !HeaderUtils.isComma(next)) {
            if (sb == null) {
                sb = new StringBuilder();
            }

            sb.append(next);
            next = this.read();
        }

        // Unread the separator
        if (HeaderUtils.isSpace(next) || HeaderUtils.isComma(next)) {
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

        while ((next != -1) && !HeaderUtils.isComma(next)) {
            if (sb == null) {
                sb = new StringBuilder();
            }

            sb.append(next);
            next = this.read();
        }

        // Remove trailing spaces
        if (sb != null) {
            for (var i = sb.length() - 1; (i >= 0)
                    && HeaderUtils.isLinearWhiteSpace(sb.charAt(i)); i--) {
                sb.deleteCharAt(i);
            }
        }

        // Unread the separator
        if (HeaderUtils.isComma(next)) {
        	this.unread();
        }

        return (sb == null) ? null : sb.toString();
    },
    readToken: function() {
        var sb = new StringBuilder();
        var next = this.read();

        while (HeaderUtils.isTokenChar(next)) {
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
        if (HeaderUtils.isSemiColon(this.read())) {
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

        while (HeaderUtils.isLinearWhiteSpace(next) && (next != -1)) {
            result = result || HeaderUtils.isLinearWhiteSpace(next);
            this.read();
            next = this.peek();
        }

        return result;
    },
    skipValueSeparator: function() {
        var result = false;
        this.skipSpaces();
        if (HeaderUtils.isComma(this.read())) {
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

var CacheDirectiveWriter = new Class(HeaderWriter, {
	initialize: function() {
		this.callSuper();
	},

	appendObject: function(directive) {
        this.appendExtension(directive);
        return this;
    }
});

CacheDirectiveWriter.extend({
	write: function(directives) {
		return new CacheDirectiveWriter().appendCollection(directives).toString();
	}
});

var CookieWriter = new Class(HeaderWriter, {
	initialize: function() {
		this.callSuper();
	},

	appendObject: function(cookie) {
        var name = cookie.getName();
        var value = cookie.getValue();
        var version = cookie.getVersion();

        if ((name == null) || (name.length == 0)) {
            throw new Error(
                    "Can't write cookie. Invalid name detected");
        }

        this.appendValue(name, 0).append('=');

        // Append the value
        if ((value != null) && (value.length > 0)) {
        	this.appendValue(value, version);
        }

        if (version > 0) {
            // Append the path
            var path = cookie.getPath();

            if ((path != null) && (path.length > 0)) {
            	this.append("; $Path=");
            	this.appendQuotedString(path);
            }

            // Append the domain
            var domain = cookie.getDomain();

            if ((domain != null) && (domain.length > 0)) {
            	this.append("; $Domain=");
            	this.appendQuotedString(domain);
            }
        }

        return this;
    },

    appendCollection: function(cookies) {
        if ((cookies != null) && !cookies.isEmpty()) {
            var cookie;

            var elements = cookies.getElements();
            for (var i = 0; i < elements.length; i++) {
                cookie = elements[i];

                if (i == 0) {
                    if (cookie.getVersion() > 0) {
                    	this.append("$Version=\"").append(cookie.getVersion())
                                .append("\"; ");
                    }
                } else {
                	this.append("; ");
                }

                this.appendObject(cookie);
            }
        }

        return this;
    },

    appendValue: function(value, version) {
        if (version == 0) {
        	this.append(value.toString());
        } else {
        	this.appendQuotedString(value);
        }

        return this;
    }
});

CookieWriter.extend({
	getCookies: function(source, destination) {
	    var cookie;

	    for (var i=0; i<source.length; i++) {
	        cookie = source[i];

	        if (destination.containsKey(cookie.getName())) {
	            destination.put(cookie.getName(), cookie);
	        }
	    }
	},

	writeObject: function(cookie) {
	    return new CookieWriter().appendObject(cookie).toString();
	},

	writeCollection: function(cookies) {
	    return new CookieWriter().appendCollection(cookies).toString();
	}
});

var CookieSettingWriter = new Class(HeaderWriter, {
	initialize: function() {
		this.callSuper();
	},

    appendObject: function(cookieSetting) {
        var name = cookieSetting.getName();
        var value = cookieSetting.getValue();
        var version = cookieSetting.getVersion();

        if ((name == null) || (name.length == 0)) {
            throw new Error(
                    "Can't write cookie. Invalid name detected");
        }

        this.append(name).append('=');

        // Append the value
        if ((value != null) && (value.length > 0)) {
        	this.appendValue(value, version);
        }

        // Append the version
        if (version > 0) {
        	this.append("; Version=");
        	this.appendValue(version.toString(), version);
        }

        // Append the path
        var path = cookieSetting.getPath();

        if ((path != null) && (path.length > 0)) {
        	this.append("; Path=");

            if (version == 0) {
            	this.append(path);
            } else {
            	this.appendQuotedString(path);
            }
        }

        // Append the expiration date
        var maxAge = cookieSetting.getMaxAge();

        if (maxAge >= 0) {
            if (version == 0) {
                var currentTime = (new Date()).getTime();
                var maxTime = (maxAge * 1000);
                var expiresTime = currentTime + maxTime;
                var expires = new Date(expiresTime);

                this.append("; Expires=");
                this.appendValue(DateUtils.format(expires, DateUtils.FORMAT_RFC_1036
                        .get(0)), version);
            } else {
            	this.append("; Max-Age=");
            	this.appendValue(cookieSetting.getMaxAge().toString(),
                        version);
            }
        } else if ((maxAge == -1) && (version > 0)) {
            // Discard the cookie at the end of the user's session (RFC
            // 2965)
        	this.append("; Discard");
        } else {
            // NetScape cookies automatically expire at the end of the
            // user's session
        }

        // Append the domain
        var domain = cookieSetting.getDomain();

        if ((domain != null) && (domain.length > 0)) {
        	this.append("; Domain=");
        	this.appendValue(domain.toLowerCase(), version);
        }

        // Append the secure flag
        if (cookieSetting.isSecure()) {
        	this.append("; Secure");
        }

        // Append the secure flag
        if (cookieSetting.isAccessRestricted()) {
        	this.append("; HttpOnly");
        }

        // Append the comment
        if (version > 0) {
            var comment = cookieSetting.getComment();

            if ((comment != null) && (comment.length > 0)) {
            	this.append("; Comment=");
            	this.appendValue(comment, version);
            }
        }

        return this;
    },

    appendValue: function(value, version) {
        if (version == 0) {
        	this.append(value.toString());
        } else {
        	this.appendQuotedString(value);
        }

        return this;
    }
});

CookieSettingWriter.extend({
	write: function() {
		if (arguments[0] instanceof Array) {
			var cookieSettings = arguments[0];
			return new CookieSettingWriter().appendCollection(cookieSettings).toString();
		} else {
			var cookieSetting = arguments[0];
			return new CookieSettingWriter().appendObject(cookieSetting).toString();
		}
	}
});

var DateWriter = new Class({});

DateWriter.extend({
    /*write: function(date) {
        return DateWriter.write(date, false);
    },*/
    write: function(date, cookie) {
        if (cookie) {
            return DateUtils.format(date, DateUtils.FORMAT_RFC_1036[0]);
        }
        return DateUtils.format(date);
    }
});

var DimensionReader = new Class(HeaderReader, {
    initialize: function(header) {
        this.callSuper(header);
    },

    readValue: function() {
        var result = null;
        var value = this.readRawValue();

        if (value != null) {
            if (value.equalsIgnoreCase(HeaderConstants.HEADER_ACCEPT)) {
                result = Dimension.MEDIA_TYPE;
            } else if (value
                    .equalsIgnoreCase(HeaderConstants.HEADER_ACCEPT_CHARSET)) {
                result = Dimension.CHARACTER_SET;
            } else if (value
                    .equalsIgnoreCase(HeaderConstants.HEADER_ACCEPT_ENCODING)) {
                result = Dimension.ENCODING;
            } else if (value
                    .equalsIgnoreCase(HeaderConstants.HEADER_ACCEPT_LANGUAGE)) {
                result = Dimension.LANGUAGE;
            } else if (value
                    .equalsIgnoreCase(HeaderConstants.HEADER_AUTHORIZATION)) {
                result = Dimension.AUTHORIZATION;
            } else if (value
                    .equalsIgnoreCase(HeaderConstants.HEADER_USER_AGENT)) {
                result = Dimension.CLIENT_AGENT;
            } else if (value.equals("*")) {
                result = Dimension.UNSPECIFIED;
            }
        }

        return result;
    }
});

DimensionReader.extend({
	addValues: function(header, collection) {
	    new DimensionReader(header.getValue()).addValues(collection);
	}
});


var DimensionWriter = new Class(HeaderWriter, {
    appendCollection: function(dimensions) {
        if ((dimensions != null) && !dimensions.isEmpty()) {
            if (dimensions.contains(Dimension.CLIENT_ADDRESS)
                    || dimensions.contains(Dimension.TIME)
                    || dimensions.contains(Dimension.UNSPECIFIED)) {
                // From an HTTP point of view the representations can
                // vary in unspecified ways
                this.append("*");
            } else {
                var first = true;

                for (var i=0; i<dimensions.length; i++) {
                	var dimension = dimensions[i];
                    if (first) {
                        first = false;
                    } else {
                    	this.append(", ");
                    }

                    this.appendObject(dimension);
                }
            }
        }

        return this;
    },

    appendObject: function(dimension) {
        if (dimension == Dimension.CHARACTER_SET) {
            this.append(HeaderConstants.HEADER_ACCEPT_CHARSET);
        } else if (dimension == Dimension.CLIENT_AGENT) {
        	this.append(HeaderConstants.HEADER_USER_AGENT);
        } else if (dimension == Dimension.ENCODING) {
        	this.append(HeaderConstants.HEADER_ACCEPT_ENCODING);
        } else if (dimension == Dimension.LANGUAGE) {
        	this.append(HeaderConstants.HEADER_ACCEPT_LANGUAGE);
        } else if (dimension == Dimension.MEDIA_TYPE) {
        	this.append(HeaderConstants.HEADER_ACCEPT);
        } else if (dimension == Dimension.AUTHORIZATION) {
        	this.append(HeaderConstants.HEADER_AUTHORIZATION);
        }

        return this;
    }
});

DimensionWriter.extend({
	write: function(dimensions) {
		return new DimensionWriter().appendCollection(dimensions).toString();
	}
});

var DispositionReader = new Class(HeaderReader, {
    initialize: function(header) {
        this.callSuper(header);
    },

	readValue: function() {
        var result = null;
        var type = this.readToken();

        if (type.length > 0) {
            result = new Disposition();
            result.setType(type);

            if (this.skipParameterSeparator()) {
                var param = this.readParameter();

                while (param != null) {
                    result.getParameters().add(param);

                    if (this.skipParameterSeparator()) {
                        param = this.readParameter();
                    } else {
                        param = null;
                    }
                }
            }
        }

        return result;
    }
});

var DispositionWriter = new Class(HeaderWriter, {
	initialize: function() {
		this.callSuper();
	},

    appendObject: function(disposition) {
        if (Disposition.TYPE_NONE.equals(disposition.getType())
                || disposition.getType() == null) {
            return this;
        }

        this.append(disposition.getType());

        var elements = disposition.getParameters().getElements();
        for (var i=0; i<elements.length; i++) {
        	var parameter = elements[i];
        	this.append("; ");
        	this.append(parameter.getName());
        	this.append("=");

            if (HeaderUtils.isToken(parameter.getValue())) {
            	this.append(parameter.getValue());
            } else {
            	this.appendQuotedString(parameter.getValue());
            }
        }

        return this;
    }
});

DispositionWriter.extend({
	writeObject: function(disposition) {
	    return new DispositionWriter().appendObject(disposition).toString();
	}
});

var MetadataWriter = new Class(HeaderWriter, {
	initialize: function() {
		this.callSuper();
	},

	appendObject: function(metadata) {
        return this.append(metadata.getName());
    }
});

var EncodingReader = new Class(HeaderReader, {
    initialize: function(header) {
        this.callSuper(header);
        /*this.header = header;
        this.index = ((header == null) || (header.length == 0)) ? -1 : 0;
        this.mark = this.index;*/
    },
    canAdd: function(value, values) {
        return value != null && !Encoding.IDENTITY.getName().equals(value.getName());
    },
    readValue: function() {
        return Encoding.valueOf(this.readToken());
    }
});

var EncodingWriter = new Class(MetadataWriter, {
    initialize: function(header) {
        this.callSuper(header);
    },
    canAdd: function(value, values) {
        return value != null && !Encoding.IDENTITY.getName().equals(value.getName());
    },
    readValue: function() {
        return Encoding.valueOf(this.readToken());
    }
});

EncodingWriter.extend({
	write: function(encodings) {
        return new EncodingWriter().appendCollection(encodings).toString();
    }
});

var LanguageReader = new Class(HeaderReader, {
    initialize: function(header) {
        this.callSuper(header);
    },

    readValue: function() {
        return Language.valueOf(this.readRawValue());
    }
});

var LanguageWriter = new Class(MetadataWriter, {
    initialize: function(header) {
        this.callSuper(header);
    }
});

LanguageWriter.extend({
	write: function(languages) {
        return new LanguageWriter().appendCollection(languages).toString();
    }
});

var MethodWriter = new Class(HeaderWriter, {
	initialize: function() {
		this.callSuper();
	},

    appendObject: function(method) {
        this.appendToken(method.getName());
    }
});

MethodWriter.extend({
	write: function(methods) {
		return new MethodWriter().appendCollection(methods).toString();
	}
});


var PreferenceWriter = new Class(HeaderWriter, {
	initialize: function() {
		this.callSuper();
	},

	appendObject: function(pref) {
        this.append(pref.getMetadata().getName());

        if (pref.getQuality() < 1) {
            this.append(";q=");
            this.appendQuality(pref.getQuality());
        }

        if (pref.getParameters() != null) {
            var param;

            var params = pref.getParameters();
            for (var i=0; i<params.length; i++) {
                param = params[i];

                if (param.getName() != null) {
                    this.append(';').append(param.getName());

                    if ((param.getValue() != null)
                            && (param.getValue().length() > 0)) {
                        this.append('=').append(param.getValue());
                    }
                }
            }
        }

        return this;
    },

    appendQuality: function(quality) {
        if (!HeaderUtils.isValidQuality(quality)) {
            throw new Error(
                    "Invalid quality value detected. Value must be between 0 and 1.");
        }

        //TODO: implement number format for JS
        /*java.text.NumberFormat formatter = java.text.NumberFormat
                .getNumberInstance(java.util.Locale.US);
        formatter.setMaximumFractionDigits(2);
        append(formatter.format(quality));*/

        return this;
    }
});

PreferenceWriter.extend({
    isValidQuality: function(quality) {
        return (quality >= 0) && (quality <= 1);
    },

    write: function(prefs) {
        return new PreferenceWriter().appendCollection(prefs).toString();
    }
});

var ProductWriter = new Class({});

ProductWriter.extend({
    write: function(products) {
        var builder = new StringBuilder();

        for (var i=0; i<products.length; i++) {
            var product = products[i];

            if ((product.getName() == null)
                    || (product.getName().length == 0)) {
                throw new Error("Product name cannot be null.");
            }

            builder.append(product.getName());

            if (product.getVersion() != null) {
                builder.append("/").append(product.getVersion());
            }

            if (product.getComment() != null) {
                builder.append(" (").append(product.getComment()).append(")");
            }

            if (i!=products.length-1) {
                builder.append(" ");
            }
        }

        return builder.toString();
    }
});

var RangeWriter = new Class(HeaderWriter, {
	initialize: function() {
		this.callSuper();
	},

    appendCollection: function(ranges) {
        if (ranges == null || ranges.isEmpty()) {
            return this;
        }

        this.append("bytes=");

        for (var i = 0; i < ranges.length; i++) {
            if (i > 0) {
            	this.append(", ");
            }

            this.appendObject(ranges[i]);
        }

        return this;
    },

    appendObject: function(range) {
        if (range.getIndex() >= Range.INDEX_FIRST) {
            this.append(range.getIndex());
            this.append("-");

            if (range.getSize() != Range.SIZE_MAX) {
            	this.append(range.getIndex() + range.getSize() - 1);
            }
        } else if (range.getIndex() == Range.INDEX_LAST) {
        	this.append("-");

            if (range.getSize() != Range.SIZE_MAX) {
            	this.append(range.getSize());
            }
        }

        return this;
    }
});

RangeWriter.extend({
    write: function(param, size) {
    	if (param instanceof Array) {
    		var ranges = param;
            return new RangeWriter().appendCollection(ranges).toString();
    	} else {
    		var range = param;
            var b = new StringBuilder("bytes ");

            if (range.getIndex() >= Range.INDEX_FIRST) {
                b.append(range.getIndex());
                b.append("-");
                if (range.getSize() != Range.SIZE_MAX) {
                    b.append(range.getIndex() + range.getSize() - 1);
                } else {
                    if (size != Representation.UNKNOWN_SIZE) {
                        b.append(size - 1);
                    } else {
                        throw new Error(
                                "The entity has an unknown size, can't determine the last byte position.");
                    }
                }
            } else if (range.getIndex() == Range.INDEX_LAST) {
                if (range.getSize() != Range.SIZE_MAX) {
                    if (size != Representation.UNKNOWN_SIZE) {
                        if (range.getSize() <= size) {
                            b.append(size - range.getSize());
                            b.append("-");
                            b.append(size - 1);
                        } else {
                            throw new Error(
                                    "The size of the range ("
                                            + range.getSize()
                                            + ") is higher than the size of the entity ("
                                            + size + ").");
                        }
                    } else {
                        throw new Error(
                                "The entity has an unknown size, can't determine the last byte position.");
                    }
                } else {
                    // This is not a valid range.
                    throw new Error(
                            "The range provides no index and no size, it is invalid.");
                }
            }

            if (size != Representation.UNKNOWN_SIZE) {
                b.append("/").append(size);
            } else {
                b.append("/*");
            }

            return b.toString();
    	}
    }
});

var RecipientInfoWriter = new Class(HeaderWriter, {
	initialize: function() {
		this.callSuper();
	},

    appendObject: function(recipientInfo) {
        if (recipientInfo.getProtocol() != null) {
            this.appendToken(recipientInfo.getProtocol().getName());
            this.append('/');
            this.appendToken(recipientInfo.getProtocol().getVersion());
            this.appendSpace();

            if (recipientInfo.getName() != null) {
            	this.append(recipientInfo.getName());

                if (recipientInfo.getComment() != null) {
                	this.appendSpace();
                	this.appendComment(recipientInfo.getComment());
                }
            } else {
                throw new Error(
                        "The name (host or pseudonym) of a recipient can't be null");
            }
        } else {
            throw new Error(
                    "The protocol of a recipient can't be null");
        }

        return this;
    }
});

RecipientInfoWriter.extend({
    write: function(recipientsInfo) {
        return new RecipientInfoWriter().appendCollection(recipientsInfo).toString();
    }
});

var TagWriter = new Class(HeaderWriter, {
    initialize: function(header) {
        this.callSuper(header);
    },

    appendObject: function(tag) {
        return this.append(tag.format());
    }
});

TagWriter.extend({
	write: function(param) {
		if (param instanceof Array) {
			return new TagWriter().appendCollection(param).toString();
		} else {
			return new TagWriter().appendObject(param).toString();
		}
	}
});

var WarningWriter = new Class(HeaderWriter, {
    initialize: function() {
        this.callSuper();
    },

    appendObject: function(warning) {
        var agent = warning.getAgent();
        var text = warning.getText();

        if (warning.getStatus() == null) {
            throw new Error(
                    "Can't write warning. Invalid status code detected");
        }

        if ((agent == null) || (agent.length == 0)) {
            throw new Error(
                    "Can't write warning. Invalid agent detected");
        }

        if ((text == null) || (text.length == 0)) {
            throw new Error(
                    "Can't write warning. Invalid text detected");
        }

        this.append(warning.getStatus().getCode().toString());
        this.append(" ");
        this.append(agent);
        this.append(" ");
        this.appendQuotedString(text);

        if (warning.getDate() != null) {
        	this.appendQuotedString(DateUtils.format(warning.getDate()));
        }

        return this;
    }
});

WarningWriter.extend({
	write: function(warnings) {
		return new WarningWriter().appendCollection(warnings).toString();
	}
});


var DateUtils = new Class({});

DateUtils.extend({
    FORMAT_ASC_TIME: ["EEE MMM dd HH:mm:ss yyyy"],
    FORMAT_RFC_1036: ["EEEE, dd-MMM-yy HH:mm:ss zzz"],
    FORMAT_RFC_1123: ["EEE, dd MMM yyyy HH:mm:ss zzz"],
    FORMAT_RFC_3339: ["yyyy-MM-dd'T'HH:mm:ssz"],
    FORMAT_RFC_822: [
            "EEE, dd MMM yy HH:mm:ss z", "EEE, dd MMM yy HH:mm z",
            "dd MMM yy HH:mm:ss z", "dd MMM yy HH:mm z"],
    after: function(baseDate, afterDate) {
        if ((baseDate == null) || (afterDate == null)) {
            throw new Error(
                    "Can't compare the dates, at least one of them is null");
        }

        var baseTime = baseDate.getTime() / 1000;
        var afterTime = afterDate.getTime() / 1000;
        return baseTime < afterTime;
    },
    before: function(baseDate, beforeDate) {
        if ((baseDate == null) || (beforeDate == null)) {
            throw new Error(
                    "Can't compare the dates, at least one of them is null");
        }

        var baseTime = baseDate.getTime() / 1000;
        var beforeTime = beforeDate.getTime() / 1000;
        return beforeTime < baseTime;
    },
    equals: function(baseDate, otherDate) {
        if ((baseDate == null) || (otherDate == null)) {
            throw new Error(
                    "Can't compare the dates, at least one of them is null");
        }

        var baseTime = baseDate.getTime() / 1000;
        var otherTime = otherDate.getTime() / 1000;
        return otherTime == baseTime;
    },
    /*format: function(date) {
        return DateUtils.format(date, DateUtils.FORMAT_RFC_1123[0]);
    },*/
    format: function(date, format) {
        if (date == null) {
            throw new Error("Date is null");
        }
        if (format==null) {
        	format = DateUtils.FORMAT_RFC_1123[0];
        }

        var formatter = new DateFormat(format);
        return formatter.format(date, format);
    },
    /*parse: function(date) {
        return DateUtils.parse(date, DateUtils.FORMAT_RFC_1123);
    },*/
    parse: function(date, formats) {
        var result = null;

        if (date == null) {
            throw new Error("Date is null");
        }
        if (formats==null) {
        	formats = DateUtils.FORMAT_RFC_1123;
        }

        var format = null;
        var formatsSize = formats.length;

        for (var i = 0; (result == null) && (i < formatsSize); i++) {
            format = formats[i];
            var parser = new DateFormat(format);
            try {
            	result = parser.parse(date);
            } catch(err) { }
        }

        return result;
    }
});

var Status = new Class({
    initialize: function(code, reasonPhrase, description, uri) {
    	this.code = code;
    	if (typeof reasonPhrase=="undefined" || reasonPhrase==null) {
    		this.reasonPhrase = this.getReasonPhrase();
    	} else {
        	this.reasonPhrase = reasonPhrase;
    	}
    	if (typeof description=="undefined" || description==null) {
    		this.description = this.getDescription();
    	} else {
    		this.description = description;
    	}
    	if (typeof uri=="undefined" || uri==null) {
    		this.uri = this.getUri();
    	} else {
    		this.uri = uri;
    	}
    },
    getCode: function() {
        return this.code;
    },
    equals: function(status) {
    	return (status!=null && status.getCode()==this.getCode());
    },
    getDescription: function() {
        var result = this.description;

        if (result == null) {
            switch (this.code) {
            case 100:
                result = "The client should continue with its request";
                break;
            case 101:
                result = "The server is willing to change the application protocol being used on this connection";
                break;
            case 102:
                result = "Interim response used to inform the client that the server has accepted the complete request, but has not yet completed it";
                break;
            case 110:
                result = "MUST be included whenever the returned response is stale";
                break;
            case 111:
                result = "MUST be included if a cache returns a stale response because an attempt to revalidate the response failed, due to an inability to reach the server";
                break;
            case 112:
                result = "SHOULD be included if the cache is intentionally disconnected from the rest of the network for a period of time";
                break;
            case 113:
                result = "MUST be included if the cache heuristically chose a freshness lifetime greater than 24 hours and the response's age is greater than 24 hours";
                break;
            case 199:
                result = "The warning text MAY include arbitrary information to be presented to a human user, or logged. A system receiving this warning MUST NOT take any automated action, besides presenting the warning to the user";
                break;

            case 200:
                result = "The request has succeeded";
                break;
            case 201:
                result = "The request has been fulfilled and resulted in a new resource being created";
                break;
            case 202:
                result = "The request has been accepted for processing, but the processing has not been completed";
                break;
            case 203:
                result = "The returned meta-information is not the definitive set as available from the origin server";
                break;
            case 204:
                result = "The server has fulfilled the request but does not need to return an entity-body, and might want to return updated meta-information";
                break;
            case 205:
                result = "The server has fulfilled the request and the user agent should reset the document view which caused the request to be sent";
                break;
            case 206:
                result = "The server has fulfilled the partial get request for the resource";
                break;
            case 207:
                result = "Provides status for multiple independent operations";
                break;
            case 214:
                result = "MUST be added by an intermediate cache or proxy if it applies any transformation changing the content-coding (as specified in the Content-Encoding header) or media-type (as specified in the Content-Type header) of the response, or the entity-body of the response, unless this Warning code already appears in the response";
                break;
            case 299:
                result = "The warning text MAY include arbitrary information to be presented to a human user, or logged. A system receiving this warning MUST NOT take any automated action";
                break;

            case 300:
                result = "The requested resource corresponds to any one of a set of representations";
                break;
            case 301:
                result = "The requested resource has been assigned a new permanent URI";
                break;
            case 302:
                result = "The requested resource can be found under a different URI";
                break;
            case 303:
                result = "The response to the request can be found under a different URI";
                break;
            case 304:
                result = "The client has performed a conditional GET request and the document has not been modified";
                break;
            case 305:
                result = "The requested resource must be accessed through the proxy given by the location field";
                break;
            case 307:
                result = "The requested resource resides temporarily under a different URI";
                break;

            case 400:
                result = "The request could not be understood by the server due to malformed syntax";
                break;
            case 401:
                result = "The request requires user authentication";
                break;
            case 402:
                result = "This code is reserved for future use";
                break;
            case 403:
                result = "The server understood the request, but is refusing to fulfill it";
                break;
            case 404:
                result = "The server has not found anything matching the request URI";
                break;
            case 405:
                result = "The method specified in the request is not allowed for the resource identified by the request URI";
                break;
            case 406:
                result = "The resource identified by the request is only capable of generating response entities which have content characteristics not acceptable according to the accept headers sent in the request";
                break;
            case 407:
                result = "This code is similar to Unauthorized, but indicates that the client must first authenticate itself with the proxy";
                break;
            case 408:
                result = "The client did not produce a request within the time that the server was prepared to wait";
                break;
            case 409:
                result = "The request could not be completed due to a conflict with the current state of the resource";
                break;
            case 410:
                result = "The requested resource is no longer available at the server and no forwarding address is known";
                break;
            case 411:
                result = "The server refuses to accept the request without a defined content length";
                break;
            case 412:
                result = "The precondition given in one or more of the request header fields evaluated to false when it was tested on the server";
                break;
            case 413:
                result = "The server is refusing to process a request because the request entity is larger than the server is willing or able to process";
                break;
            case 414:
                result = "The server is refusing to service the request because the request URI is longer than the server is willing to interpret";
                break;
            case 415:
                result = "The server is refusing to service the request because the entity of the request is in a format not supported by the requested resource for the requested method";
                break;
            case 416:
                result = "For byte ranges, this means that the first byte position were greater than the current length of the selected resource";
                break;
            case 417:
                result = "The expectation given in the request header could not be met by this server";
                break;
            case 422:
                result = "The server understands the content type of the request entity and the syntax of the request entity is correct but was unable to process the contained instructions";
                break;
            case 423:
                result = "The source or destination resource of a method is locked";
                break;
            case 424:
                result = "The method could not be performed on the resource because the requested action depended on another action and that action failed";
                break;

            case 500:
                result = "The server encountered an unexpected condition which prevented it from fulfilling the request";
                break;
            case 501:
                result = "The server does not support the functionality required to fulfill the request";
                break;
            case 502:
                result = "The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request";
                break;
            case 503:
                result = "The server is currently unable to handle the request due to a temporary overloading or maintenance of the server";
                break;
            case 504:
                result = "The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server specified by the URI (e.g. HTTP, FTP, LDAP) or some other auxiliary server (e.g. DNS) it needed to access in attempting to complete the request";
                break;
            case 505:
                result = "The server does not support, or refuses to support, the protocol version that was used in the request message";
                break;
            case 507:
                result = "The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request";
                break;

            case 1000:
                result = "The connector failed to connect to the server";
                break;
            case 1001:
                result = "The connector failed to complete the communication with the server";
                break;
            case 1002:
                result = "The connector encountered an unexpected condition which prevented it from fulfilling the request";
                break;
            }
        }

        return result;
    },
    getName: function() {
        return this.getReasonPhrase();
    },
    getReasonPhrase: function() {
        var result = this.reasonPhrase;

        if (result == null) {
            switch (this.code) {
            case 100:
                result = "Continue";
                break;
            case 101:
                result = "Switching Protocols";
                break;
            case 102:
                result = "Processing";
                break;
            case 110:
                result = "Response is stale";
                break;
            case 111:
                result = "Revalidation failed";
                break;
            case 112:
                result = "Disconnected operation";
                break;
            case 113:
                result = "Heuristic expiration";
                break;
            case 199:
                result = "Miscellaneous warning";
                break;

            case 200:
                result = "OK";
                break;
            case 201:
                result = "Created";
                break;
            case 202:
                result = "Accepted";
                break;
            case 203:
                result = "Non-Authoritative Information";
                break;
            case 204:
                result = "No Content";
                break;
            case 205:
                result = "Reset Content";
                break;
            case 206:
                result = "Partial Content";
                break;
            case 207:
                result = "Multi-Status";
                break;
            case 214:
                result = "Transformation applied";
                break;
            case 299:
                result = "Miscellaneous persistent warning";
                break;

            case 300:
                result = "Multiple Choices";
                break;
            case 301:
                result = "Moved Permanently";
                break;
            case 302:
                result = "Found";
                break;
            case 303:
                result = "See Other";
                break;
            case 304:
                result = "Not Modified";
                break;
            case 305:
                result = "Use Proxy";
                break;
            case 307:
                result = "Temporary Redirect";
                break;

            case 400:
                result = "Bad Request";
                break;
            case 401:
                result = "Unauthorized";
                break;
            case 402:
                result = "Payment Required";
                break;
            case 403:
                result = "Forbidden";
                break;
            case 404:
                result = "Not Found";
                break;
            case 405:
                result = "Method Not Allowed";
                break;
            case 406:
                result = "Not Acceptable";
                break;
            case 407:
                result = "Proxy Authentication Required";
                break;
            case 408:
                result = "Request Timeout";
                break;
            case 409:
                result = "Conflict";
                break;
            case 410:
                result = "Gone";
                break;
            case 411:
                result = "Length Required";
                break;
            case 412:
                result = "Precondition Failed";
                break;
            case 413:
                result = "Request Entity Too Large";
                break;
            case 414:
                result = "Request URI Too Long";
                break;
            case 415:
                result = "Unsupported Media Type";
                break;
            case 416:
                result = "Requested Range Not Satisfiable";
                break;
            case 417:
                result = "Expectation Failed";
                break;
            case 422:
                result = "Unprocessable Entity";
                break;
            case 423:
                result = "Locked";
                break;
            case 424:
                result = "Failed Dependency";
                break;

            case 500:
                result = "Internal Server Error";
                break;
            case 501:
                result = "Not Implemented";
                break;
            case 502:
                result = "Bad Gateway";
                break;
            case 503:
                result = "Service Unavailable";
                break;
            case 504:
                result = "Gateway Timeout";
                break;
            case 505:
                result = "Version Not Supported";
                break;
            case 507:
                result = "Insufficient Storage";
                break;

            case 1000:
                result = "Connection Error";
                break;
            case 1001:
                result = "Communication Error";
                break;
            case 1002:
                result = "Internal Connector Error";
                break;
            }
        }

        return result;
    },
    getUri: function() {
        var result = this.uri;

        if (result == null) {
           /* switch (this.code) {
            case 100:
                result = Status.BASE_HTTP + "#sec10.1.1";
                break;
            case 101:
                result = Status.BASE_HTTP + "#sec10.1.2";
                break;
            case 102:
                result = Status.BASE_WEBDAV + "#STATUS_102";
                break;
            case 110:
            case 111:
            case 112:
            case 113:
            case 199:
            case 214:
            case 299:
                result = "http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.46";
                break;

            case 200:
                result = Status.BASE_HTTP + "#sec10.2.1";
                break;
            case 201:
                result = Status.BASE_HTTP + "#sec10.2.2";
                break;
            case 202:
                result = Status.BASE_HTTP + "#sec10.2.3";
                break;
            case 203:
                result = Status.BASE_HTTP + "#sec10.2.4";
                break;
            case 204:
                result = Status.BASE_HTTP + "#sec10.2.5";
                break;
            case 205:
                result = Status.BASE_HTTP + "#sec10.2.6";
                break;
            case 206:
                result = Status.BASE_HTTP + "#sec10.2.7";
                break;
            case 207:
                result = Status.BBASE_WEBDAV + "#STATUS_207";
                break;

            case 300:
                result = Status.BASE_HTTP + "#sec10.3.1";
                break;
            case 301:
                result = Status.BASE_HTTP + "#sec10.3.2";
                break;
            case 302:
                result = Status.BASE_HTTP + "#sec10.3.3";
                break;
            case 303:
                result = Status.BASE_HTTP + "#sec10.3.4";
                break;
            case 304:
                result = Status.BASE_HTTP + "#sec10.3.5";
                break;
            case 305:
                result = Status.BASE_HTTP + "#sec10.3.6";
                break;
            case 307:
                result = Status.BASE_HTTP + "#sec10.3.8";
                break;

            case 400:
                result = Status.BASE_HTTP + "#sec10.4.1";
                break;
            case 401:
                result = Status.BASE_HTTP + "#sec10.4.2";
                break;
            case 402:
                result = Status.BASE_HTTP + "#sec10.4.3";
                break;
            case 403:
                result = Status.BASE_HTTP + "#sec10.4.4";
                break;
            case 404:
                result = Status.BASE_HTTP + "#sec10.4.5";
                break;
            case 405:
                result = Status.BASE_HTTP + "#sec10.4.6";
                break;
            case 406:
                result = Status.BASE_HTTP + "#sec10.4.7";
                break;
            case 407:
                result = Status.BASE_HTTP + "#sec10.4.8";
                break;
            case 408:
                result = Status.BASE_HTTP + "#sec10.4.9";
                break;
            case 409:
                result = Status.BASE_HTTP + "#sec10.4.10";
                break;
            case 410:
                result = Status.BASE_HTTP + "#sec10.4.11";
                break;
            case 411:
                result = Status.BASE_HTTP + "#sec10.4.12";
                break;
            case 412:
                result = Status.BASE_HTTP + "#sec10.4.13";
                break;
            case 413:
                result = Status.BASE_HTTP + "#sec10.4.14";
                break;
            case 414:
                result = Status.BASE_HTTP + "#sec10.4.15";
                break;
            case 415:
                result = Status.BASE_HTTP + "#sec10.4.16";
                break;
            case 416:
                result = Status.BASE_HTTP + "#sec10.4.17";
                break;
            case 417:
                result = Status.BASE_HTTP + "#sec10.4.18";
                break;
            case 422:
                result = Status.BBASE_WEBDAV + "#STATUS_422";
                break;
            case 423:
                result = Status.BBASE_WEBDAV + "#STATUS_423";
                break;
            case 424:
                result = Status.BBASE_WEBDAV + "#STATUS_424";
                break;

            case 500:
                result = Status.BASE_HTTP + "#sec10.5.1";
                break;
            case 501:
                result = Status.BASE_HTTP + "#sec10.5.2";
                break;
            case 502:
                result = Status.BASE_HTTP + "#sec10.5.3";
                break;
            case 503:
                result = Status.BASE_HTTP + "#sec10.5.4";
                break;
            case 504:
                result = Status.BASE_HTTP + "#sec10.5.5";
                break;
            case 505:
                result = Status.BASE_HTTP + "#sec10.5.6";
                break;
            case 507:
                result = Status.BASE_WEBDAV + "#STATUS_507";
                break;

            case 1000:
                result = Status.BASE_RESTLET
                        + "org/restlet/data/Status.html#CONNECTOR_ERROR_CONNECTION";
                break;
            case 1001:
                result = Status.BASE_RESTLET
                        + "org/restlet/data/Status.html#CONNECTOR_ERROR_COMMUNICATION";
                break;
            case 1002:
                result = Status.BBASE_RESTLET
                        + "org/restlet/data/Status.html#CONNECTOR_ERROR_INTERNAL";
                break;
            }*/
        }

        return result;
    },
    isClientError: function() {
        return Status.isClientError(this.getCode());
    },
    isConnectorError: function() {
        return Status.isConnectorError(this.getCode());
    },
    isError: function() {
        return Status.isError(this.getCode());
    },
    isGlobalError: function() {
        return Status.isGlobalError(this.getCode());
    },
    isInformational: function() {
        return Status.isInformational(this.getCode());
    },
    isRecoverableError: function() {
        return this.isConnectorError()
                || this.equals(Status.CLIENT_ERROR_REQUEST_TIMEOUT)
                || this.equals(Status.SERVER_ERROR_GATEWAY_TIMEOUT)
                || this.equals(Status.SERVER_ERROR_SERVICE_UNAVAILABLE);
    },
    isRedirection: function() {
        return Status.isRedirection(this.getCode());
    },
    isServerError: function() {
        return Status.isServerError(this.getCode());
    },
    isSuccess: function() {
        return Status.isSuccess(this.getCode());
    },
    toString: function() {
        return this.getReasonPhrase() + " (" + this.code + ")"
                + ((this.getDescription() == null) ? "" : " - " + this.getDescription());
    }
});

Status.extend({
	BASE_HTTP: "http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html",
	BASE_RESTLET: "http://www.restlet.org/documentation/",
           /* + Engine.MAJOR_NUMBER
            + '.'
            + Engine.MINOR_NUMBER
            + "/"
            + Edition.CURRENT.getShortName().toLowerCase() + "/api/";*/
	BASE_WEBDAV: "http://www.webdav.org/specs/rfc2518.html",
	CLIENT_ERROR_BAD_REQUEST: new Status(400),
	CLIENT_ERROR_CONFLICT: new Status(409),
	CLIENT_ERROR_EXPECTATION_FAILED: new Status(417),
	CLIENT_ERROR_FAILED_DEPENDENCY: new Status(424),
	CLIENT_ERROR_FORBIDDEN: new Status(403),
	CLIENT_ERROR_GONE: new Status(410),
	CLIENT_ERROR_LENGTH_REQUIRED: new Status(411),
	CLIENT_ERROR_LOCKED: new Status(423),
	CLIENT_ERROR_METHOD_NOT_ALLOWED: new Status(405),
	CLIENT_ERROR_NOT_ACCEPTABLE: new Status(406),
	CLIENT_ERROR_NOT_FOUND: new Status(404),
	CLIENT_ERROR_PAYMENT_REQUIRED: new Status(402),
	CLIENT_ERROR_PRECONDITION_FAILED: new Status(412),
	CLIENT_ERROR_PROXY_AUTHENTIFICATION_REQUIRED: new Status(407),
	CLIENT_ERROR_REQUEST_ENTITY_TOO_LARGE: new Status(413),
	CLIENT_ERROR_REQUEST_TIMEOUT: new Status(408),
	CLIENT_ERROR_REQUEST_URI_TOO_LONG: new Status(414),
	CLIENT_ERROR_REQUESTED_RANGE_NOT_SATISFIABLE: new Status(416),
	CLIENT_ERROR_UNAUTHORIZED: new Status(401),
	CLIENT_ERROR_UNPROCESSABLE_ENTITY: new Status(422),
	CLIENT_ERROR_UNSUPPORTED_MEDIA_TYPE: new Status(415),
	CONNECTOR_ERROR_COMMUNICATION: new Status(1001),
	CONNECTOR_ERROR_CONNECTION: new Status(1000),
	CONNECTOR_ERROR_INTERNAL: new Status(1002),
	INFO_CONTINUE: new Status(100),
	INFO_DISCONNECTED_OPERATION: new Status(112),
	INFO_HEURISTIC_EXPIRATION: new Status(113),
	INFO_MISC_WARNING: new Status(199),
	INFO_PROCESSING: new Status(102),
	INFO_REVALIDATION_FAILED: new Status(111),
	INFO_STALE_RESPONSE: new Status(110),
	INFO_SWITCHING_PROTOCOL: new Status(101),
	REDIRECTION_FOUND: new Status(302),
	REDIRECTION_MULTIPLE_CHOICES: new Status(300),
	REDIRECTION_NOT_MODIFIED: new Status(304),
	REDIRECTION_PERMANENT: new Status(301),
	REDIRECTION_SEE_OTHER: new Status(303),
	REDIRECTION_TEMPORARY: new Status(307),
	REDIRECTION_USE_PROXY: new Status(305),
	SERVER_ERROR_BAD_GATEWAY: new Status(502),
	SERVER_ERROR_GATEWAY_TIMEOUT: new Status(504),
	SERVER_ERROR_INSUFFICIENT_STORAGE: new Status(507),
	SERVER_ERROR_INTERNAL: new Status(500),
	SERVER_ERROR_NOT_IMPLEMENTED: new Status(501),
	SERVER_ERROR_SERVICE_UNAVAILABLE: new Status(503),
	SERVER_ERROR_VERSION_NOT_SUPPORTED: new Status(505),
	SUCCESS_ACCEPTED: new Status(202),
	SUCCESS_CREATED: new Status(201),
	SUCCESS_MISC_PERSISTENT_WARNING: new Status(299),
	SUCCESS_MULTI_STATUS: new Status(207),
	SUCCESS_NO_CONTENT: new Status(204),
	SUCCESS_NON_AUTHORITATIVE: new Status(203),
	SUCCESS_OK: new Status(200),
	SUCCESS_PARTIAL_CONTENT: new Status(206),
	SUCCESS_RESET_CONTENT: new Status(205),
	SUCCESS_TRANSFORMATION_APPLIED: new Status(214),
	checkReasonPhrase: function(reasonPhrase) {
        if (reasonPhrase != null) {
            if (reasonPhrase.contains("\n") || reasonPhrase.contains("\r")) {
                throw new Error(
                        "Reason phrase of the status must not contain CR or LF characters.");
            }
        }

        return reasonPhrase;
    },
    isClientError: function(code) {
        return (code >= 400) && (code <= 499);
    },
    isConnectorError: function(code) {
        return (code >= 1000) && (code <= 1099);
    },
    isError: function(code) {
        return Status.isClientError(code)
        		|| Status.isServerError(code)
                || Status.isConnectorError(code);
    },
    isGlobalError: function(code) {
        return (code >= 600) && (code <= 699);
    },
    isInformational: function(code) {
        return (code >= 100) && (code <= 199);
    },
    isRedirection: function(code) {
        return (code >= 300) && (code <= 399);
    },
    isServerError: function(code) {
        return (code >= 500) && (code <= 599);
    },
    isSuccess: function(code) {
        return (code >= 200) && (code <= 299);
    },
    valueOf: function(code) {
        var result = null;

        switch (code) {
        case 100:
            result = Status.INFO_CONTINUE;
            break;
        case 101:
            result = Status.INFO_SWITCHING_PROTOCOL;
            break;
        case 102:
            result = Status.INFO_PROCESSING;
            break;
        case 110:
            result = Status.INFO_STALE_RESPONSE;
            break;
        case 111:
            result = Status.INFO_REVALIDATION_FAILED;
            break;
        case 112:
            result = Status.INFO_DISCONNECTED_OPERATION;
            break;
        case 113:
            result = Status.INFO_HEURISTIC_EXPIRATION;
            break;
        case 199:
            result = Status.INFO_MISC_WARNING;
            break;

        case 200:
            result = Status.SUCCESS_OK;
            break;
        case 201:
            result = Status.SUCCESS_CREATED;
            break;
        case 202:
            result = Status.SUCCESS_ACCEPTED;
            break;
        case 203:
            result = Status.SUCCESS_NON_AUTHORITATIVE;
            break;
        case 204:
            result = Status.SUCCESS_NO_CONTENT;
            break;
        case 205:
            result = Status.SUCCESS_RESET_CONTENT;
            break;
        case 206:
            result = Status.SUCCESS_PARTIAL_CONTENT;
            break;
        case 207:
            result = Status.SUCCESS_MULTI_STATUS;
            break;
        case 214:
            result = Status.SUCCESS_TRANSFORMATION_APPLIED;
            break;
        case 299:
            result = Status.SUCCESS_MISC_PERSISTENT_WARNING;
            break;

        case 300:
            result = Status.REDIRECTION_MULTIPLE_CHOICES;
            break;
        case 301:
            result = Status.REDIRECTION_PERMANENT;
            break;
        case 302:
            result = Status.REDIRECTION_FOUND;
            break;
        case 303:
            result = Status.REDIRECTION_SEE_OTHER;
            break;
        case 304:
            result = Status.REDIRECTION_NOT_MODIFIED;
            break;
        case 305:
            result = Status.REDIRECTION_USE_PROXY;
            break;
        case 307:
            result = Status.REDIRECTION_TEMPORARY;
            break;

        case 400:
            result = Status.CLIENT_ERROR_BAD_REQUEST;
            break;
        case 401:
            result = Status.CLIENT_ERROR_UNAUTHORIZED;
            break;
        case 402:
            result = Status.CLIENT_ERROR_PAYMENT_REQUIRED;
            break;
        case 403:
            result = Status.CLIENT_ERROR_FORBIDDEN;
            break;
        case 404:
            result = Status.CLIENT_ERROR_NOT_FOUND;
            break;
        case 405:
            result = Status.CLIENT_ERROR_METHOD_NOT_ALLOWED;
            break;
        case 406:
            result = Status.CLIENT_ERROR_NOT_ACCEPTABLE;
            break;
        case 407:
            result = Status.CLIENT_ERROR_PROXY_AUTHENTIFICATION_REQUIRED;
            break;
        case 408:
            result = Status.CLIENT_ERROR_REQUEST_TIMEOUT;
            break;
        case 409:
            result = Status.CLIENT_ERROR_CONFLICT;
            break;
        case 410:
            result = Status.CLIENT_ERROR_GONE;
            break;
        case 411:
            result = Status.CLIENT_ERROR_LENGTH_REQUIRED;
            break;
        case 412:
            result = Status.CLIENT_ERROR_PRECONDITION_FAILED;
            break;
        case 413:
            result = Status.CLIENT_ERROR_REQUEST_ENTITY_TOO_LARGE;
            break;
        case 414:
            result = Status.CLIENT_ERROR_REQUEST_URI_TOO_LONG;
            break;
        case 415:
            result = Status.CLIENT_ERROR_UNSUPPORTED_MEDIA_TYPE;
            break;
        case 416:
            result = Status.CLIENT_ERROR_REQUESTED_RANGE_NOT_SATISFIABLE;
            break;
        case 417:
            result = Status.CLIENT_ERROR_EXPECTATION_FAILED;
            break;
        case 422:
            result = Status.CLIENT_ERROR_UNPROCESSABLE_ENTITY;
            break;
        case 423:
            result = Status.CLIENT_ERROR_LOCKED;
            break;
        case 424:
            result = Status.CLIENT_ERROR_FAILED_DEPENDENCY;
            break;

        case 500:
            result = Status.SERVER_ERROR_INTERNAL;
            break;
        case 501:
            result = Status.SERVER_ERROR_NOT_IMPLEMENTED;
            break;
        case 502:
            result = Status.SERVER_ERROR_BAD_GATEWAY;
            break;
        case 503:
            result = Status.SERVER_ERROR_SERVICE_UNAVAILABLE;
            break;
        case 504:
            result = Status.SERVER_ERROR_GATEWAY_TIMEOUT;
            break;
        case 505:
            result = Status.SERVER_ERROR_VERSION_NOT_SUPPORTED;
            break;
        case 507:
            result = Status.SERVER_ERROR_INSUFFICIENT_STORAGE;
            break;

        case 1000:
            result = Status.CONNECTOR_ERROR_CONNECTION;
            break;
        case 1001:
            result = Status.CONNECTOR_ERROR_COMMUNICATION;
            break;
        case 1002:
            result = Status.CONNECTOR_ERROR_INTERNAL;
            break;

        default:
            result = new Status(code);
        }

        return result;
    }
});

var Restlet = new Class({
	setContext: function(context) {
		this.context = context;
	},
	setProtocols: function(protocols) {
		this.protocols = protocols;
	},
    isStarted: function() {
        return this.started;
    },
    isStopped: function() {
        return !this.started;
    },
    start: function() {
        this.started = true;
    },
    stop: function() {
        this.started = false;
    },
    handle: function(request, response) {
        if (this.isStopped()) {
            try {
                this.start();
            } catch (err) {
                // Occurred while starting the Restlet
                //getContext().getLogger().log(Level.WARNING, UNABLE_TO_START, e);
                response.setStatus(Status.SERVER_ERROR_INTERNAL);
            }

            if (!this.isStarted()) {
                // No exception raised but the Restlet somehow couldn't be
                // started
                //getContext().getLogger().log(Level.WARNING, UNABLE_TO_START);
                response.setStatus(Status.SERVER_ERROR_INTERNAL);
            }
        }
    }
});

var Connector = new Class(Restlet, {
	initialize: function(context, protocols) {
		this.context = context;
		if (typeof protocols != "undefined" && protocols!=null) {
			this.protocols = protocols;
		} else {
			this.protocols = [];
		}
	},
	getProtocols: function() {
		return this.protocols;
	}
});

var Engine = new Class({
	initialize: function() {
	},

	createHelper: function(restlet) {
		//return new XhrHttpClientHelper();
		return new BrowserHttpClientHelper();
	},

	getDebugHandler: function() {
		return this.debugHandler;
	},

	setDebugHandler: function(debugHandler) {
		this.debugHandler = debugHandler;
	}
});

Engine.extend({
	getInstance: function() {
		if (Engine.instance==null) {
			Engine.instance = new Engine();
		}
		return Engine.instance;
	}
});

var Call = new Class({
	initialize: function() {
		this.hostDomain = null;
        this.hostPort = -1;
        this.clientAddress = null;
        this.clientPort = -1;
        this.confidential = false;
        this.method = null;
        this.protocol = null;
        this.reasonPhrase = "";
	    this.requestHeaders = [];
        this.requestUri = null;
		this.responseHeaders = [];
        this.serverAddress = null;
        this.serverPort = -1;
        this.statusCode = 200;
        this.version = null;

		return this.clientAddress;
	},
	setClientAddress: function(clientAddress) {
		this.clientAddress = clientAddress;
	},
	getClientPort: function() {
		return this.clientPort;
	},
	setClientPort: function(clientPort) {
		this.clientPort = clientPort;
	},
	getConfidential: function() {
		return this.confidential;
	},
	setConfidential: function(confidential) {
		this.confidential = confidential;
	},
	getHostDomain: function() {
		return this.hostDomain;
	},
	setHostDomain: function(hostDomain) {
		this.hostDomain = hostDomain;
	},
	getHostPort: function() {
		return this.hostPort;
	},
	setHostPort: function(hostPort) {
		this.hostPort = hostPort;
	},
	getMethod: function() {
		return this.method;
	},
	setMethod: function(method) {
		this.method = method;
	},
	getProtocol: function() {
		return this.protocol;
	},
	setProtocol: function(protocol) {
		this.protocol = protocol;
	},
    getReasonPhrase: function() {
		return this.reasonPhrase;
	},
	setReasonPhrase: function(reasonPhrase) {
		this.reasonPhrase = reasonPhrase;
	},
	getRequestHeaders: function() {
		return this.requestHeaders;
	},
	setRequestHeaders: function(requestHeaders) {
		this.requestHeaders = requestHeaders;
	},
	getRequestUri: function() {
		return this.requestUri;
	},
	setRequestUri: function(requestUri) {
		this.requestUri = requestUri;
	},
	getResponseHeaders: function() {
		return this.responseHeaders;
	},
	setResponseHeaders: function(responseHeaders) {
		this.responseHeaders = responseHeaders;
	},
	getServerAddress: function() {
		return this.serverAddress;
	},
	setServerAddress: function(serverAddress) {
		this.serverAddress = serverAddress;
	},
	getServerPort: function() {
		return this.serverPort;
	},
	setServerPort: function(serverPort) {
		this.serverPort = serverPort;
	},
	getStatusCode: function() {
		return this.statusCode;
	},
	setStatusCode: function(statusCode) {
		this.statusCode = statusCode;
	},
	getStatusCode: function() {
		return this.statusCode;
	},
	setStatusCode: function(statusCode) {
		this.statusCode = statusCode;
	},
	getVersion: function() {
		return this.version;
	},
	setVersion: function(version) {
		this.version = version;
	}
});

var ClientCall = new Class(Call, {
	initialize: function() {
		//TODO: fix recursive callSuper bug
		//this.callSuper();
		this.requestHeaders = [];
		this.responseHeaders = [];
	},
	getContentLength: function() {
		return HeaderUtils.getContentLength(this.getResponseHeaders());
	},
	getResponseEntity: function(response) {
        var result = response.getEntity();
        var size = Representation.UNKNOWN_SIZE;

        // Compute the content length
        var responseHeaders = this.getResponseHeaders();
        var transferEncoding = responseHeaders.getFirstValue(
        			HeaderConstants.HEADER_TRANSFER_ENCODING, true);
        if ((transferEncoding != null)
        		&& !"identity".equalsIgnoreCase(transferEncoding)) {
        	size = Representation.UNKNOWN_SIZE;
        } else {
        	size = this.getContentLength();
        }

        if (!this.getMethod().equals(Method.HEAD)
                && !response.getStatus().isInformational()
                && !response.getStatus().equals(Status.REDIRECTION_NOT_MODIFIED)
                && !response.getStatus().equals(Status.SUCCESS_NO_CONTENT)
                && !response.getStatus().equals(Status.SUCCESS_RESET_CONTENT)) {
        	result = response.getEntity();
        }

        if (result != null) {
            result.setSize(size);

            // Informs that the size has not been specified in the header.
            if (size == Representation.UNKNOWN_SIZE) {
                /*getLogger()
                        .fine("The length of the message body is unknown. The entity must be handled carefully and consumed entirely in order to surely release the connection.");*/
            }
        }
        result = HeaderUtils.extractEntityHeaders(responseHeaders, result);

        return result;
    }
});

var BrowserHttpClientCall = new Class(ClientCall, {
	initialize: function() {
		this.callSuper();
		this.xhr = this.createXhrObject();
	},
	getAcceptHeader: function() {
		for (var i=0; i<this.requestHeaders.length; i++) {
			var requestHeader = this.requestHeaders[i];
			if (requestHeader.getName()==HeaderConstants.HEADER_ACCEPT) {
				return requestHeader.getValue();
			}
		}
		return null;
	},
	sendRequest: function(request, callback) {
		var method = request.getMethod().getName();
		var acceptHeader = this.getAcceptHeader();
		if (method=="GET" && acceptHeader=="application/jsonp") {
			this.sendRequestWithJsonp(request, callback);
		} else {
			this.sendRequestWithXhr(request, callback);
		}
	},
	createXhrObject: function() {
	    if (window.XMLHttpRequest)
	        return new XMLHttpRequest();
	 
	    if (window.ActiveXObject) {
	        var names = [
	            "Msxml2.XMLHTTP.6.0",
	            "Msxml2.XMLHTTP.3.0",
	            "Msxml2.XMLHTTP",
	            "Microsoft.XMLHTTP"
	        ];
	        for(var i in names) {
	            try{ return new ActiveXObject(names[i]); }
	            catch(e){}
	        }
	    }
	    return null; // not supported
	},
	sendRequestWithXhr: function(request, callback) {
		var currentThis = this;
		var response = new Response(request);
		var url = request.getResourceRef().toString(true, true);
		var method = request.getMethod().getName();
		this.method = request.getMethod();
		var clientInfo = request.getClientInfo();
		var requestHeaders = {};
		for (var i=0; i<this.requestHeaders.length; i++) {
			var requestHeader = this.requestHeaders[i];
			requestHeaders[requestHeader.getName()] = requestHeader.getValue();
		}
		var data = "";
		if (request.getEntity()!=null) {
			data = request.getEntity().getText();
		}
		var debugHandler = Engine.getInstance().getDebugHandler();
		if (debugHandler!=null && debugHandler.beforeSendingRequest!=null) {
			debugHandler.beforeSendingRequest(url, method, requestHeaders, data);
		}
		this.lowLevelSendRequest(url, method, requestHeaders, data, function(xhr) {
			currentThis.extractResponseHeaders(xhr);

			var representation = new Representation();
			representation = HeaderUtils.extractEntityHeaders(
								currentThis.getResponseHeaders(xhr), representation);
			representation.write(xhr);
			var status = new Status(xhr.status, xhr.statusText);
			response.setStatus(status);
			response.setEntity(representation);
			if (debugHandler!=null && debugHandler.afterReceivedResponse!=null) {
				var responseHeaders = {};
				for (var i=0; i<currentThis.responseHeaders.length; i++) {
					var header = currentThis.responseHeaders[i];
					responseHeaders[header.getName()] = header.getValue();
				}
				debugHandler.afterReceivedResponse(xhr.status, xhr.statusText, responseHeaders, representation.getText());
			}
			callback(response);
		});
	},
	sendRequestWithJsonp: function(request, callback) {
		var callbackName = "jsonpReceiver" + (new Date()).getTime();
		var url = request.getResourceRef().toString(true, true)+"&callback="+callbackName;
		
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
	    script.type = "text/javascript";
	    script.src = url;
	    head.appendChild(script);

	    var currentThis = this;
		var response = new Response(request);
		var method = request.getMethod().getName();
		this.method = request.getMethod();
		var clientInfo = request.getClientInfo();
		var requestHeaders = {};
		var data = "";
		var debugHandler = Engine.getInstance().getDebugHandler();
		if (debugHandler!=null && debugHandler.beforeSendingRequest!=null) {
			debugHandler.beforeSendingRequest(url, method, requestHeaders, data);
		}
		window[callbackName] = function(data) {
			var status = new Status(200, "OK");
			response.setStatus(status);
			var representation = new JsonRepresentation();
			representation.setObject(data);
			response.setEntity(representation);
			callback(response);
			window[callbackName] = null;
			head.removeChild(script);
		};
	},
	extractResponseHeaders: function(xhr) {
		var headersString = xhr.getAllResponseHeaders();
		var headers = [];
		var headerEntries = headersString.split("\n");
		for (var cpt=0;cpt<headerEntries.length;cpt++) {
			var headerEntry = headerEntries[cpt];
			var index = headerEntry.indexOf(":");
			if (headerEntry!="" && index!=-1) {
				var header = new Parameter(
						headerEntry.substring(0, index),
						headerEntry.substring(index+1));
				headers.push(header);
			}
		}
		this.setResponseHeaders(headers);
	},
	lowLevelSendRequest: function(url,httpMethod,headers,data,onResponseCallback) {
		var currentThis = this;
		currentThis.xhr.open(httpMethod, url);
		currentThis.xhr.onreadystatechange = function() {
			if (this.readyState==4) {
				onResponseCallback(currentThis.xhr);
			}
		};

		if (headers!=null) {
			for (var headerName in headers) {
				currentThis.xhr.setRequestHeader(headerName,headers[headerName]);
			}
		}
		  
		if (data!=null && data!="") {
			currentThis.xhr.send("" + data);
		} else {
			currentThis.xhr.send();
		}
	}
});

var ClientAdapter = new Class({
	initialize: function(context) {
	},
    readResponseHeaders: function(httpCall, response) {
        try {
            var responseHeaders = httpCall.getResponseHeaders();

            // Put the response headers in the call's attributes map
            response.getAttributes()[HeaderConstants.ATTRIBUTE_HEADERS] = responseHeaders;

            HeaderUtils.copyResponseTransportHeaders(responseHeaders, response);
        } catch (err) {
            response.setStatus(Status.CONNECTOR_ERROR_INTERNAL, err);
        }
    },
    toSpecific: function(client, request) {
        // Create the low-level HTTP client call
        var result = client.create(request);

        // Add the headers
        if (result != null) {
            HeaderUtils.addGeneralHeaders(request, result.getRequestHeaders());

            if (request.getEntity() != null) {
                HeaderUtils.addEntityHeaders(request.getEntity(),
                        result.getRequestHeaders());
            }

            // NOTE: This must stay at the end because the AWS challenge
            // scheme requires access to all HTTP headers
            HeaderUtils.addRequestHeaders(request, result.getRequestHeaders());
        }

        return result;
    },
    updateResponse: function(response, status, httpCall) {
        // Send the request to the client
        response.setStatus(status);

        // Get the server address
        response.getServerInfo().setAddress(httpCall.getServerAddress());
        response.getServerInfo().setPort(httpCall.getServerPort());

        // Read the response headers
        this.readResponseHeaders(httpCall, response);

        // Set the entity
        response.setEntity(httpCall.getResponseEntity(response));

        // Release the representation's content for some obvious cases
        if (response.getEntity() != null) {
            if (response.getEntity().getSize() == 0) {
                response.getEntity().release();
            } else if (response.getRequest().getMethod()==Method.HEAD) {
                response.getEntity().release();
            } else if (response.getStatus()==Status.SUCCESS_NO_CONTENT) {
                response.getEntity().release();
            } else if (response.getStatus()
                    ==Status.SUCCESS_RESET_CONTENT) {
                response.getEntity().release();
                response.setEntity(null);
            } else if (response.getStatus()==
                    Status.REDIRECTION_NOT_MODIFIED) {
                response.getEntity().release();
            } else if (response.getStatus().isInformational()) {
                response.getEntity().release();
                response.setEntity(null);
            }
        }
    },
    commit: function(httpCall, request, callback) {
        if (httpCall != null) {
            // Send the request to the client
        	var currentThis = this;
            httpCall.sendRequest(request, function(response) {
                try {
                	currentThis.updateResponse(response,
                            new Status(httpCall.getStatusCode(), null,
                                    httpCall.getReasonPhrase(), null),
                            httpCall);
                    callback(response);
                } catch (err) {
                    // Unexpected exception occurred
                    if ((response.getStatus() == null)
                            || !response.getStatus().isError()) {
                        response.setStatus(
                                Status.CONNECTOR_ERROR_INTERNAL, err);
                        callback(response);
                    }
                }
            });
        }
    }
});

var HttpClientHelper = new Class({
    //public abstract ClientCall create(Request request);
	getAdapter: function() {
        if (this.adapter == null) {
            this.adapter = new ClientAdapter(/*this.getContext()*/);
        }

        return this.adapter;
	},
    handle: function(request, callback) {
        try {
            var clientCall = this.getAdapter().toSpecific(this, request);
            this.getAdapter().commit(clientCall, request, callback);
        } catch (err) {
            /*getLogger().log(Level.INFO,
                    "Error while handling an HTTP client call", e);*/
        	var response = new Response(request);
            response.setStatus(Status.CONNECTOR_ERROR_INTERNAL, err);
            response.setEntity(new Representation());
            callback(response);
        }
    }
});

var BrowserHttpClientHelper = new Class(HttpClientHelper, {
	initialize: function(client) {
		this.client = client;
	},
	create: function(request) {
		return new BrowserHttpClientCall();
	}
});

var Client = new Class(Connector, {
	initialize: function(context, protocols, helper) {
		//TODO:
		//this.callSuper(context, protocols, helper);
		this.setContext(context);
		this.setProtocols(protocols);
		
		this.configureHelper(helper);
	},
	configureHelper: function(helper) {
		if (this.helper!=null) {
			this.helper = helper;
			return;
		}
		if (this.protocols!=null && this.protocols.length>0) {
			if (Engine.getInstance()!=null) {
				this.helper = Engine.getInstance().createHelper(this);
            } else {
                this.helper = null;
            }
        } else {
            this.helper = null;
		}
	},
	getHelper: function() {
		return this.helper;
	},
	handle: function(request, callback) {
        //this.callSuper(request, callback);

        if (this.getHelper()!=null) {
            this.getHelper().handle(request, callback);
        } else {
            /*StringBuilder sb = new StringBuilder();
            sb.append("No available client connector supports the required protocol: ");
            sb.append("'").append(request.getProtocol().getName()).append("'.");
            sb.append(" Please add the JAR of a matching connector to your classpath.");
            response.setStatus(Status.CONNECTOR_ERROR_INTERNAL, sb.toString());*/
        	//console.log("No available client connector supports the required protocol: ");
        }
    }
});

var MediaTypeUtils = new Class({});
MediaTypeUtils.extend({
    _TSPECIALS: "()<>@,;:/[]?=\\\"",

    normalizeToken: function(token) {
        var length;
        var c;

        // Makes sure we're not dealing with a "*" token.
        token = token.trim();
        if ("".equals(token) || "*".equals(token))
            return "*";

        // Makes sure the token is RFC compliant.
        length = token.length;
        for (var i = 0; i < length; i++) {
            c = token.charAt(i);
            if (c <= 32 || c >= 127 || MediaTypeUtils._TSPECIALS.indexOf(c) != -1)
                throw new Error("Illegal token: " + token);
        }

        return token;
    },

	normalizeType: function(name, parameters) {
        var slashIndex;
        var colonIndex;
        var mainType;
        var subType;
        var params = null;

        // Ignore null names (backward compatibility).
        if (name == null)
            return null;

        // Check presence of parameters
        if ((colonIndex = name.indexOf(';')) != -1) {
            params = new StringBuilder(name.substring(colonIndex));
            name = name.substring(0, colonIndex);
        }

        // No main / sub separator, assumes name/*.
        if ((slashIndex = name.indexOf('/')) == -1) {
            mainType = MediaTypeUtils.normalizeToken(name);
            subType = "*";
        } else {
            // Normalizes the main and sub types.
            mainType = MediaTypeUtils.normalizeToken(name.substring(0, slashIndex));
            subType = MediaTypeUtils.normalizeToken(name.substring(slashIndex + 1));
        }

        // Merge parameters taken from the name and the method argument.
        if (parameters != null && !parameters.isEmpty()) {
            if (params == null) {
                params = new StringBuilder();
            }
            var hw = new HeaderWriter();
            hw.appendObject = function(value) {
            	return this.appendExtension(value);
            };
            for (var i = 0; i < parameters.size(); i++) {
                var p = parameters.get(i);
                hw.appendParameterSeparator();
                hw.appendSpace();
                hw.appendObject(p);
            }
            params.append(hw.toString());
        }

        return (params == null) ? mainType + '/' + subType : mainType + '/'
                + subType + params.toString();
    }
});

var MediaType = new Class(Metadata, {
	initialize: function(name, parameters, description) {
		if (description==null) {
			description = "Media type or range of media types";
		}
        this.callSuper(MediaTypeUtils.normalizeType(name, parameters), description);
    },

    getMainType: function() {
        var result = null;

        if (this.getName() != null) {
            var index = this.getName().indexOf('/');

            // Some clients appear to use name types without subtypes
            if (index == -1) {
                index = this.getName().indexOf(';');
            }

            if (index == -1) {
                result = this.getName();
            } else {
                result = this.getName().substring(0, index);
            }
        }

        return result;
    },

	getParameters: function() {
        if (this.parameters == null) {
            if (this.getName() != null) {
                var index = this.getName().indexOf(';');

                if (index != -1) {
                	this.parameters = new Form(this.getName().substring(index + 1)
                            .trim(), ';');
                }
            }
            
            if (this.parameters==null) {
            	this.parameters = new Form();
            }
        }
        return this.parameters;
    },

    getParent: function() {
        var result = null;

        if (this.getParameters().size() > 0) {
            result = MediaType.valueOf(this.getMainType() + "/" + this.getSubType());
        } else {
            if (this.getSubType().equals("*")) {
                result = this.equals(MediaType.ALL) ? null : MediaType.ALL;
            } else {
                result = MediaType.valueOf(this.getMainType() + "/*");
            }
        }

        return result;
    },

    getSubType: function() {
        var result = null;

        if (this.getName() != null) {
            var slash = this.getName().indexOf('/');

            if (slash == -1) {
                // No subtype found, assume that all subtypes are accepted
                result = "*";
            } else {
                var separator = this.getName().indexOf(';');
                if (separator == -1) {
                    result = this.getName().substring(slash + 1);
                } else {
                    result = this.getName().substring(slash + 1, separator);
                }
            }
        }

        return result;
    }
});

MediaType.extend({
	APPLICATION_JSON: new MediaType("application/json"),
	APPLICATION_JSONP: new MediaType("application/jsonp"),
	TEXT_JSON: new MediaType("text/json"),
	APPLICATION_XML: new MediaType("application/xml"),
	TEXT_XML: new MediaType("text/xml"),
    _TSPECIALS: "()<>@,;:/[]?=\\\"",

    normalizeToken: function(token) {
        var length;
        var c;

        // Makes sure we're not dealing with a "*" token.
        token = token.trim();
        if ("".equals(token) || "*".equals(token))
            return "*";

        // Makes sure the token is RFC compliant.
        length = token.length;
        for (var i = 0; i < length; i++) {
            c = token.charAt(i);
            if (c <= 32 || c >= 127 || MediaType._TSPECIALS.indexOf(c) != -1)
                throw new Error("Illegal token: " + token);
        }

        return token;
    },

	normalizeType: function(name, parameters) {
        var slashIndex;
        var colonIndex;
        var mainType;
        var subType;
        var params = null;

        // Ignore null names (backward compatibility).
        if (name == null)
            return null;

        // Check presence of parameters
        if ((colonIndex = name.indexOf(';')) != -1) {
            params = new StringBuilder(name.substring(colonIndex));
            name = name.substring(0, colonIndex);
        }

        // No main / sub separator, assumes name/*.
        if ((slashIndex = name.indexOf('/')) == -1) {
            mainType = MediaType.normalizeToken(name);
            subType = "*";
        } else {
            // Normalizes the main and sub types.
            mainType = MediaType.normalizeToken(name.substring(0, slashIndex));
            subType = MediaType.normalizeToken(name.substring(slashIndex + 1));
        }

        // Merge parameters taken from the name and the method argument.
        if (parameters != null && !parameters.isEmpty()) {
            if (params == null) {
                params = new StringBuilder();
            }
            var hw = new HeaderWriter();
            hw.appendObject = function(value) {
            	return this.appendExtension(value);
            };
            for (var i = 0; i < parameters.size(); i++) {
                var p = parameters.get(i);
                hw.appendParameterSeparator();
                hw.appendSpace();
                hw.appendObject(p);
            }
            params.append(hw.toString());
        }

        return (params == null) ? mainType + '/' + subType : mainType + '/'
                + subType + params.toString();
    }
});

var Variant = new Class({
	setMediaType: function(mediaType) {
		this.mediaType = mediaType;
	},
	getMediaType: function() {
		return this.mediaType;
	},
	getCharacterSet: function() {
		return this.characterSet;
	},
	setCharacterSet: function(characterSet) {
		this.characterSet = characterSet;
	},
	getEncodings: function() {
		if (this.encodings==null) {
			this.encodings = [];
		}
		return this.encodings;
	},
	setEncodings: function(encodings) {
		this.encodings = encodings;
	},
	getLocationRef: function() {
		return this.locationRef;
	},
	setLocationRef: function(locationRef) {
		this.locationRef = locationRef;
	},
    getLanguages: function() {
		if (this.languages==null) {
			this.languages = [];
		}
		return this.languages;
	},
	setLanguages: function(languages) {
		this.languages = languages;
	}
});

var RepresentationInfo = new Class(Variant, {
    getModificationDate: function() {
    	return this.modificationDate;
    },
    setModificationDate: function(date) {
    	this.modificationDate = date;
    },
    getTag: function() {
    	return this.tag;
    },
    setTag: function(tag) {
    	this.tag = tag;
    }
});

var Representation = new Class(RepresentationInfo, {
	initialize: function() {
	},
    isAvailable: function() {
    	return this.available && (this.getSize() != 0);
    },
    setAvailable: function(available) {
    	this.available = available;
    },
    getDisposition: function() {
    	return this.disposition;
    },
    setDisposition: function(disposition) {
    	this.disposition = disposition;
    },
    getExpirationDate: function() {
    	return this.expirationDate;
    },
    setExpirationDate: function(expirationDate) {
    	this.expirationDate = expirationDate;
    },
    getIsTransient: function() {
    	return this.isTransient;
    },
    setIsTransient: function(isTransient) {
    	this.isTransient = isTransient;
    },
    getRange: function() {
    	return this.range;
    },
    setRange: function(range) {
    	this.range = range;
    },
    getSize: function() {
    	return this.size;
    },
    setSize: function(size) {
    	this.size = size;
    },
    getTag: function() {
    	return this.tag;
    },
    setTag: function(tag) {
    	this.tag = tag;
    },
    getText: function() {
		return this.text;
	},
	getXml: function() {
		return this.xml;
	},
	write: function(content) {
		if (typeof content=="string") {
			this.text = content;
		} else if (content instanceof Document) {
			this.xml = content;
		} else {
			this.text = content.responseText;
			this.xml = content.responseXML;
		}
	},
	release: function() {
        this.setAvailable(false);
    }
});

Representation.extend({
	UNKNOWN_SIZE: -1
});

var EmptyRepresentation = new Class(Representation, { 
	initialize: function(content) {
		
	},
	
	getText: function() {
		return null;
	}
});

var JsonRepresentation = new Class(Representation, { 
	initialize: function(content) {
		if (typeof this.text == "undefined") {
			this.text = null;
		}
		this.obj = null;
		this.representation = null;
		if (typeof content == "string") {
			this.text = content;
		} else if (content instanceof Representation) {
			this.representation = content;
		} else if (typeof content == "object") {
			this.obj = content;
		}
		this.setMediaType(MediaType.APPLICATION_JSON);
	},
	getText: function() {
		if (this.obj!=null) {
			return window.JSON.stringify(this.obj);
		} else {
			return "";
		}
	},
	setObject: function(obj) {
		this.obj = obj
	},
	getObject: function() {
		if (this.text!=null) {
			return window.jsonParse(this.text);
		} else if (this.representation!=null) {
			return window.jsonParse(this.representation.getText());
		} else if (this.obj!=null) {
			return this.obj; 
		} else {
			return null;
		}
	}
});

var DomRepresentation = new Class(Representation, { 
	initialize: function(content) {
		if (typeof this.text == "undefined") {
			this.text = null;
		}
		if (typeof this.xml == "undefined") {
			this.xml = null;
		}
		this.representation = null;
		if (typeof content == "string") {
			this.text = content;
		} else if (content instanceof Representation) {
			this.representation = content;
		} else if (typeof content == "object") {
			if (content instanceof Document) {
				this.xml = content;
			} else {
				this.obj = content;
			}
		}
		this.setMediaType(MediaType.APPLICATION_XML);
	},
	getText: function() {
		if (this.xml!=null) {
			var document = this.xml.documentElement; 
			if (document.xml==undefined){ 
				return (new XMLSerializer()).serializeToString(this.xml); 
			} else {
				return document.xml; 
			}
		}
		return "";
	},
	getXml: function() {
		if (this.representation!=null) {
			return this.representation.getXml();
		} else if (this.text!=null) {
			if (window.ActiveXObject) {
				var doc = new ActiveXObject("Microsoft.XMLDOM"); 
				document.async="false"; 
				document.loadXML(this.text);
				return document;
			} else { 
				var parser = new DOMParser(); 
				return parser.parseFromString(this.text, "text/xml"); 
			} 
		} else {
			return this.xml;
		}
	}
});

var StringRepresentation = new Class(Representation, {
	initialize: function(text, mediaType, language, characterSet) {
        this.callSuper(mediaType);
        this.setMediaType(mediaType);
        if (language != null) {
            this.getLanguages().add(language);
        }

        this.setCharacterSet(characterSet);
        this.setText(text);
	},

	getText: function() {
		return this.text;
	},

	release: function() {
		this.setText(null);
        this.setAvailable(false);
	},

	setCharacterSet: function(characterSet) {
		this.characterSet = characterSet;
		this.updateSize();
	},

	setText: function(text) {
		this.text = text;
		this.updateSize();
	},

	toString: function() {
		return this.getText();
	},

	updateSize: function() {
		if (this.getText() != null) {
			this.setSize(this.getText().length);
		} else {
			this.setSize(Representation.UNKNOWN_SIZE);
		}
	}
});

var XmlRepresentation = new Class(DomRepresentation, {
	initialize: function(content, objectName) {
		if (typeof this.text == "undefined") {
			this.text = null;
		}
		this.representation = null;
		if (typeof content == "string") {
			this.text = content;
		} else if (content instanceof Representation) {
			this.representation = content;
		} else if (typeof content == "object") {
			this.obj = content;
		}
		this.objectName = objectName;
		this.setMediaType(MediaType.APPLICATION_XML);
	},
	createDocument: function(namespaceURL, rootTagName) {
	  if (document.implementation && document.implementation.createDocument) { 
	    return document.implementation.createDocument(namespaceURL, rootTagName, null); 
	  } else {
		var doc = new ActiveXObject("MSXML2.DOMDocument"); 
	    if (rootTagName) { 
	      var prefix = ""; 
	      var tagname = rootTagName; 
	      var p = rootTagName.indexOf(':'); 
	      if (p != -1) { 
	        prefix = rootTagName.substring(0, p); 
	        tagname = rootTagName.substring(p+1); 
	      }
	      if (namespaceURL) { 
	        if (!prefix) prefix = "a0"; 
	      } else prefix = ""; 
	      var text = "<" + (prefix?(prefix+":"):"") +  tagname + 
	             (namespaceURL 
	             ?(" xmlns:" + prefix + '="' + namespaceURL +'"') 
	             :"") + 
	             "/>"; 
	      doc.loadXML(text); 
	    }
	    return doc; 
	  } 
	},
	serializeObject: function(document, element, obj) {
		for (var elt in obj) {
			var eltElement = document.createElement(elt);
			if (typeof obj[elt]!="object") {
				var textElement = document.createTextNode(obj[elt]);
				eltElement.appendChild(textElement);
			} else {
				this.serializeObject(document, eltElement, obj[elt]);
			}
			element.appendChild(eltElement);
		}
	},
	getObjectName: function() {
		if (this.objectName!=null) {
			return this.objectName;
		} else {
			return "object";
		}
	},
	getText: function() {
		var document = this.createDocument("", this.getObjectName());
		this.serializeObject(document, document.childNodes[0], this.obj);
		if (document.xml==undefined){ 
			return (new XMLSerializer()).serializeToString(document); 
		} else {
			return document.xml; 
		}
	},
	unserializeObject: function(obj, element) {
		var children = element.childNodes;
		for (var cpt=0; cpt<children.length; cpt++) {
			var child = children[cpt];
			if (child.childNodes.length==1 && child.childNodes[0].nodeName=="#text") {
				obj[child.nodeName] = child.childNodes[0].nodeValue;
			} else {
				obj[child.nodeName] = {};
				this.unserializeObject(obj[child.nodeName], child);
			}
		}
	},
	getObject: function() {
		if (this.obj!=null) {
			return this.obj;
		}

		var xml = null;
		if (window.ActiveXObject) {
			var doc = new ActiveXObject("Microsoft.XMLDOM"); 
			document.async = "false"; 
			document.loadXML(this.text);
			xml = document;
		} else { 
			var parser = new DOMParser(); 
			xml = parser.parseFromString(this.text, "text/xml"); 
		} 

		var obj = {};
		this.unserializeObject(obj, xml.childNodes[0]);
		return obj;
	}
});

var Resource = new Class({

    /*protected void doCatch(Throwable throwable) {
        getLogger().log(Level.INFO, "Exception or error caught in resource",
                throwable);
    }

    protected void doError(Status errorStatus) {
    }

    protected final void doError(Status errorStatus, String errorMessage) {
        doError(new Status(errorStatus, errorMessage));
    }

    protected void doInit() throws ResourceException {
    }

    protected void doRelease() throws ResourceException {
    }*/

    getAllowedMethods: function() {
        return this.getResponse() == null ? null : this.getResponse().getAllowedMethods();
    },

    /*getApplication: function() {
        var result = this.application;

        if (result == null) {
            result = Application.getCurrent();

            if (result == null) {
                result = new Application(this.getContext());
            }

            this.application = result;
        }

        return result;
    },*/

    getChallengeRequests: function() {
        return this.getResponse() == null ? null : this.getResponse()
                .getChallengeRequests();
    },

    getChallengeResponse: function() {
        return this.getRequest() == null ? null : this.getRequest()
                .getChallengeResponse();
    },

    getClientInfo: function() {
        return this.getRequest() == null ? null : this.getRequest().getClientInfo();
    },

    getConditions: function() {
        return this.getRequest() == null ? null : this.getRequest().getConditions();
    },

    getContext: function() {
        return this.context;
    },

    /*public org.restlet.service.ConnegService getConnegService() {
        org.restlet.service.ConnegService result = null;

        result = getApplication().getConnegService();

        if (result == null) {
            result = new org.restlet.service.ConnegService();
        }

        return result;
    }*/

    /*public org.restlet.service.ConverterService getConverterService() {
        org.restlet.service.ConverterService result = null;

        result = getApplication().getConverterService();

        if (result == null) {
            result = new org.restlet.service.ConverterService();
        }

        return result;
    }*/

    getCookies: function() {
        return this.getRequest() == null ? null : this.getRequest().getCookies();
    },

    getCookieSettings: function() {
        return this.getResponse() == null ? null : this.getResponse().getCookieSettings();
    },

    getDimensions: function() {
        return this.getResponse() == null ? null : this.getResponse().getDimensions();
    },

    getHostRef: function() {
        return this.getRequest() == null ? null : this.getRequest().getHostRef();
    },

    getLocationRef: function() {
        return this.getResponse() == null ? null : this.getResponse().getLocationRef();
    },

    /*public Logger getLogger() {
        return getContext() != null ? getContext().getLogger() : Context
                .getCurrentLogger();
    }*/

    getMatrix: function() {
        return this.getReference() == null ? null : this.getReference().getMatrixAsForm();
    },

    getMaxForwards: function() {
        return this.getRequest() == null ? null : this.getRequest().getMaxForwards();
    },

    /*public MetadataService getMetadataService() {
        MetadataService result = null;

        result = getApplication().getMetadataService();

        if (result == null) {
            result = new MetadataService();
        }

        return result;,
    }*/

    getMethod: function() {
        return this.getRequest() == null ? null : this.getRequest().getMethod();
    },

    getOriginalRef: function() {
        return this.getRequest() == null ? null : this.getRequest().getOriginalRef();
    },

    getProtocol: function() {
        return this.getRequest() == null ? null : this.getRequest().getProtocol();
    },

    getQuery: function() {
        return this.getReference() == null ? null : this.getReference().getQueryAsForm();
    },

    getRanges: function() {
        return this.getRequest() == null ? null : this.getRequest().getRanges();
    },

    getReference: function() {
        return this.getRequest() == null ? null : this.getRequest().getResourceRef();
    },

    getReferrerRef: function() {
        return this.getRequest() == null ? null : this.getRequest().getReferrerRef();
    },

    getRequest: function() {
        return this.request;
    },

    getRequestAttributes: function() {
        return this.getRequest() == null ? null : this.getRequest().getAttributes();
    },

    getRequestCacheDirectives: function() {
        return this.getRequest() == null ? null : this.getRequest().getCacheDirectives();
    },

    getRequestEntity: function() {
        return this.getRequest() == null ? null : this.getRequest().getEntity();
    },

    getResponse: function() {
        return this.response;
    },

    getResponseAttributes: function() {
        return this.getResponse() == null ? null : this.getResponse().getAttributes();
    },

    getResponseCacheDirectives: function() {
        return this.getResponse() == null ? null : this.getResponse()
                .getCacheDirectives();
    },

    getResponseEntity: function() {
        return this.getResponse() == null ? null : this.getResponse().getEntity();
    },

    getRootRef: function() {
        return this.getRequest() == null ? null : this.getRequest().getRootRef();
    },

    getServerInfo: function() {
        return this.getResponse() == null ? null : this.getResponse().getServerInfo();
    },

    getStatus: function() {
        return this.getResponse() == null ? null : this.getResponse().getStatus();
    },

    /*public StatusService getStatusService() {
        StatusService result = null;

        result = getApplication().getStatusService();

        if (result == null) {
            result = new StatusService();
        }

        return result;
    }*/

    //public abstract Representation handle();

    /*public void init(Context context, Request request, Response response) {
        this.context = context;
        this.request = request;
        this.response = response;

        try {
            doInit();
        } catch (Throwable t) {
            doCatch(t);
        }
    }*/

    isConfidential: function() {
        return this.getRequest() == null ? null : this.getRequest().isConfidential();
    },

    isLoggable: function() {
        return this.getRequest() == null ? null : this.getRequest().isLoggable();
    },

    /*public final void release() {
        try {
            doRelease();
        } catch (Throwable t) {
            doCatch(t);
        }
    }*/

    setApplication: function(application) {
        this.application = application;
    },

    setRequest: function(request) {
        this.request = request;
    },

    setResponse: function(response) {
        this.response = response;
    },

    /*toObject: function(source, target)
            throws ResourceException {
        T result = null;

        if (source != null) {
            try {
                org.restlet.service.ConverterService cs = getConverterService();
                result = cs.toObject(source, target, this);
            } catch (Exception e) {
                throw new ResourceException(e);
            }
        }

        return result;
    }

    public Representation toRepresentation(Object source, Variant target) {
        Representation result = null;

        if (source != null) {
            org.restlet.service.ConverterService cs = getConverterService();
            result = cs.toRepresentation(source, target, this);
        }

        return result;
    }*/

    toString: function() {
        return (this.getRequest() == null ? "" : this.getRequest().toString())
                + (this.getResponse() == null ? "" : " => "
                        + this.getResponse().toString());
    }
});

var UniformResource = new Class(Resource, {
});

var ClientResource = new Class(UniformResource, {
	initialize: function(url) {
		this.request = new Request(null, url);
	},
    addQueryParameter: function() {
        return this.getReference().addQueryParameter.apply(this.getReference(), arguments);
    },
	getRequestAttributes: function() {
		if (this.request!=null) {
			return this.request.getAttributes();
		} else {
			return null;
		}
	},
	getResponse: function() {
		return this.response;
	},
	setResponse: function(response) {
		this.response = response;
	},
	getResponseAttributes: function() {
		if (this.response!=null) {
			return this.response.getAttributes();
		} else {
			return null;
		}
	},
	createClientInfo: function(mediaType) {
		var clientInfo = null;
		if (mediaType!=null) {
			clientInfo = new ClientInfo(mediaType);
		} else {
			clientInfo = new ClientInfo();
		}
		return clientInfo;
	},
	"get": function(callback, mediaType) {
		var clientInfo = this.createClientInfo(mediaType);
		this.handle(Method.GET, null, clientInfo, callback);
	},
	"post": function(representation, callback, mediaType) {
		var clientInfo = this.createClientInfo(mediaType);
		this.handle(Method.POST, representation, clientInfo, callback);
	},
	"put": function(representation, callback, mediaType) {
		var clientInfo = this.createClientInfo(mediaType);
		this.handle(Method.PUT, representation, clientInfo, callback);
	},
	"delete": function(callback, mediaType) {
		var clientInfo = this.createClientInfo(mediaType);
		this.handle(Method.DELETE, null, clientInfo, callback);
	},
	createRequest: function() {
		return this.request;
	},
	createResponse: function(request) {
		return new Response(request);
	},
	getNext: function() {
		var result = this.next;

		if (result == null) {
            result = this.createNext();

            if (result != null) {
                this.setNext(result);
                this.nextCreated = true;
            }
        }
		return result;
	},
	setNext: function(next) {
		this.next = next;
	},
	createNext: function() {
        /*var result = null;

        if ((result == null) && (this.getContext() != null)) {
            // Try using directly the client dispatcher
            result = this.getContext().getClientDispatcher();
        }

        if (result == null) {
            var rProtocol = this.getProtocol();
            var rReference = this.getReference();
            var protocol = (rProtocol != null) ? rProtocol
                    : (rReference != null) ? rReference.getSchemeProtocol()
                            : null;

            if (protocol != null) {
                result = new Client(protocol);
            }
        }

        return result;*/
		return new Client(new Context(),/*protocol*/[Protocol.HTTP]);
	},
	handle: function(method, entity, clientInfo, callback) {
        var request = this.createRequest(this.getRequest());
        request.setMethod(method);
        request.setEntity(entity);
        request.setClientInfo(clientInfo);

        this.handleRequest(request, callback);
	},
	handleRequest: function(request, callback) {
        //var response = this.createResponse(request);
        var next = this.getNext();

        if (next != null) {
            // Effectively handle the call
        	this.handleNext(request, callback, next);
        } else {
        	//console
            /*getLogger()
                    .warning(
                            "Unable to process the call for a client resource. No next Restlet has been provided.");*/
        }
	},
	handleNext: function(request, callback, next) {
		var currentThis = this;
		next.handle(request, function(response) {
			currentThis.setResponse(response);
			callback(response.getEntity());
		});
	}
});

// End Restlet