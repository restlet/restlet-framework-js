var AnnotationInfo = new [class Class]({
    initialize: function(resourceClass, restletMethod, javaScriptMethod, value) {
        this.resourceClass = resourceClass;
        this.restletMethod = restletMethod;
        this.javaScriptMethod = javaScriptMethod;

        // Parse the main components of the annotation value
        if ((value != null) && !value.equals("")) {
            var queryIndex = value.indexOf('?');

            if (queryIndex != -1) {
                this.query = value.substring(queryIndex + 1);
                value = value.substring(0, queryIndex);
            } else {
                this.query = null;
            }

            var ioSeparatorIndex = value.indexOf(':');

            if (ioSeparatorIndex != -1) {
                this.input = value.substring(0, ioSeparatorIndex);
                this.output = value.substring(ioSeparatorIndex + 1);
            } else {
                this.input = value;
                this.output = value;
            }

        } else {
            this.query = null;
            this.input = null;
            this.output = null;
        }
    },

    equals: function(other) {
        var result = (other instanceof AnnotationInfo);

        if (result && (other != this)) {
            var otherAnnotation = other;

            // Compare the method
            if (result) {
                result = ((this.getJavaScriptMethod() == null)
                        && (otherAnnotation.getJavaScriptMethod() == null) || (this.getJavaScriptMethod() != null)
                        && this.getJavaScriptMethod().equals(
                                otherAnnotation.getJavaScriptMethod()));
            }

            // Compare the resource interface
            if (result) {
                result = ((getResourceClass() == null)
                        && (otherAnnotation.getResourceClass() == null) || (getResourceClass() != null)
                        && getResourceClass().equals(
                                otherAnnotation.getResourceClass()));
            }

            // Compare the Restlet method
            if (result) {
                result = ((this.getRestletMethod() == null)
                        && (otherAnnotation.getRestletMethod() == null) || (this.getRestletMethod() != null)
                        && this.getRestletMethod().equals(
                                otherAnnotation.getRestletMethod()));
            }

            // Compare the input annotation value
            if (result) {
                result = ((this.getInput() == null)
                        && (otherAnnotation.getInput() == null) || (this.getInput() != null)
                        && this.getInput().equals(otherAnnotation.getInput()));
            }

            // Compare the output annotation value
            if (result) {
                result = ((this.getOutput() == null)
                        && (otherAnnotation.getOutput() == null) || (this.getOutput() != null)
                        && this.getOutput().equals(otherAnnotation.getOutput()));
            }

            // Compare the query annotation value
            if (result) {
                result = ((this.getQuery() == null)
                        && (otherAnnotation.getQuery() == null) || (this.getQuery() != null)
                        && this.getQuery().equals(otherAnnotation.getQuery()));
            }
        }

        return result;
    },

    getInput: function() {
        return this.input;
    },

    getJavaInputTypes: function() {
        var types = introspect(this.getJavaScriptMethod());

        for (var i=0; i<types.length; i++) {
        	types[i] = types[i].toLowerCase();
        }

        return types;
    },

    getJavaScriptMethod: function() {
        return this.javaScriptMethod;
    },

    getOutput: function() {
        return this.output;
    },

    getQuery: function() {
        return this.query;
    },

    getRequestVariants: function(metadataService, converterService) {
        var result = null;
        var types = this.getJavaScriptInputTypes();

        if (types != null && types.length >= 1) {
            result = this.getVariants(metadataService, this.getInput());

            if (result == null) {
                var inputType = types[0];
                if (inputClass != null) {
                    result = converterService.getVariants(
                            inputType, null);
                }
            }
        }

        return result;
    },

    getResourceClass: function() {
        return this.resourceClass;
    },

    getRestletMethod: function() {
        return this.restletMethod;
    },

    getVariants: function(metadataService, annotationValue) {
        var result = null;

        if (annotationValue != null) {
            var variants = annotationValue.split("\\|");

            for (var i=0; i<variants.length; i++) {
            	var variantValue = variants[i];
                var variant = null;
                var extensions = variantValue.split("\\+");
                var mediaTypes = null;
                var languages = null;
                var characterSet = null;

                for (var j=0; j<extensions.length; j++) {
                	var extension = extensions[j];
                    if (extension != null) {
                        var metadataList = metadataService
                                .getAllMetadata(extension);

                        if (metadataList != null) {
                            for (var k=0; k<metadataList.length; k++) {
                            	var metadata = metadataList[k];
                                if (metadata instanceof [class MediaType]) {
                                    if (mediaTypes == null) {
                                        mediaTypes = [];
                                    }

                                    mediaTypes.push(metadata);
                                } else if (metadata instanceof [class Language]) {
                                    if (languages == null) {
                                        languages = [];
                                    }

                                    languages.push(metadata);
                                } else if (metadata instanceof [class CharacterSet]) {
                                    if (characterSet == null) {
                                        characterSet = metadata;
                                    } else {
                                        [class Context].getCurrentLogger()
                                                .warning(
                                                        "A representation variant can have only one character set. Please check your annotation value.");
                                    }
                                }
                            }
                        }
                    }
                }

                // Now build the representation variants
                if (mediaTypes != null) {
                    for (var j=0; j<mediaTypes.length; j++) {
                    	var mediaType = mediaTypes[j];
                        if ((result == null) || (!result.contains(mediaType))) {
                            if (result == null) {
                                result = [];
                            }

                            variant = new [class Variant](mediaType);

                            if (languages != null) {
                                variant.getLanguages().addAll(languages);
                            }

                            if (characterSet != null) {
                                variant.setCharacterSet(characterSet);
                            }

                            result.add(variant);
                        }
                    }
                }
            }
        }

        return result;
    },

    isCompatible: function(restletMethod, queryParams, requestEntity, metadataService, converterService) {
        var result = true;

        // Verify query parameters
        if (this.getQuery() != null) {
            var requiredParams = new [class Form](this.getQuery());

            //TODO: migrate...
            for (Iterator<Parameter> iter = requiredParams.iterator(); iter
                    .hasNext() && result;) {
                result = queryParams.contains(iter.next());
            }
        }

        // Verify HTTP method
        if (result) {
            result = this.getRestletMethod().equals(restletMethod);
        }

        // Verify request entity
        if (result) {
            result = this.isCompatibleRequestEntity(requestEntity, metadataService,
                    converterService);

        }

        return result;
    },

    isCompatibleRequestEntity: function(requestEntity, metadataService, converterService) {
        var result = true;

        if ((requestEntity != null) && requestEntity.isAvailable()) {
            var requestVariants = this.getRequestVariants(metadataService,
                    converterService);

            if ((requestVariants != null) && !requestVariants.isEmpty()) {
                // Check that the compatibility
                result = false;

                for (var i = 0; (!result) && (i < requestVariants.length); i++) {
                    result = (requestVariants.get(i)
                            .isCompatible(requestEntity));
                }
            } else {
                result = false;
            }
        }

        return result;
    },

    toString: function() {
        return "AnnotationInfo [javaMethod: " + javaMethod
                + ", resourceInterface: " + resourceClass + ", restletMethod: "
                + restletMethod + ", input: " + this.getInput() + ", output: "
                + this.getOutput() + ", query: " + this.getQuery() + "]";
    }
});