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