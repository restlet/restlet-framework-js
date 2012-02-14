var CacheDirective = new Class(Parameter, {

    /** Indicates if the directive is a digit value. */
    private boolean digit;

    /**
     * Constructor for directives with no value.
     * 
     * @param name
     *            The directive name.
     */
    public CacheDirective(String name) {
        this(name, null);
    }

    /**
     * Constructor for directives with a value.
     * 
     * @param name
     *            The directive name.
     * @param value
     *            The directive value.
     */
    public CacheDirective(String name, String value) {
        this(name, value, false);
    }

    /**
     * Constructor for directives with a value.
     * 
     * @param name
     *            The directive name.
     * @param value
     *            The directive value.
     * @param digit
     *            The kind of value (true for a digit value, false otherwise).
     */
    public CacheDirective(String name, String value, boolean digit) {
        super(name, value);
        this.digit = digit;
    }

    isDigit: function() {
        return this.digit;
    },
    setDigit: function(digit) {
        this.digit = digit;
    }
});

CacheDirective.extend({ 
	maxAge: function(maxAge) {
		return new CacheDirective(HeaderConstants.CACHE_MAX_AGE, Integer
            .toString(maxAge), true);
	},

	maxStale: function() {
    return new CacheDirective(HeaderConstants.CACHE_MAX_STALE);
}

public static CacheDirective maxStale(int maxStale) {
    return new CacheDirective(HeaderConstants.CACHE_MAX_STALE, Integer
            .toString(maxStale), true);
}

public static CacheDirective minFresh(int minFresh) {
    return new CacheDirective(HeaderConstants.CACHE_MIN_FRESH, Integer
            .toString(minFresh), true);
}

public static CacheDirective mustRevalidate() {
    return new CacheDirective(HeaderConstants.CACHE_MUST_REVALIDATE);
}

public static CacheDirective noCache() {
    return new CacheDirective(HeaderConstants.CACHE_NO_CACHE);
}

public static CacheDirective noCache(List<String> fieldNames) {
    StringBuilder sb = new StringBuilder();

    if (fieldNames != null) {
        for (int i = 0; i < fieldNames.size(); i++) {
            sb.append("\"" + fieldNames.get(i) + "\"");

            if (i < fieldNames.size() - 1) {
                sb.append(',');
            }
        }
    }

    return new CacheDirective(HeaderConstants.CACHE_NO_CACHE, sb.toString());
}

public static CacheDirective noCache(String fieldName) {
    return new CacheDirective(HeaderConstants.CACHE_NO_CACHE, "\""
            + fieldName + "\"");
}

public static CacheDirective noStore() {
    return new CacheDirective(HeaderConstants.CACHE_NO_STORE);
}

public static CacheDirective noTransform() {
    return new CacheDirective(HeaderConstants.CACHE_NO_TRANSFORM);
}

public static CacheDirective onlyIfCached() {
    return new CacheDirective(HeaderConstants.CACHE_ONLY_IF_CACHED);
}

public static CacheDirective privateInfo() {
    return new CacheDirective(HeaderConstants.CACHE_PRIVATE);
}

public static CacheDirective privateInfo(List<String> fieldNames) {
    StringBuilder sb = new StringBuilder();

    if (fieldNames != null) {
        for (int i = 0; i < fieldNames.size(); i++) {
            sb.append("\"" + fieldNames.get(i) + "\"");

            if (i < fieldNames.size() - 1) {
                sb.append(',');
            }
        }
    }

    return new CacheDirective(HeaderConstants.CACHE_PRIVATE, sb.toString());
}

public static CacheDirective privateInfo(String fieldName) {
    return new CacheDirective(HeaderConstants.CACHE_PRIVATE, "\"" + fieldName
            + "\"");
}

public static CacheDirective proxyMustRevalidate() {
    return new CacheDirective(HeaderConstants.CACHE_PROXY_MUST_REVALIDATE);
}

public static CacheDirective publicInfo() {
    return new CacheDirective(HeaderConstants.CACHE_PUBLIC);
}

public static CacheDirective sharedMaxAge(int sharedMaxAge) {
    return new CacheDirective(HeaderConstants.CACHE_SHARED_MAX_AGE, Integer
            .toString(sharedMaxAge), true);
}
});