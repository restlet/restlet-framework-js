var CallResolver = new [class Class]([class Resolver], {
    initialize: function(request, response) {
        this.request = request;
        this.response = response;
    },

    getReferenceContent: function(partName, reference) {
        var result = null;

        if (reference != null) {
            if (partName.equals("a")) {
                result = reference.getAuthority();
            } else if (partName.startsWith("b")) {
                result = getReferenceContent(partName.substring(1), reference
                        .getBaseRef());
            } else if (partName.equals("e")) {
                result = reference.getRelativePart();
            } else if (partName.equals("f")) {
                result = reference.getFragment();
            } else if (partName.equals("h")) {
                result = reference.getHostIdentifier();
            } else if (partName.equals("i")) {
                result = reference.getIdentifier();
            } else if (partName.equals("p")) {
                result = reference.getPath();
            } else if (partName.equals("q")) {
                result = reference.getQuery();
            } else if (partName.equals("r")) {
                result = reference.getRemainingPart();
            }
        }

        return result;
    },

    resolve: function(variableName) {
        var result = null;

        // Check for a matching response attribute
        if (this.response != null
                && this.response.getAttributes().containsKey(variableName)) {
            result = this.response.getAttributes().get(variableName);
        }

        // Check for a matching request attribute
        if ((result == null) && (this.request != null)
                && this.request.getAttributes().containsKey(variableName)) {
            result = this.request.getAttributes().get(variableName);
        }

        // Check for a matching request or response property
        if (result == null) {
            if (this.request != null) {
                if (variableName.equals("c")) {
                    result = Boolean.toString(this.request.isConfidential());
                } else if (variableName.equals("cia")) {
                    result = this.request.getClientInfo().getAddress();
                } else if (variableName.equals("ciua")) {
                    result = this.request.getClientInfo().getUpstreamAddress();
                } else if (variableName.equals("cig")) {
                    result = this.request.getClientInfo().getAgent();
                } else if (variableName.equals("cri")) {
                    var cr = this.request.getChallengeResponse();
                    if (cr != null) {
                        result = cr.getIdentifier();
                    }
                } else if (variableName.equals("crs")) {
                    var cr = this.request.getChallengeResponse();
                    if (cr != null && cr.getScheme() != null) {
                        result = cr.getScheme().getTechnicalName();
                    }
                } else if (variableName.equals("d")) {
                    result = [class DateUtils].format(new Date(),
                    		[class DateUtils].FORMAT_RFC_1123.get(0));
                } else if (variableName.equals("ecs")) {
                    if ((this.request.getEntity() != null)
                            && (this.request.getEntity().getCharacterSet() != null)) {
                        result = this.request.getEntity().getCharacterSet()
                                .getName();
                    }
                } else if (variableName.equals("ee")) {
                    if ((this.request.getEntity() != null)
                            && (!this.request.getEntity().getEncodings()
                                    .isEmpty())) {
                        var value = new [class StringBuilder]();
                        for (var i = 0; i < this.request.getEntity()
                                .getEncodings().size(); i++) {
                            if (i > 0) {
                                value.append(", ");
                            }
                            value.append(this.request.getEntity()
                                    .getEncodings().get(i).getName());
                        }
                        result = value.toString();
                    }
                } else if (variableName.equals("eed")) {
                    if ((this.request.getEntity() != null)
                            && (this.request.getEntity().getExpirationDate() != null)) {
                        result = DateUtils.format(this.request.getEntity()
                                .getExpirationDate(), DateUtils.FORMAT_RFC_1123
                                .get(0));
                    }
                } else if (variableName.equals("el")) {
                    if ((this.request.getEntity() != null)
                            && (!this.request.getEntity().getLanguages()
                                    .isEmpty())) {
                        var value = new [class StringBuilder]();
                        for (var i = 0; i < this.request.getEntity()
                                .getLanguages().size(); i++) {
                            if (i > 0) {
                                value.append(", ");
                            }
                            value.append(this.request.getEntity()
                                    .getLanguages().get(i).getName());
                        }
                        result = value.toString();
                    }
                } else if (variableName.equals("emd")) {
                    if ((this.request.getEntity() != null)
                            && (this.request.getEntity().getModificationDate() != null)) {
                        result = [class DateUtils].format(this.request.getEntity()
                                .getModificationDate(),
                                [class DateUtils].FORMAT_RFC_1123.get(0));
                    }
                } else if (variableName.equals("emt")) {
                    if ((this.request.getEntity() != null)
                            && (this.request.getEntity().getMediaType() != null)) {
                        result = this.request.getEntity().getMediaType()
                                .getName();
                    }
                } else if (variableName.equals("es")) {
                    if ((this.request.getEntity() != null)
                            && (this.request.getEntity().getSize() != -1)) {
                        result = Long.toString(this.request.getEntity()
                                .getSize());
                    }
                } else if (variableName.equals("et")) {
                    if ((this.request.getEntity() != null)
                            && (this.request.getEntity().getTag() != null)) {
                        result = this.request.getEntity().getTag().getName();
                    }
                } else if (variableName.startsWith("f")) {
                    result = getReferenceContent(variableName.substring(1),
                            this.request.getReferrerRef());
                } else if (variableName.startsWith("h")) {
                    result = getReferenceContent(variableName.substring(1),
                            this.request.getHostRef());
                } else if (variableName.equals("m")) {
                    if (this.request.getMethod() != null) {
                        result = this.request.getMethod().getName();
                    }
                } else if (variableName.startsWith("o")) {
                    result = getReferenceContent(variableName.substring(1),
                            this.request.getRootRef());
                } else if (variableName.equals("p")) {
                    if (this.request.getProtocol() != null) {
                        result = this.request.getProtocol().getName();
                    }
                } else if (variableName.startsWith("r")) {
                    result = getReferenceContent(variableName.substring(1),
                            this.request.getResourceRef());
                }
            }

            if ((result == null) && (this.response != null)) {
                if (variableName.equals("ECS")) {
                    if ((this.response.getEntity() != null)
                            && (this.response.getEntity().getCharacterSet() != null)) {
                        result = this.response.getEntity().getCharacterSet()
                                .getName();
                    }
                } else if (variableName.equals("EE")) {
                    if ((this.response.getEntity() != null)
                            && (!this.response.getEntity().getEncodings()
                                    .isEmpty())) {
                        var value = new [class StringBuilder]();
                        for (var i = 0; i < this.response.getEntity()
                                .getEncodings().size(); i++) {
                            if (i > 0) {
                                value.append(", ");
                            }
                            value.append(this.response.getEntity()
                                    .getEncodings().get(i).getName());
                        }
                        result = value.toString();
                    }
                } else if (variableName.equals("EED")) {
                    if ((this.response.getEntity() != null)
                            && (this.response.getEntity().getExpirationDate() != null)) {
                        result = [class DateUtils].format(this.response.getEntity()
                                .getExpirationDate(), [class DateUtils].FORMAT_RFC_1123
                                .get(0));
                    }
                } else if (variableName.equals("EL")) {
                    if ((this.response.getEntity() != null)
                            && (!this.response.getEntity().getLanguages()
                                    .isEmpty())) {
                        var value = new [class StringBuilder]();
                        for (var i = 0; i < this.response.getEntity()
                                .getLanguages().size(); i++) {
                            if (i > 0) {
                                value.append(", ");
                            }
                            value.append(this.response.getEntity()
                                    .getLanguages().get(i).getName());
                        }
                        result = value.toString();
                    }
                } else if (variableName.equals("EMD")) {
                    if ((this.response.getEntity() != null)
                            && (this.response.getEntity().getModificationDate() != null)) {
                        result = [class DateUtils].format(this.response.getEntity()
                                .getModificationDate(),
                                [class DateUtils].FORMAT_RFC_1123.get(0));
                    }
                } else if (variableName.equals("EMT")) {
                    if ((this.response.getEntity() != null)
                            && (this.response.getEntity().getMediaType() != null)) {
                        result = this.response.getEntity().getMediaType()
                                .getName();
                    }
                } else if (variableName.equals("ES")) {
                    if ((this.response.getEntity() != null)
                            && (this.response.getEntity().getSize() != -1)) {
                        result = Long.toString(this.response.getEntity()
                                .getSize());
                    }
                } else if (variableName.equals("ET")) {
                    if ((this.response.getEntity() != null)
                            && (this.response.getEntity().getTag() != null)) {
                        result = this.response.getEntity().getTag().getName();
                    }
                } else if (variableName.startsWith("R")) {
                    result = getReferenceContent(variableName.substring(1),
                            this.response.getLocationRef());
                } else if (variableName.equals("S")) {
                    if (this.response.getStatus() != null) {
                        result = Integer.toString(this.response.getStatus()
                                .getCode());
                    }
                } else if (variableName.equals("SIA")) {
                    result = this.response.getServerInfo().getAddress();
                } else if (variableName.equals("SIG")) {
                    result = this.response.getServerInfo().getAgent();
                } else if (variableName.equals("SIP")) {
                    if (this.response.getServerInfo().getPort() != -1) {
                        result = Integer.toString(this.response.getServerInfo()
                                .getPort());
                    }
                }
            }
        }

        return result;
    }
});