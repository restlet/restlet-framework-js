var AnnotationUtils = new [class Class]({
	initialize: function() {
	    this.cache = {};
	},

	addAnnotationDescriptors: function(descriptors, resourceClass,
            			initialResourceClass, javaScriptMethod) {
        var result = descriptors;

        // Add the annotation descriptor
        if (result == null) {
            result = [];
        }

        var methodAnnotation = javaScriptMethod.metadata;

        var restletMethod = this.getRestletMethod(methodAnnotation);
        if (restletMethod != null) {
            /*var toString = annotation.toString();
            var startIndex = annotation.annotationType().getCanonicalName()
                    .length() + 8;
            var endIndex = toString.length() - 1;
            var value = null;

            if (endIndex > startIndex) {
                value = toString.substring(startIndex, endIndex);

                if ("".equals(value)) {
                    value = null;
                }
            }*/
        	var value = "";

            result.push(new [class AnnotationInfo](initialResourceClass, restletMethod,
                    javaScriptMethod, value));

        }

        return result;
    },

    addAnnotations: function(descriptors, clazz, initialClass) {
        var result = descriptors;

        if (clazz != null && [class ServerResource]!=clazz) {
            // Add the annotation descriptor
            if (result == null) {
                result = [];
            }

            // Inspect the current class
            for (var javaScriptMethodName in clazz.prototype) {
            	var javaScriptMethod = clazz.prototype[javaScriptMethodName];
            	if (typeof javaScriptMethod == "function") {
            		this.addAnnotationDescriptors(result, clazz, initialClass, javaScriptMethod);
            	}
            }
        }

        return result;
    },

    clearCache: function() {
        this.cache.clear();
    },

    getAnnotation: function() {
    	if (arguments.length==2) {
    		this._getAnnotationTwoParams.apply(this, arguments);
    	} else if (arguments.length==6) {
    		this._getAnnotationFiveParams.apply(this, arguments);
    	}
    },
    
    _getAnnotationTwoParams: function(annotations, javaScriptMethod) {
        if (annotations != null) {
            for (var i=0; i<annotations.length; i++) {
            	var annotationInfo = annotations[i];
                if (annotationInfo.getJavaMethod().equals(javaMethod)) {
                    return annotationInfo;
                }
            }
        }

        return null;
    },

    _getAnnotationFiveParams: function(annotations, restletMethod,
    				query, entity, metadataService, converterService) {
        if (annotations != null) {
            for (var i=0; i<annotations.length; i++) {
            	var annotationInfo = annotations[i];
                if (annotationInfo.isCompatible(restletMethod, query, entity,
                        metadataService, converterService)) {
                    return annotationInfo;
                }
            }
        }

        return null;
    },

    getAnnotations: function(clazz, javaScriptMethod) {
    	if (javaScriptMethod!=null) {
            return this.addAnnotationDescriptors(null, clazz, clazz, javaScriptMethod);
    	} else {
            var result = /*this.cache.get(clazz);*/null;

            if (result == null) {
                // Inspect the class itself for annotations
                result = this.addAnnotations(result, clazz, clazz);

                // Put the list in the cache if no one was previously present
                /*var prev = this.cache.putIfAbsent(clazz, result);

                if (prev != null) {
                    // Reuse the previous entry
                    result = prev;
                }*/
            }

            return result;
    	}
    },

    getRestletMethod: function(methodAnnotation) {
        return methodAnnotation == null ? null
                : [class Method].valueOf(methodAnnotation.method);
    }
});

AnnotationUtils.extend({
    instance: new AnnotationUtils(),
    getInstance: function() {
        return AnnotationUtils.instance;
    }
});

