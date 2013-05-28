var CacheDirective = new [class Class]([class Parameter], {
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
		return new CacheDirective([class HeaderConstants].CACHE_MAX_AGE,
						maxAge.toString(), true);
	},

	maxStale: function(maxStale) {
		if (maxStale==null) {
			return new CacheDirective([class HeaderConstants].CACHE_MAX_STALE);
		} else {
		    return new CacheDirective([class HeaderConstants].CACHE_MAX_STALE,
		            		maxStale.toString(), true);
		}
	},

	minFresh: function(minFresh) {
		return new CacheDirective([class HeaderConstants].CACHE_MIN_FRESH,
						minFresh.toString(), true);
	},

	mustRevalidate: function() {
		return new CacheDirective([class HeaderConstants].CACHE_MUST_REVALIDATE);
	},

	noCache: function(fieldNames) {
		if (fieldNames==null) {
			return new CacheDirective([class HeaderConstants].CACHE_NO_CACHE);
		} else if (typeof fieldNames == "string") {
		    return new CacheDirective([class HeaderConstants].CACHE_NO_CACHE, "\""
		            + fieldNames + "\"");
		} else {
		    var sb = new [class StringBuilder]();

		    if (fieldNames != null) {
		        for (var i = 0; i < fieldNames.length; i++) {
		            sb.append("\"" + fieldNames[i] + "\"");

		            if (i < fieldNames.length - 1) {
		                sb.append(',');
		            }
		        }
		    }

		    return new CacheDirective([class HeaderConstants].CACHE_NO_CACHE, sb.toString());
		}
	},

	noStore: function() {
		return new CacheDirective([class HeaderConstants].CACHE_NO_STORE);
	},

	noTransform: function() {
		return new CacheDirective([class HeaderConstants].CACHE_NO_TRANSFORM);
	},

	onlyIfCached: function() {
		return new CacheDirective([class HeaderConstants].CACHE_ONLY_IF_CACHED);
	},

	privateInfo: function(fieldNames) {
		if (fieldNames==null) {
			return new CacheDirective([class HeaderConstants].CACHE_PRIVATE);
		} else if (typeof fieldNames == "string") {
			var fieldName = fieldNames;
			return new CacheDirective([class HeaderConstants].CACHE_PRIVATE, "\"" + fieldName + "\"");
		} else {
			var sb = new [class StringBuilder]();

			if (fieldNames != null) {
				for (var i = 0; i < fieldNames.length; i++) {
					sb.append("\"" + fieldNames[i] + "\"");

					if (i < fieldNames.length - 1) {
						sb.append(',');
					}
				}
			}

			return new CacheDirective([class HeaderConstants].CACHE_PRIVATE, sb.toString());
		}
	},

	proxyMustRevalidate: function() {
		return new CacheDirective([class HeaderConstants].CACHE_PROXY_MUST_REVALIDATE);
	},

	publicInfo: function() {
		return new CacheDirective([class HeaderConstants].CACHE_PUBLIC);
	},

	sharedMaxAge: function(sharedMaxAge) {
		return new CacheDirective([class HeaderConstants].CACHE_SHARED_MAX_AGE,
						sharedMaxAge.toString(), true);
	}
});