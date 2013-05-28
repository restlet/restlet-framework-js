var Reference = new [class Class]({
	initialize: function() {
		if (arguments.length==1) {
			this.internalRef = arguments[0];
		} else if (arguments.length==2) {
			this.baseRef = arguments[0];
			this.internalRef = arguments[1];
		}
		/*var tmp = this.internalRef;
		var index = tmp.indexOf("://");
		if (index!=-1) {
			this.scheme = tmp.substring(0, index);
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
		}*/
		
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
                var sb = new [class StringBuilder]();

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
        var result = new [class StringBuilder]();
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
                    [class Context].getCurrentLogger().log(
                	        [class Level].WARNING,
                	        "Can't parse hostPort : [hostRef,requestUri]=["
                	                + this.getBaseRef() + "," + this.internalRef
                	                + "]");
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

    getQueryAsForm: function() {
    	if (arguments.length==0) {
    		return new [class Form](this.getQuery());
    	} else if (arguments.length==1) {
            return new [class Form](this.getQuery(), arguments[0]);
    	} else {
    		return null;
    	}
    },

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
                                var sb = new [class StringBuilder]();

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
                            var sb = new [class StringBuilder]();

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
                    var sb = new [class StringBuilder]();

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

    normalize: function() {
        // 1. The input buffer is initialized with the now-appended path
        // components and the output buffer is initialized to the empty string.
        var output = new [class StringBuilder]();
        var input = new [class StringBuilder]();
        var path = this.getPath();
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
                this.removeLastSegment(output);
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
                var max = -1;
                for (var i = 1; (max == -1) && (i < input.length()); i++) {
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
        this.setPath(output.toString());

        // Ensure that the scheme and host names are reset in lower case
        this.setScheme(this.getScheme());
        this.setHostDomain(this.getHostDomain());

        // Remove the port if it is equal to the default port of the reference's
        // Protocol.
        var hostPort = this.getHostPort();
        if (hostPort != -1) {
        	var defaultPort = [class Protocol].valueOf(this.getScheme())
                    .getDefaultPort();
            if (hostPort == defaultPort) {
            	this.setHostPort(null);
            }
        }

        return this;
    },

    removeLastSegment: function(output) {
        var min = -1;
        for (var i = output.length() - 1; (min == -1) && (i >= 0); i--) {
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
    },

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

    _setExtensions: function(extensions) {
        var lastSegment = this.getLastSegment();

        if (lastSegment != null) {
            var extensionIndex = lastSegment.indexOf('.');
            var matrixIndex = lastSegment.indexOf(';');
            var sb = new StringBuilder();

            if (extensionIndex != -1) {
                // Extensions found
                sb.append(lastSegment.substring(0, extensionIndex));

                if ((extensions != null) && (extensions.length > 0)) {
                    sb.append('.').append(extensions);
                }

                if (matrixIndex != -1) {
                    sb.append(lastSegment.substring(matrixIndex));
                }
            } else {
                // Extensions not found
                if ((extensions != null) && (extensions.length > 0)) {
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
            this.setLastSegment(sb.toString());
        } else {
        	this.setLastSegment('.' + extensions);
        }
    },

    setExtensions: function(extensions) {
    	if (arguments[0] instanceof Array) {
            if (extensions != null) {
                var sb = new [class StringBuilder]();

                for (var i = 0; i < extensions.length; i++) {
                    if (i > 0) {
                        sb.append('.');
                    }

                    sb.append(extensions[i]);
                }

                this._setExtensions(sb.toString());
            }
    	} else {
            this._setExtensions(extensions);
    	}
    },

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
        var sb = new [class StringBuilder]();

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
        var sb = new [class StringBuilder]();

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
        var sb = new [class StringBuilder]();

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