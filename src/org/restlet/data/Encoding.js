var Encoding = new [class Class](Metadata, {
	initialize: function(name, description) {
		this.callSuperCstr(name, description);
		/*if (description==null) {
			description = "Encoding applied to a representation";
		}
        this.name = name;
        this.description = description;*/
	},

    equals: function(object) {
        return (object instanceof [class Encoding])
                && this.getName().equalsIgnoreCase(object.getName());
    },

    getParent: function() {
        return this.equals(Encoding.ALL) ? null : Encoding.ALL;
    },

    includes: function(included) {
        return this.equals(Encoding.ALL) || (included == null) || this.equals(included);
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