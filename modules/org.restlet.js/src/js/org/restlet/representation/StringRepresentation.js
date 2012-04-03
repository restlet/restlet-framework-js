var StringRepresentation = new Class(Representation, {
	initialize: function(text, mediaType, language, characterSet) {
        this.callSuper(mediaType);
        this.setMediaType(mediaType);
        if (language != null) {
            this.getLanguages().add(language);
        }

        this.setCharacterSet(characterSet);
        this.setText(text);
	},

	getText: function() {
		return this.text;
	},

	release: function() {
		this.setText(null);
        this.setAvailable(false);
	},

	setCharacterSet: function(characterSet) {
		this.characterSet = characterSet;
		this.updateSize();
	},

	setText: function(text) {
		this.text = text;
		this.updateSize();
	},

	toString: function() {
		return this.getText();
	},

	updateSize: function() {
		if (this.getText() != null) {
			this.setSize(this.getText().length);
		} else {
			this.setSize(Representation.UNKNOWN_SIZE);
		}
	}
});