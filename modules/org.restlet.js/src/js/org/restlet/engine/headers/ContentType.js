var ContentType = new [class Class]({
	initialize: function(value) {
		var index = -1;
		if ((index = value.indexOf(";"))!=-1) {
			this.mediaType = new [class MediaType](value.substring(0,index));
			this.characterSet = new [class CharacterSet](value.substring(index+1));
		} else {
			this.mediaType = new [class MediaType](value);
		}
	},
	getMediaType: function() {
		return this.mediaType;
	},
	getCharacterSet: function() {
		return this.characterSet;
	} 
});