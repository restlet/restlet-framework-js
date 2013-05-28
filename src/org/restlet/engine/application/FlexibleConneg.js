var FlexibleConneg = new [class Class]([class StrictConneg], {
    initialize: function(request, metadataService) {
        this.callSuperCstr(request, metadataService);
        var clientInfo = request.getClientInfo();

        if (clientInfo != null) {
            // Get the enriched user preferences
            this.languagePrefs = this.getEnrichedPreferences(
                    clientInfo.getAcceptedLanguages(),
                    (metadataService == null) ? null : metadataService
                            .getDefaultLanguage(), [class Language].ALL);
            this.mediaTypePrefs = this.getEnrichedPreferences(
                    clientInfo.getAcceptedMediaTypes(),
                    (metadataService == null) ? null : metadataService
                            .getDefaultMediaType(), [class MediaType].ALL);
            this.characterSetPrefs = this.getEnrichedPreferences(
                    clientInfo.getAcceptedCharacterSets(),
                    (metadataService == null) ? null : metadataService
                            .getDefaultCharacterSet(), [class CharacterSet].ALL);
            this.encodingPrefs = this.getEnrichedPreferences(
                    clientInfo.getAcceptedEncodings(),
                    (metadataService == null) ? null : metadataService
                            .getDefaultEncoding(), [class Encoding].ALL);
        }
    },

    canAdd: function(metadata, undesired) {
        var add = true;
        if (undesired != null) {
            for (var i=0; i<undesired.length; i++) {
            	var u = undesired[i];
                if (u.equals(metadata)) {
                    add = false;
                    break;
                }
            }
        }

        return add;
    },

    getCharacterSetPrefs: function() {
        return this.characterSetPrefs;
    },

    getEncodingPrefs: function() {
        return this.encodingPrefs;
    },

    getEnrichedPreferences: function(userPreferences, defaultValue, allValue) {
        var result = [];

        // 0) List all undesired metadata
        var undesired = null;
        for (var i=0; i<userPreferences.length; i++) {
        	var pref = userPreferences[i];
            if (pref.getQuality() == 0) {
                if (undesired == null) {
                    undesired = [];
                }
                undesired.add(pref.getMetadata());
            }
        }

        // 1) Add the user preferences
        result.addAll(userPreferences);

        // 2) Add the user parent preferences
        var parent;
        for (var i = 0; i < result.length; i++) {
            var userPref = result[i];
            parent = userPref.getMetadata().getParent();

            // Add the parent, if it is not proscribed.
            if ((parent != null)) {
                if (this.canAdd(parent, undesired)) {
                    result.add(new [class Preference](parent,
                            0.005 + (0.001 * userPref.getQuality())));
                }
            }
        }

        // 3) Add the default preference
        if (defaultValue != null && this.canAdd(defaultValue, undesired)) {
            var defaultPref = new [class Preference](defaultValue, 0.003);
            result.add(defaultPref);
            var defaultParent = defaultValue.getParent();

            if (defaultParent != null && this.canAdd(defaultParent, undesired)) {
                result.add(new [class Preference](defaultParent, 0.002));
            }
        }

        // 5) Add "all" preference
        for (var i = result.length - 1; i >= 0; i--) {
            // Remove any existing preference
            if (result[i].getMetadata().equals(allValue)) {
                result.remove(i);
            }
        }

        result.add(new [class Preference](allValue, 0.001));

        // 6) Return the enriched preferences
        return result;
    },

    getLanguagePrefs: function() {
        return this.languagePrefs;
    },

    getMediaTypePrefs: function() {
        return this.mediaTypePrefs;
    }
});