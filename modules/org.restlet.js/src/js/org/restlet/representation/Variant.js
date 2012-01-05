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
	}
    /*private volatile CharacterSet characterSet;
    private volatile List<Encoding> encodings;
    private volatile Reference locationRef;
    private volatile List<Language> languages;
    private volatile MediaType mediaType;*/
});