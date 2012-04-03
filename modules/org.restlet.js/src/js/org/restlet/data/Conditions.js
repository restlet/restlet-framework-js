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