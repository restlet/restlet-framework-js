var CharacterSet = new [class Class](Metadata, {
	initialize: function(name, description) {
		if (name!=null) {
			name == name.toUpperCase();
		}
		if (description==null) {
			description = "Character set or range of character sets";
		}
		this.callSuperCstr(CharacterSet.getIanaName(name), description);
	},

	equals: function(object) {
        return (object instanceof CharacterSet)
                && this.getName()
                        .equalsIgnoreCase(object.getName());
    },

    getParent: function() {
        return this.equals(CharacterSet.ALL) ? null : CharacterSet.ALL;
    },

    includes: function(included) {
        return this.equals(CharacterSet.ALL) || (included == null) || equals(included);
    }
});

CharacterSet.getIanaName = function(name) {
    if (name != null) {
        name = name.toUpperCase();

        if (name.equalsIgnoreCase("MACROMAN")) {
            name = CharacterSet.MACINTOSH.getName();
        } else if (name.equalsIgnoreCase("ASCII")) {
            name = CharacterSet.US_ASCII.getName();
        } else if (name.equalsIgnoreCase("latin1")) {
            name = CharacterSet.ISO_8859_1.getName();
        } else if (name.equalsIgnoreCase("latin2")) {
            name = CharacterSet.ISO_8859_2.getName();
        } else if (name.equalsIgnoreCase("latin3")) {
            name = CharacterSet.ISO_8859_3.getName();
        } else if (name.equalsIgnoreCase("latin4")) {
            name = CharacterSet.ISO_8859_4.getName();
        } else if (name.equalsIgnoreCase("cyrillic")) {
            name = CharacterSet.ISO_8859_5.getName();
        } else if (name.equalsIgnoreCase("arabic")) {
            name = CharacterSet.ISO_8859_6.getName();
        } else if (name.equalsIgnoreCase("greek")) {
            name = CharacterSet.ISO_8859_7.getName();
        } else if (name.equalsIgnoreCase("hebrew")) {
            name = CharacterSet.ISO_8859_8.getName();
        } else if (name.equalsIgnoreCase("latin5")) {
            name = CharacterSet.ISO_8859_9.getName();
        } else if (name.equalsIgnoreCase("latin6")) {
            name = CharacterSet.ISO_8859_10.getName();
        }
    }

    return name;
};

CharacterSet.ALL = new CharacterSet("*", "All character sets");
CharacterSet.ISO_8859_1 = new CharacterSet("ISO-8859-1", "ISO/IEC 8859-1 or Latin 1 character set");
CharacterSet.ISO_8859_2 = new CharacterSet("ISO-8859-2", "ISO/IEC 8859-2 or Latin 2 character set");
CharacterSet.ISO_8859_3 = new CharacterSet("ISO-8859-3", "ISO/IEC 8859-3 or Latin 3 character set");
CharacterSet.ISO_8859_4 = new CharacterSet("ISO-8859-4", "ISO/IEC 8859-4 or Latin 4 character set");
CharacterSet.ISO_8859_5 = new CharacterSet("ISO-8859-5", "ISO/IEC 8859-5 or Cyrillic character set");
CharacterSet.ISO_8859_6 = new CharacterSet("ISO-8859-6", "ISO/IEC 8859-6 or Arabic character set");
CharacterSet.ISO_8859_7 = new CharacterSet("ISO-8859-7", "ISO/IEC 8859-7 or Greek character set");
CharacterSet.ISO_8859_8 = new CharacterSet("ISO-8859-8", "ISO/IEC 8859-8 or Hebrew character set");
CharacterSet.ISO_8859_9 = new CharacterSet("ISO-8859-9", "ISO/IEC 8859-9 or Latin 5 character set");
CharacterSet.ISO_8859_10 = new CharacterSet("ISO-8859-10", "ISO/IEC 8859-10 or Latin 6 character set");
CharacterSet.MACINTOSH = new CharacterSet("macintosh", "Mac OS Roman character set");
CharacterSet.US_ASCII = new CharacterSet("US-ASCII", "US ASCII character set");
CharacterSet.UTF_16 = new CharacterSet("UTF-16", "UTF 16 character set");
CharacterSet.UTF_8 = new CharacterSet("UTF-8", "UTF 8 character set");
CharacterSet.WINDOWS_1252 = new CharacterSet("windows-1252", "Windows 1232 character set");

CharacterSet.valueOf = function(name) {
    var result = null;
    name = CharacterSet.getIanaName(name);

    if ((name != null) && !name.equals("")) {
        if (name.equalsIgnoreCase(CharacterSet.ALL.getName())) {
            result = CharacterSet.ALL;
        } else if (name.equalsIgnoreCase(CharacterSet.ISO_8859_1.getName())) {
            result = CharacterSet.ISO_8859_1;
        } else if (name.equalsIgnoreCase(CharacterSet.US_ASCII.getName())) {
            result = CharacterSet.US_ASCII;
        } else if (name.equalsIgnoreCase(CharacterSet.UTF_8.getName())) {
            result = CharacterSet.UTF_8;
        } else if (name.equalsIgnoreCase(CharacterSet.UTF_16.getName())) {
            result = CharacterSet.UTF_16;
        } else if (name.equalsIgnoreCase(CharacterSet.WINDOWS_1252.getName())) {
            result = CharacterSet.WINDOWS_1252;
        } else if (name.equalsIgnoreCase(CharacterSet.MACINTOSH.getName())) {
            result = CharacterSet.MACINTOSH;
        } else {
            result = new CharacterSet(name);
        }
    }

    return result;
};