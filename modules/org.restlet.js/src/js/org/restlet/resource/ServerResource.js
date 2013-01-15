var ServerResource = new [class Class]([class UniformResource], {
    initialize: function() {
        this.annotated = true;
        this.conditional = true;
        this.existing = true;
        this.negotiated = true;
        this.variants = null;
    },

    abort: function() {
        this.getResponse().abort();
    },

	commit: function(obj, variant) {
		this.postHandleProcessing(obj);
		if (obj!=null) {
			if (obj instanceof [class Representation]) {
				this.getResponse().commit(obj);
			} else if (variant!=null) {
				this.getResponse().commit(this.toRepresentation(obj, variant));
			} else {
				throw new Error("A representation must be returned.");
			}
		}
	},

    delete: function() {
        var annotationInfo = null;
        var variant = null;
        if (arguments.length==0) {
        	annotationInfo = getAnnotation([class Method].DELETE);
        } else if (arguments.length==1) {
        	variant = arguments[0];
        	if (variant instanceof [class VariantInfo]) {
        		annotationInfo = variant.getAnnotationInfo();
        	}
        }

        if (annotationInfo != null) {
            this.doHandle(annotationInfo, variant);
        } else {
            this.doError([class Status].CLIENT_ERROR_METHOD_NOT_ALLOWED);
        }
    },

    describeVariants: function() {
        var result = null;

        // The list of all variants is transmitted to the client
        // final ReferenceList refs = new ReferenceList(variants.size());
        // for (final Variant variant : variants) {
        // if (variant.getIdentifier() != null) {
        // refs.add(variant.getIdentifier());
        // }
        // }
        //
        // result = refs.getTextRepresentation();
        return result;
    },

    doCatch: function(err) {
        var level = [class Level].INFoNeO;
        try {
        } catch(err) {
        	console.log(err.stack);
        }
        var status = this.getStatusService().getStatus(err, this);

        if (status.isServerError()) {
            level = [class Level].WARNING;
        } else if (status.isConnectorError()) {
            level = [class Level].INFO;
        } else if (status.isClientError()) {
            level = [class Level].FINE;
        }

        this.getLogger().log(level, "Error caught in server resource",
                err);

        if (this.getResponse() != null) {
        	this.getResponse().setStatus(status);
        }

        this.commit();
    },

    doConditionalHandle: function() {
        var result = null;

        if (this.getConditions().hasSome()) {
            var resultInfo = null;

            if (this.existing) {
                if (this.isNegotiated()) {
                    preferredVariant = this.getPreferredVariant(this.getVariants([class Method].GET));

                    if (preferredVariant == null
                            && this.getConnegService().isStrict()) {
                    	this.doError([class Status].CLIENT_ERROR_NOT_ACCEPTABLE);
                    } else {
                        resultInfo = this.doGetInfo(preferredVariant);
                    }
                } else {
                    resultInfo = this.doGetInfo();
                }

                if (resultInfo == null) {
                    if ((this.getStatus() == null)
                            || (this.getStatus().isSuccess() && ![class Status].SUCCESS_NO_CONTENT
                                    .equals(this.getStatus()))) {
                    	this.doError([class Status].CLIENT_ERROR_NOT_FOUND);
                    } else {
                        // Keep the current status as the developer might prefer
                        // a special status like 'method not authorized'.
                    }
                } else {
                    var status = this.getConditions().getStatus(this.getMethod(),
                            resultInfo);

                    if (status != null) {
                        if (status.isError()) {
                        	this.doError(status);
                        } else {
                        	this.setStatus(status);
                        }
                    }
                }
            } else {
                var status = this.getConditions().getStatus(this.getMethod(),
                        resultInfo);

                if (status != null) {
                    if (status.isError()) {
                    	this.doError(status);
                    } else {
                    	this.setStatus(status);
                    }
                }
            }

            if (([class Method].GET.equals(getMethod()) || [class Method].HEAD
                    .equals(this.getMethod()))
                    && resultInfo instanceof [class Representation]) {
                result = resultInfo;
            } else if ((this.getStatus() != null) && this.getStatus().isSuccess()) {
                // Conditions were passed successfully, continue the normal
                // processing.
                if (this.isNegotiated()) {
                    // Reset the list of variants, as the method differs.
                	this.getVariants().clear();
                    result = this.doNegotiatedHandle();
                } else {
                    result = this.doHandle();
                }
            }
        } else {
            if (this.isNegotiated()) {
                result = this.doNegotiatedHandle();
            } else {
                result = this.doHandle();
            }
        }

        return result;
    },

    doError: function(errorStatus) {
        this.setStatus(errorStatus);
        this.commit();
    },

    doGetInfo: function(variant) {
        if (variant != null) {
            if (variant instanceof VariantInfo) {
                doHandle(variant.getAnnotationInfo(),
                        variant);
            } else if (variant instanceof RepresentationInfo) {
            	//TODO :asynchronous
                result = variant;
            } else {
                getInfo(variant);
            }
        } else {
            var annotationInfo = this.getAnnotation([class Method].GET);

            if (annotationInfo != null) {
                this.doHandle(annotationInfo, null);
            } else {
                this.getInfo();
            }
        }

        return result;
    },

    doHandle: function() {
    	if (arguments.length==0) {
    		this._doHandleNoParam.apply(this, arguments);
    	} else if (arguments.length==1) {
    		this._doHandleOneParam.apply(this, arguments);
    	} else if (arguments.length==2) {
    		this._doHandleTwoParams.apply(this, arguments);
    	} else if (arguments.length==3) {
    		this._doHandleThreeParams.apply(this, arguments);
    	}
    },

    _doHandleNoParam: function() {
        var method = this.getMethod();

        if (method == null) {
            this.setStatus([class Status].CLIENT_ERROR_BAD_REQUEST, "No method specified");
        } else {
        	var currentThis = this;
            if (method.equals([class Method].PUT)) {
                this.put(this.getRequestEntity());
            } else if (this.isExisting()) {
                if (method.equals([class Method].GET)) {
                    this.get();
                } else if (method.equals([class Method].POST)) {
                    this.post(this.getRequestEntity());
                } else if (method.equals([class Method].DELETE)) {
                    this.delete();
                } else if (method.equals([class Method].HEAD)) {
                    this.head();
                } else if (method.equals([class Method].OPTIONS)) {
                    this.options();
                } else {
                    this.doHandle(method, this.getQuery(), this.getRequestEntity());
                }
            } else {
            	this.doError([class Status].CLIENT_ERROR_NOT_FOUND);
            }
        }
    },

    _doHandleTwoParams: function(annotationInfo, variant) {
        var result = null;
        var parameterNames = introspect(annotationInfo.getJavaScriptMethod());

    	var currentThis = this;

        // Invoke the annotated method and get the resulting object.
        var resultObject = null;
        try {
            if (parameterNames.length > 0) {
                var parameters = [];
                var parameter = null;

                for (var i=0; i<parameterNames.length; i++) {
                	var parameterName = parameterNames[i];
                    if (parameterName=="variant") {
                        parameters.add(variant);
                    } else if (parameterName=="representation") {
                        if (this.getRequestEntity() != null
                                && this.getRequestEntity().isAvailable()
                                && this.getRequestEntity().getSize() != 0) {
                            parameters.push(this.getRequestEntity());
                        }
                    } else {
                        if (this.getRequestEntity() != null
                                && this.getRequestEntity().isAvailable()
                                && this.getRequestEntity().getSize() != 0) {
                            // Assume there is content to be read.
                            // NB: it does not handle the case where the size is
                            // unknown, but there is no content.
                            parameter = this.toObject(this.getRequestEntity(),
                                    parameterType);

                            if (parameter == null) {
                                throw new Err(
                                        [class Status].CLIENT_ERROR_UNSUPPORTED_MEDIA_TYPE);
                            }
                        } else {
                            parameter = null;
                        }

                        parameters.push(parameter);
                    }
                }

                resultObject = annotationInfo.getJavaScriptMethod().call(this,
                        parameters);
            } else {
                resultObject = annotationInfo.getJavaScriptMethod().apply(this, commit);
            }
        } catch (err) {
        	console.log(err.stack);
            throw new Error(err);
        }
    },

    _doHandleThreeParams: function(method, query, entity) {
        var result = null;

        if (this.getAnnotation(method) != null) {
            // We know the method is supported, let's check the entity.
            var annotationInfo = this.getAnnotation(method, query, entity);

            if (annotationInfo != null) {
                this.doHandle(annotationInfo, null);
            } else {
                // The request entity is not supported.
                this.doError(Status.CLIENT_ERROR_UNSUPPORTED_MEDIA_TYPE);
            }
        } else {
        	this.doError(Status.CLIENT_ERROR_METHOD_NOT_ALLOWED);
        }
    },

    _doHandleOneParam: function(variant, end) {
        var result = null;
        var method = this.getMethod();

        if (method == null) {
            this.setStatus([class Status].CLIENT_ERROR_BAD_REQUEST, "No method specified");
        } else {
            if (method.equals([class Method].PUT)) {
                result = this.put(this.getRequestEntity(), variant);
            } else if (this.isExisting()) {
                if (method.equals([class Method].GET)) {
                    if (variant instanceof [class Representation]) {
                        variant;
                    } else {
                        this.get(variant);
                    }
                } else if (method.equals([class Method.]POST)) {
                    this.post(this.getRequestEntity(), variant);
                } else if (method.equals([class Method].DELETE)) {
                    this.delete(variant);
                } else if (method.equals([class Method].HEAD)) {
                    if (variant instanceof [class Representation]) {
                        this.commit(variant);
                    } else {
                        result = this.head(variant);
                    }
                } else if (method.equals([class Method].OPTIONS)) {
                    if (variant instanceof [class Representation]) {
                        this.commit(variant);
                    } else {
                        this.options(variant);
                    }
                } else if (variant instanceof [class VariantInfo]) {
                    doHandle(variant.getAnnotationInfo(), variant);
                } else {
                	this.doError([class Status].CLIENT_ERROR_METHOD_NOT_ALLOWED);
                }
            } else {
            	this.doError(Status.CLIENT_ERROR_NOT_FOUND);
            }
        }
    },

    doNegotiatedHandle: function() {
        var result = null;

        if ((this.getVariants() != null) && (!this.getVariants().isEmpty())) {
            var preferredVariant = this.getPreferredVariant(this.getVariants());

            if (preferredVariant == null) {
                this.response.setEntity(this.describeVariants());

                // No variant was found matching the client preferences
            	this.doError([class Status].CLIENT_ERROR_NOT_ACCEPTABLE);
            } else {
                // Update the variant dimensions used for content negotiation
            	this.updateDimensions();
                this.doHandle(preferredVariant);
            }
        } else {
            // No variant declared for this method.
            this.doHandle();
        }

        return result;
    },

    get: function() {
        var annotationInfo = null;
        var variant = null;
        if (arguments.length==0) {
        	annotationInfo = this.getAnnotation([class Method].GET);
        } else if (arguments.length==1) {
        	variant = arguments[0];
        	if (variant instanceof [class VariantInfo]) {
        		annotationInfo = variant.getAnnotationInfo();
        	}
        }

        if (annotationInfo != null) {
            this.doHandle(annotationInfo, variant);
        } else {
            this.doError([class Status].CLIENT_ERROR_METHOD_NOT_ALLOWED);
        }
    },

    getAnnotation: function(method, query, entity) {
    	if (query==null) {
    		query = this.getQuery();
    	}
        if (this.isAnnotated()) {
            return [class AnnotationUtils].getInstance().getAnnotation(
                    this.getAnnotations(), method, query, entity,
                    this.getMetadataService(), this.getConverterService());
        }

        return null;
    },

    getAnnotations: function() {
    	/*console.log("getAnnotations - annotations = "+AnnotationUtils.getInstance().getAnnotations(
                this.getClass()));*/
        return this.isAnnotated() ? AnnotationUtils.getInstance().getAnnotations(
                this.getClass()) : null;
    },

    getAttribute: function(name) {
        var value = this.getResponseAttributes().get(name);
        return (value == null) ? null : value.toString();
    },

    getInfo: function() {
   		this.get.call(this, arguments);
    },

    /*getOnSent: function() {
        return this.getResponse().getOnSent();
    },*/

    getPreferredVariant: function(variants) {
        var result = null;

        // If variants were found, select the best matching one
        if ((variants != null) && (!variants.isEmpty())) {
            result = this.getConnegService().getPreferredVariant(variants,
                    this.getRequest(), this.getMetadataService());
        }

        return result;
    },

    getVariants: function() {
    	var method = null;
    	if (arguments.length==0) {
    		method = this.getMethod();
    	} else {
    		method = arguments[0];
    	}

        var result = this.variants;

        if (result == null) {
            result = [];

            // Add annotation-based variants in priority
            if (this.isAnnotated() && this.hasAnnotations()) {
                var annoVariants = null;
                method = ([class Method].HEAD.equals(method)) ? [class Method].GET : method;

                var annotations = this.getAnnotations();
                for (var i=0; i<annotations.length; i++) {
                	var annotationInfo = annotations[i];
                    if (annotationInfo.isCompatible(method, this.getQuery(),
                    		this.getRequestEntity(), this.getMetadataService(),
                    		this.getConverterService())) {
                        annoVariants = annotationInfo.getResponseVariants(
                        		this.getMetadataService(), this.getConverterService());

                        if (annoVariants != null) {
                            // Compute an affinity score between this annotation
                            // and the input entity.
                            var score = 0.5;
                            if ((this.getRequest().getEntity() != null)
                                    && this.getRequest().getEntity().isAvailable()) {
                                var emt = this.getRequest().getEntity()
                                        .getMediaType();
                                var amts = this.getMetadataService()
                                        .getAllMediaTypes(
                                                annotationInfo.getInput());
                                if (amts != null) {
                                    for (var j=0; j<amts.length; j++) {
                                    	var amt = amts[j];
                                        if (amt.equals(emt)) {
                                            score = 1.0;
                                        } else if (amt.includes(emt)) {
                                            score = Math.max(0.8, score);
                                        } else if (amt.isCompatible(emt)) {
                                            score = Math.max(0.6, score);
                                        }
                                    }
                                }
                            }

                            for (var j=0; j<annoVariants.length; j++) {
                            	var v = annoVariants[j];
                                var vi = new VariantInfo(v,
                                        annotationInfo);
                                vi.setInputScore(score);
                                result.push(vi);
                            }
                        }
                        //var vi = new [class VariantInfo](null/*v*/,
                        //        annotationInfo);
                        //vi.setInputScore(1.0/*score*/);
                        //result.push(vi);
                    }
                }
            }

            this.variants = result;
        }

        return result;
    },

    postHandleProcessing: function(result) {
        if (result!=null && !this.getResponse().isEntityAvailable()) {
        	// If the user manually set the entity, keep it
        	this.getResponse().setEntity(result);
        }

        if ([class Status].CLIENT_ERROR_METHOD_NOT_ALLOWED.equals(this.getStatus())) {
        	this.updateAllowedMethods();
        } else if ([class Method].GET.equals(this.getMethod())
        		&& [class Status].SUCCESS_OK.equals(this.getStatus())
        		&& (this.getResponseEntity() == null || !this.getResponseEntity()
        				.isAvailable())) {
        	this.getLogger()
                .fine("A response with a 200 (Ok) status should have an entity. Changing the status to 204 (No content).");
        	this.setStatus([class Status].SUCCESS_NO_CONTENT);
        }
    },
    
    handle: function() {
        // If the resource is not available after initialization and if this a
        // retrieval method, then return a "not found" response.
        if (!this.isExisting() && this.getMethod().isSafe()) {
            this.doError([class Status].CLIENT_ERROR_NOT_FOUND);
        } else {
            try {
                if (this.isConditional()) {
                    this.doConditionalHandle();
                } else if (this.isNegotiated()) {
                    this.doNegotiatedHandle();
                } else {
                    this.doHandle();
                }
            } catch (err) {
            	this.doCatch(err);
            }
        }
    },

    hasAnnotations: function() {
        return (this.getAnnotations() != null) && (!this.getAnnotations().isEmpty());
    },

    head: function() {
    	if (arguments.length==0) {
    		this.get();
    	} else if (arguments.length==1) {
    		var variant = arguments[0];
            this.get(variant);
    	}
    },

    isAnnotated: function() {
        return this.annotated;
    },

    isAutoCommitting: function() {
        return this.getResponse().isAutoCommitting();
    },

    isCommitted: function() {
        return this.getResponse().isCommitted();
    },

    isConditional: function() {
        return this.conditional;
    },

    isExisting: function() {
        return this.existing;
    },

    isInRole: function(roleName) {
        return this.getClientInfo().getRoles().contains(
        		this.getApplication().getRole(roleName));
    },

    isNegotiated: function() {
        return this.negotiated;
    },

    options: function() {
        var annotationInfo = null;
        var variant = null;
        if (arguments.length==0) {
        	annotationInfo = getAnnotation([class Method].OPTIONS);
        } else if (arguments.length==1) {
        	variant = arguments[0];
        	if (variant instanceof [class VariantInfo]) {
        		annotationInfo = variant.getAnnotationInfo();
        	}
        }

        // Updates the list of allowed methods
        this.updateAllowedMethods();

        if (annotationInfo != null) {
            this.doHandle(annotationInfo, variant);
        } else {
        	this.doError([class Status].CLIENT_ERROR_METHOD_NOT_ALLOWED);
        }
    },

    post: function(entity, variant) {
        if (variant==null) {
            this.doHandle([class Method].POST, this.getQuery(), entity);
        } else {
        	if (variant instanceof [class VariantInfo]) {
        		this.doHandle(variant.getAnnotationInfo(),
        				variant);
        	} else {
        		this.doError([class Status].CLIENT_ERROR_METHOD_NOT_ALLOWED);
        	}
        }
    },

    put: function(representation, variant) {
        if (variant==null) {
            this.doHandle([class Method].PUT, this.getQuery(), entity);
        } else {
        	if (variant instanceof [class VariantInfo]) {
        		this.doHandle(variant.getAnnotationInfo(),
        				variant);
        	} else {
        		this.doError([class Status].CLIENT_ERROR_METHOD_NOT_ALLOWED);
        	}
        }
    },

    redirectPermanent: function(target) {
        if (this.getResponse() != null) {
        	this.getResponse().redirectPermanent(target);
        }
    },

    redirectSeeOther: function(target) {
        if (this.getResponse() != null) {
        	this.getResponse().redirectSeeOther(target);
        }
    },

    redirectTemporary: function(target) {
        if (this.getResponse() != null) {
        	this.getResponse().redirectTemporary(target);
        }
    },

    setAllowedMethods: function(allowedMethods) {
        if (this.getResponse() != null) {
        	this.getResponse().setAllowedMethods(allowedMethods);
        }
    },

    setAnnotated: function(annotated) {
        this.annotated = annotated;
    },

    setAttribute: function(name, value) {
    	this.getResponseAttributes()[name] = value;
    },

    setAutoCommitting: function(autoCommitting) {
    	this.getResponse().setAutoCommitting(autoCommitting);
    },

    setChallengeRequests: function(requests) {
        if (this.getResponse() != null) {
        	this.getResponse().setChallengeRequests(requests);
        }
    },

    setCommitted: function(committed) {
    	this.getResponse().setCommitted(committed);
    },

    setConditional: function(conditional) {
        this.conditional = conditional;
    },

    setCookieSettings: function(cookieSettings) {
        if (this.getResponse() != null) {
        	this.getResponse().setCookieSettings(cookieSettings);
        }
    },

    setDimensions: function(dimensions) {
        if (this.getResponse() != null) {
        	this.getResponse().setDimensions(dimensions);
        }
    },

    setExisting: function(exists) {
        this.existing = exists;
    },

    setLocationRef: function(location) {
        if (this.getResponse() != null) {
            this.getResponse().setLocationRef(location);
        }
    },

    setNegotiated: function(negotiateContent) {
        this.negotiated = negotiateContent;
    },

    setOnSent: function(onSentCallback) {
    	this.getResponse().setOnSent(onSentCallback);
    },

    setProxyChallengeRequests: function(requests) {
        if (this.getResponse() != null) {
        	this.getResponse().setProxyChallengeRequests(requests);
        }
    },

    setServerInfo: function(serverInfo) {
        if (this.getResponse() != null) {
        	this.getResponse().setServerInfo(serverInfo);
        }
    },

    setStatus: function() {
        if (this.getResponse() != null) {
            this.getResponse().setStatus.apply(this.getResponse(), arguments);
        }
    },

    updateAllowedMethods: function() {
        this.getAllowedMethods().clear();
        var annotations = this.getAnnotations();

        if (annotations != null) {
            for (var i=0; i<annotations.length;i++) {
            	var annotationInfo = annotations[i];
                if (!this.getAllowedMethods().contains(
                        annotationInfo.getRestletMethod())) {
                    this.getAllowedMethods().add(annotationInfo.getRestletMethod());
                }
            }
        }
    },

    updateDimensions: function() {
        this.getDimensions().add([class Dimension].CHARACTER_SET);
        this.getDimensions().add([class Dimension].ENCODING);
        this.getDimensions().add([class Dimension].LANGUAGE);
        this.getDimensions().add([class Dimension].MEDIA_TYPE);
    }
});

ServerResource.extend({
	createSubServerResource: function() {
		var subServerResource = new [class Class](ServerResource, {
			initialize: function() {
				this.callSuperCstr();
			}
		});
		subServerResource._getInternalMethodName = function(method) {
	    	var prefix = "handle"+method.toLowerCase().firstUpper();
	    	var index = 0;
	    	for (var elt in this.prototype) {
	    		if (typeof this.prototype[elt] == "function" && elt.startsWith(prefix)) {
	    			var methodIndex = parseInt(elt.replace(prefix, ""));
	    			if (methodIndex>=index) {
	    				index = methodIndex +1;
	    			}
	    		}
	    	}
	    	return prefix+index;
	    };
		subServerResource.addMethod = function(method, parameters, fn) {
	    	if (typeof method == "string") {
	    		method = [class Method].valueOf(method.toUpperCase());
	    	}
	    	if (typeof parameters == "string") {
	    		parameters = { extension: parameters };
	    	}
	    	parameters["method"] = method;
	    	fn["metadata"] = parameters;
	    	this.prototype[this._getInternalMethodName(method.getName())] = fn;
	    };
	    return subServerResource;
	}
});