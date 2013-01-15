var StrictConneg = new [class Class]([class Conneg], {
    initialize: function(request, metadataService) {
        this.callSuperCstr(request, metadataService);
    },

    getCharacterSetPrefs: function() {
        return this.getRequest().getClientInfo().getAcceptedCharacterSets();
    },

    getEncodingPrefs: function() {
        return this.getRequest().getClientInfo().getAcceptedEncodings();
    },

    getLanguagePrefs: function() {
        return this.getRequest().getClientInfo().getAcceptedLanguages();
    },

    getMediaTypePrefs: function() {
        return this.getRequest().getClientInfo().getAcceptedMediaTypes();
    },

    scoreAnnotation: function(annotation) {
        var result = -1.0;

        if (annotation != null) {
            if (annotation.getQuery() != null) {
                if ((this.getRequest().getResourceRef() == null)
                        || (this.getRequest().getResourceRef().getQuery() == null)) {
                    // Query constraint defined, but no query provided, no fit
                    result = -1.0;
                } else {
                    // Query constraint defined and a query provided, see if fit
                    var constraintParams = new [class Form](annotation.getQuery());
                    var actualParams = this.getRequest().getResourceRef()
                            .getQueryAsForm();
                    var matchedParams = [];
                    var constraintParam;
                    var actualParam;

                    var allConstraintsMatched = true;
                    var constraintMatched = false;

                    // Verify that each query constraint has been matched
                    for (var i = 0; (i < constraintParams.size())
                            && allConstraintsMatched; i++) {
                        constraintParam = constraintParams.get(i);
                        constraintMatched = false;

                        for (var j = 0; j < actualParams.size(); j++) {
                            actualParam = actualParams.get(j);

                            if (constraintParam.getName().equals(
                                    actualParam.getName())) {
                                // Potential match found based on name
                                if ((constraintParam.getValue() == null)
                                        || constraintParam.getValue().equals(
                                                actualParam.getValue())) {
                                    // Actual match found!
                                    constraintMatched = true;
                                    matchedParams.add(actualParam);
                                }
                            }
                        }

                        allConstraintsMatched = allConstraintsMatched
                                && constraintMatched;
                    }

                    // Test if all actual query parameters matched a constraint,
                    // so
                    // increase score
                    var allActualMatched = (actualParams.size() == matchedParams
                            .size());

                    if (allConstraintsMatched) {
                        if (allActualMatched) {
                            // All filter parameters matched, no additional
                            // parameter found
                            result = 1.0;
                        } else {
                            // All filter parameters matched, but additional
                            // parameters found
                            result = 0.75;
                        }
                    } else {
                        result = -1.0;
                    }
                }
            } else {
                if ((this.getRequest().getResourceRef() == null)
                        || (this.getRequest().getResourceRef().getQuery() == null)) {
                    // No query filter, but no query provided, average fit
                    result = 0.5;
                } else {
                    // No query filter, but a query provided, lower fit
                    result = 0.25;
                }
            }

            /*if (Context.getCurrentLogger().isLoggable(Level.FINE)) {
                Context.getCurrentLogger()
                        .fine("Score of annotation \"" + annotation + "\"= "
                                + result);
            }*/
        } else {
            result = 0.0;
        }

        return result;
    },

    scoreCharacterSet: function(characterSet) {
        return this.scoreMetadata(characterSet, this.getCharacterSetPrefs());
    },

    scoreEncodings: function(encodings) {
        return this.scoreMetadata(encodings, this.getEncodingPrefs());
    },

    scoreLanguages: function(languages) {
        return this.scoreMetadata(languages, this.getLanguagePrefs());
    },

    scoreMediaType: function(mediaType) {
        return this.scoreMetadata(mediaType, this.getMediaTypePrefs());
    },

    scoreMetadata: function() {
    	if (arguments.length==2) {
    		if (arguments[0] instanceof [class Metadata]) {
    			return this._scoreMetadataSimple.apply(this, arguments);
    		} else {
    			return this._scoreMetadataList.apply(this, arguments);
    		}
    	}
    },

    _scoreMetadataList: function(metadataList, prefs) {
        var result = -1.0;
        var current;

        if ((metadataList != null) && !metadataList.isEmpty()) {
            for (var i=0; i<prefs.length; i++) {
            	var pref = prefs[i];
                for (var j=0; j<metadataList.length; j++) {
                	var metadata = metadataList[j];
                    if (pref.getMetadata().includes(metadata)) {
                        current = pref.getQuality();
                    } else {
                        current = -1.0;
                    }

                    if (current > result) {
                        result = current;
                    }
                }
            }
        } else {
            result = 0.0;
        }

        return result;
    },

    _scoreMetadataSimple: function(metadata, prefs) {
        var result = -1.0;
        var current;

        if (metadata != null) {
            for (var i=0; i<prefs.length; i++) {
            	var pref = prefs[i];
                if (pref.getMetadata().includes(metadata)) {
                    current = pref.getQuality();
                } else {
                    current = -1.0;
                }

                if (current > result) {
                    result = current;
                }
            }
        } else {
            result = 0.0 ;
        }

        return result;
    },

    scoreVariant: function(variant) {
        var result = -1.0;
        var languageScore = this.scoreLanguages(variant.getLanguages());

        if (languageScore != -1.0) {
            var mediaTypeScore = this.scoreMediaType(variant.getMediaType());

            if (mediaTypeScore != -1.0) {
                var characterSetScore = this.scoreCharacterSet(variant
                        .getCharacterSet());

                if (characterSetScore != -1.0) {
                    var encodingScore = this.scoreEncodings(variant.getEncodings());

                    if (encodingScore != -1.0) {
                        if (variant instanceof [class VariantInfo]) {
                            var annotationScore = this.scoreAnnotation(variant
                                    .getAnnotationInfo());

                            // Return the weighted average score
                            result = ((languageScore * 4.0)
                                    + (mediaTypeScore * 3.0)
                                    + (characterSetScore * 2.0)
                                    + (encodingScore * 1.0) + (annotationScore * 2.0)) / 12.0;
                            // Take into account the affinity with the input entity
                            result = result * variant.getInputScore();
                        } else {
                            // Return the weighted average score
                            result = ((languageScore * 4.0)
                                    + (mediaTypeScore * 3.0)
                                    + (characterSetScore * 2.0) + (encodingScore * 1.0)) / 10.0;
                        }
                    }
                }
            }
        }

        /*if (Context.getCurrentLogger().isLoggable(Level.FINE)) {
            Context.getCurrentLogger().fine(
                    "Total score of variant \"" + variant + "\"= " + result);
        }*/

        return result;
    }
});