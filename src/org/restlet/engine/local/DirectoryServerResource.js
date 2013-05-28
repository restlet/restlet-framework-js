var DirectoryServerResource = new [class Class]([class ServerResource], {
    delete: function() {
        if (this.directory.isModifiable()) {
            var contextRequest = new [class Request]([class Method].DELETE, this.targetUri);
            var contextResponse = new [class Response](contextRequest);

            if (this.directoryTarget && !this.indexTarget) {
                contextRequest.setResourceRef(this.targetUri);
                this.getClientDispatcher().handle(contextRequest, contextResponse);
            } else {
                // Check if there is only one representation
                // Try to get the unique representation of the resource
                var references = this.getVariantsReferences();
                if (!references.isEmpty()) {
                    if (this.uniqueReference != null) {
                        contextRequest.setResourceRef(this.uniqueReference);
                        this.getClientDispatcher().handle(contextRequest,
                                contextResponse);
                    } else {
                        // We found variants, but not the right one
                        contextResponse
                                .setStatus(new [class Status](
                                		[class Status].CLIENT_ERROR_NOT_ACCEPTABLE,
                                        "Unable to process properly the request. Several variants exist but none of them suits precisely. "));
                    }
                } else {
                    contextResponse.setStatus([class Status].CLIENT_ERROR_NOT_FOUND);
                }
            }

            this.setStatus(contextResponse.getStatus());
        } else {
            this.setStatus([class Status].CLIENT_ERROR_METHOD_NOT_ALLOWED,
                    "The directory is not modifiable.");
        }

        return null;
    },

    doInit: function() {
        try {
            // Update the member variables
            this.directory = this.getRequestAttributes().get(
                    "org.restlet.directory");
            this.relativePart = this.getReference().getRemainingPart(false, false);
            this.setNegotiated(this.directory.isNegotiatingContent());

            // Restore the original URI in case the call has been tunneled.
            if ((this.getApplication() != null)
                    && this.getApplication().getTunnelService().isExtensionsTunnel()) {
                this.originalRef = getOriginalRef();

                if (this.originalRef != null) {
                    this.originalRef.setBaseRef(this.getReference().getBaseRef());
                    this.relativePart = this.originalRef.getRemainingPart();
                }
            }

            if (this.relativePart.startsWith("/")) {
                // We enforce the leading slash on the root URI
                this.relativePart = this.relativePart.substring(1);
            }

            // The target URI does not take into account the query and fragment
            // parts of the resource.
            this.targetUri = new [class Reference](directory.getRootRef().toString()
                    + this.relativePart).normalize().toString(false, false);
            if (!this.targetUri.startsWith(directory.getRootRef().toString())) {
                // Prevent the client from accessing resources in upper
                // directories
                this.targetUri = directory.getRootRef().toString();
            }

            if (this.getClientDispatcher() == null) {
                this.getLogger().warning(
                        "No client dispatcher is available on the context. Can't get the target URI: "
                                + this.targetUri);
            } else {
                // Try to detect the presence of a directory
                var contextResponse = this.getRepresentation(this.targetUri);

                if (contextResponse.getEntity() != null) {
                    // As a convention, underlying client connectors return the
                    // directory listing with the media-type
                    // "MediaType.TEXT_URI_LIST" when handling directories
                    if ([class MediaType].TEXT_URI_LIST.equals(contextResponse
                            .getEntity().getMediaType())) {
                        this.directoryTarget = true;
                        this.fileTarget = false;
                        this.directoryContent = new [class ReferenceList](
                                contextResponse.getEntity());

                        if (!this.getReference().getPath().endsWith("/")) {
                            // All requests will be automatically redirected
                            this.directoryRedirection = true;
                        }

                        if (!this.targetUri.endsWith("/")) {
                            this.targetUri += "/";
                            this.relativePart += "/";
                        }

                        // Append the index name
                        if ((this.getDirectory().getIndexName() != null)
                                && (this.getDirectory().getIndexName().length > 0)) {
                            this.directoryUri = this.targetUri;
                            this.baseName = this.getDirectory().getIndexName();
                            this.targetUri = this.directoryUri + this.baseName;
                            this.indexTarget = true;
                        } else {
                            this.directoryUri = this.targetUri;
                            this.baseName = null;
                        }
                    } else {
                        // Allows underlying helpers that do not support
                        // "content negotiation" to return the targeted file.
                        // Sometimes we immediately reach the target entity, so
                        // we return it directly.
                        this.directoryTarget = false;
                        this.fileTarget = true;
                        this.fileContent = contextResponse.getEntity();
                    }
                } else {
                    this.directoryTarget = false;
                    this.fileTarget = false;

                    // Let's try with the optional index, in case the underlying
                    // client connector does not handle directory listing.
                    if (this.targetUri.endsWith("/")) {
                        // In this case, the trailing "/" shows that the URI
                        // must point to a directory
                        if ((this.getDirectory().getIndexName() != null)
                                && (this.getDirectory().getIndexName().length > 0)) {
                            this.directoryUri = this.targetUri;
                            this.directoryTarget = true;

                            contextResponse = this.getRepresentation(this.directoryUri
                                    + getDirectory().getIndexName());
                            if (contextResponse.getEntity() != null) {
                                this.baseName = this.getDirectory().getIndexName();
                                this.targetUri = this.directoryUri
                                        + this.baseName;
                                this.directoryContent = new [class ReferenceList]();
                                this.directoryContent.add(new [class Reference](
                                        this.targetUri));
                                this.indexTarget = true;
                            }
                        }
                    } else {
                        // Try to determine if this target URI with no trailing
                        // "/" is a directory, in order to force the
                        // redirection.
                        if ((this.getDirectory().getIndexName() != null)
                                && (this.getDirectory().getIndexName().length > 0)) {
                            // Append the index name
                            contextResponse = this.getRepresentation(this.targetUri
                                    + "/" + getDirectory().getIndexName());
                            if (contextResponse.getEntity() != null) {
                                this.directoryUri = this.targetUri + "/";
                                this.baseName = this.getDirectory().getIndexName();
                                this.targetUri = this.directoryUri
                                        + this.baseName;
                                this.directoryTarget = true;
                                this.directoryRedirection = true;
                                this.directoryContent = new [class ReferenceList]();
                                this.directoryContent.add(new [class Reference](
                                        this.targetUri));
                                this.indexTarget = true;
                            }
                        }
                    }
                }

                // In case the request does not target a directory and the file
                // has not been found, try with the tunneled URI.
                if (this.isNegotiated() && !this.directoryTarget && !this.fileTarget
                        && (this.originalRef != null)) {
                    this.relativePart = this.getReference().getRemainingPart();

                    // The target URI does not take into account the query and
                    // fragment parts of the resource.
                    this.targetUri = new [class Reference](directory.getRootRef()
                            .toString() + this.relativePart).normalize()
                            .toString(false, false);
                    if (!this.targetUri.startsWith(directory.getRootRef()
                            .toString())) {
                        // Prevent the client from accessing resources in upper
                        // directories
                        this.targetUri = directory.getRootRef().toString();
                    }
                }

                if (!fileTarget || (fileContent == null)
                        || !this.getRequest().getMethod().isSafe()) {
                    // Try to get the directory content, in case the request
                    // does not target a directory
                    if (!this.directoryTarget) {
                        var lastSlashIndex = this.targetUri.lastIndexOf('/');
                        if (lastSlashIndex == -1) {
                            this.directoryUri = "";
                            this.baseName = this.targetUri;
                        } else {
                            this.directoryUri = this.targetUri.substring(0,
                                    lastSlashIndex + 1);
                            this.baseName = this.targetUri
                                    .substring(lastSlashIndex + 1);
                        }

                        contextResponse = this.getRepresentation(this.directoryUri);
                        if ((contextResponse.getEntity() != null)
                                && [class MediaType].TEXT_URI_LIST
                                        .equals(contextResponse.getEntity()
                                                .getMediaType())) {
                            this.directoryContent = new [class ReferenceList](
                                    contextResponse.getEntity());
                        }
                    }

                    if (this.baseName != null) {
                        // Analyze extensions
                        this.baseVariant = new Variant();
                        [class Entity].updateMetadata(this.baseName, this.baseVariant,
                                true, this.getMetadataService());
                        this.protoVariant = new Variant();
                        [class Entity].updateMetadata(this.baseName, this.protoVariant,
                                false, this.getMetadataService());

                        // Remove stored extensions from the base name
                        this.baseName = [class Entity].getBaseName(this.baseName,
                                this.getMetadataService());
                    }

                    // Check if the resource exists or not.
                    var variants = this.getVariants([class Method].GET);
                    if ((variants == null) || (variants.isEmpty())) {
                        this.setExisting(false);
                    }
                }

                // Check if the resource is located in a sub directory.
                if (this.isExisting() && !this.directory.isDeeplyAccessible()) {
                    // Count the number of "/" character.
                    var index = this.relativePart.indexOf("/");
                    if (index != -1) {
                        index = this.relativePart.indexOf("/", index);
                        this.setExisting((index == -1));
                    }
                }
            }

            // Log results
            this.getLogger().fine("Converted target URI: " + this.targetUri);
            this.getLogger().fine("Converted base name : " + this.baseName);
        } catch (err) {
            throw new Error(err.message);
        }
    },

    get: function() {
        // Content negotiation has been disabled
        // The variant that may need to meet the request conditions
        var result = null;

        varvariants = this.getVariants([class Method].GET);
        if ((variants == null) || (variants.isEmpty())) {
            // Resource not found
            this.getResponse().setStatus([class Status].CLIENT_ERROR_NOT_FOUND);
        } else {
            if (variants.size() == 1) {
                result = variants.get(0);
            } else {
                var variantRefs = new [class ReferenceList]();

                for (Variant variant : variants) {
                    if (variant.getLocationRef() != null) {
                        variantRefs.add(variant.getLocationRef());
                    } else {
                        this.getLogger()
                                .warning(
                                        "A resource with multiple variants should provide a location for each variant when content negotiation is turned off");
                    }
                }

                if (variantRefs.size() > 0) {
                    // Return the list of variants
                    this.setStatus([class Status].REDIRECTION_MULTIPLE_CHOICES);
                    result = variantRefs.getTextRepresentation();
                } else {
                    this.setStatus([class Status].CLIENT_ERROR_NOT_FOUND);
                }
            }
        }

        return result;
    },

    getBaseName: function() {
        return this.baseName;
    },

    getClientDispatcher: function() {
        return this.getDirectory().getContext() == null ? null : this.getDirectory()
                .getContext().getClientDispatcher();
    },

    getDirectory: function() {
        return this.directory;
    },

    getDirectoryContent: function() {
        return directoryContent;
    },

    getDirectoryUri: function() {
        return this.directoryUri;
    },

    getRepresentation: function(resourceUri) {
        return this.getClientDispatcher().handle(
                new [class Request]([class Method].GET, resourceUri));
    },

    getRepresentation: function(resourceUri, acceptedMediaType) {
        if (acceptedMediaType == null) {
            return this.getClientDispatcher().handle(
                    new [class Request]([class Method].GET, resourceUri));
        }

        var request = new [class Request]([class Method].GET, resourceUri);
        request.getClientInfo().getAcceptedMediaTypes()
                .add(new [class Preference](acceptedMediaType));
        return this.getClientDispatcher().handle(request);
    },

    /*private Comparator<Representation> getRepresentationsComparator() {
        // Sort the list of representations by their identifier.
        Comparator<Representation> identifiersComparator = new Comparator<Representation>() {
            public int compare(Representation rep0, Representation rep1) {
                boolean bRep0Null = (rep0.getLocationRef() == null);
                boolean bRep1Null = (rep1.getLocationRef() == null);

                if (bRep0Null && bRep1Null) {
                    return 0;
                }
                if (bRep0Null) {
                    return -1;
                }

                if (bRep1Null) {
                    return 1;
                }

                return rep0.getLocationRef().getLastSegment()
                        .compareTo(rep1.getLocationRef().getLastSegment());
            }
        };
        return identifiersComparator;
    },*/

    getTargetUri: function() {
        return this.targetUri;
    },

    getVariants: function(method) {
    	if (method==null) {
    		method = this.getMethod();
    	}
        var result = null;

        if (([class Method].GET.equals(method) || [class Method].HEAD.equals(method))) {
            if (variantsGet != null) {
                result = variantsGet;
            } else {
                this.getLogger().fine("Getting variants for: " + getTargetUri());

                if ((this.directoryContent != null) && (this.getReference() != null)
                        && (this.getReference().getBaseRef() != null)) {

                    // Allows to sort the list of representations
                	//TODO: handle sorting
                    var resultSet = new TreeSet<Representation>(
                            getRepresentationsComparator());

                    // Compute the base reference (from a call's client point of
                    // view)
                    var baseRef = this.getReference().getBaseRef().toString(
                            false, false);

                    if (!baseRef.endsWith("/")) {
                        baseRef += "/";
                    }

                    var lastIndex = this.relativePart.lastIndexOf("/");

                    if (lastIndex != -1) {
                        baseRef += this.relativePart.substring(0, lastIndex);
                    }

                    var rootLength = this.getDirectoryUri().length;

                    if (this.baseName != null) {
                        var filePath;
                        var references = this.getVariantsReferences();
                        for (var i=0; i<references.length;i++) {
                        	var ref = references[i];
                            // Add the new variant to the result list
                            var contextResponse = this.getRepresentation(ref
                                    .toString());
                            if (contextResponse.getStatus().isSuccess()
                                    && (contextResponse.getEntity() != null)) {
                                filePath = ref.toString(false, false)
                                        .substring(rootLength);
                                var rep = contextResponse
                                        .getEntity();

                                if (filePath.startsWith("/")) {
                                    rep.setLocationRef(baseRef + filePath);
                                } else {
                                    rep.setLocationRef(baseRef + "/" + filePath);
                                }

                                resultSet.add(rep);
                            }
                        }
                    }

                    if (!resultSet.isEmpty()) {
                        result = [];
                        result.addAll(resultSet);
                    }

                    if (resultSet.isEmpty()) {
                        if (this.directoryTarget
                                && this.getDirectory().isListingAllowed()) {
                            var userList = new [class ReferenceList](
                                    this.directoryContent.size());
                            // Set the list identifier
                            userList.setIdentifier(baseRef);

                        	//TODO: handle sorting
                            SortedSet<Reference> sortedSet = new TreeSet<Reference>(
                                    getDirectory().getComparator());
                            sortedSet.addAll(this.directoryContent);

                            for (Reference ref : sortedSet) {
                                String filePart = ref.toString(false, false)
                                        .substring(rootLength);
                                StringBuilder filePath = new StringBuilder();
                                if ((!baseRef.endsWith("/"))
                                        && (!filePart.startsWith("/"))) {
                                    filePath.append('/');
                                }
                                filePath.append(filePart);
                                userList.add(baseRef + filePath);
                            }
                            List<Variant> list = getDirectory()
                                    .getIndexVariants(userList);
                            for (Variant variant : list) {
                                if (result == null) {
                                    result = new ArrayList<Variant>();
                                }

                                result.add(getDirectory()
                                        .getIndexRepresentation(variant,
                                                userList));
                            }

                        }
                    }
                } else if (this.fileTarget && (this.fileContent != null)) {
                    // Sets the location of the target representation.
                    if (getOriginalRef() != null) {
                        this.fileContent.setLocationRef(getRequest()
                                .getOriginalRef());
                    } else {
                        this.fileContent.setLocationRef(getReference());
                    }

                    result = new ArrayList<Variant>();
                    result.add(this.fileContent);
                }

                this.variantsGet = result;
            }
        }

        return result;
    },

    getVariantsReferences: function() {
        var result = new [class ReferenceList](0);

        try {
            this.uniqueReference = null;

            // Ask for the list of all variants of this resource
            var contextResponse = this.getRepresentation(this.targetUri,
                    [class MediaType].TEXT_URI_LIST);
            if (contextResponse.getEntity() != null) {
                // Test if the given response is the list of all variants for
                // this resource
                if ([class MediaType].TEXT_URI_LIST.equals(contextResponse.getEntity()
                        .getMediaType())) {
                    var listVariants = new [class ReferenceList](
                            contextResponse.getEntity());
                    var entryUri;
                    var fullEntryName;
                    var baseEntryName;
                    var lastSlashIndex;
                    var firstDotIndex;

                    for (var i=0; i<listVariants.length; i++) {
                    	var ref = listVariants[i];
                        entryUri = ref.toString();
                        lastSlashIndex = entryUri.lastIndexOf('/');
                        fullEntryName = (lastSlashIndex == -1) ? entryUri
                                : entryUri.substring(lastSlashIndex + 1);
                        baseEntryName = fullEntryName;

                        // Remove the extensions from the base name
                        firstDotIndex = fullEntryName.indexOf('.');
                        if (firstDotIndex != -1) {
                            baseEntryName = fullEntryName.substring(0,
                                    firstDotIndex);
                        }

                        // Check if the current file is a valid variant
                        if (baseEntryName.equals(this.baseName)) {
                            // Test if the variant is included in the base
                            // prototype variant
                            var variant = new [class Variant]();
                            [class Entity].updateMetadata(fullEntryName, variant, true,
                                    this.getMetadataService());
                            if (this.protoVariant.includes(variant)) {
                                result.add(ref);
                            }

                            // Test if the variant is equal to the base variant
                            if (this.baseVariant.equals(variant)) {
                                // The unique reference has been found.
                                this.uniqueReference = ref;
                            }
                        }
                    }
                } else {
                    result.add(contextResponse.getEntity().getLocationRef());
                }
            }
        } catch (er) {
            this.getLogger().log([class Level].WARNING, "Unable to get resource variants",
                    ioe);
        }

        return result;
    },

    handle: function() {
        var result = null;

        if (this.directoryRedirection) {
            if (this.originalRef != null) {
                if (this.originalRef.hasQuery()) {
                    this.redirectSeeOther(this.originalRef.getPath() + "/?"
                            + this.originalRef.getQuery());
                } else {
                    this.redirectSeeOther(this.originalRef.getPath() + "/");
                }
            } else {
                if (this.getReference().hasQuery()) {
                	this.redirectSeeOther(this.getReference().getPath() + "/?"
                            + this.getReference().getQuery());
                } else {
                	this.redirectSeeOther(this.getReference().getPath() + "/");
                }
            }
        } else {
            result = this.callSuper("handle");
        }

        return result;
    },

    isDirectoryTarget: function() {
        return this.directoryTarget;
    },

    isFileTarget: function() {
        return this.fileTarget;
    },

    put: function(entity) {
        if (this.directory.isModifiable()) {
            // Transfer of PUT calls is only allowed if the readOnly flag is
            // not set.
            var contextRequest = new [class Request]([class Method].PUT, this.targetUri);

            // Add support of partial PUT calls.
            contextRequest.getRanges().addAll(getRanges());
            contextRequest.setEntity(entity);
            var contextResponse = new [class Response](contextRequest);
            contextRequest.setResourceRef(this.targetUri);
            this.getClientDispatcher().handle(contextRequest, contextResponse);
            this.setStatus(contextResponse.getStatus());
        } else {
        	this.setStatus([class Status].CLIENT_ERROR_METHOD_NOT_ALLOWED,
                    "The directory is not modifiable.");
        }

        return null;
    },

    setTargetUri: function(targetUri) {
        this.targetUri = targetUri;
    }
});