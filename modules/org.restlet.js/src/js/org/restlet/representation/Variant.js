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
		return this.languages;
	},
	setLanguages: function(languages) {
		this.languages = languages;
	}
});