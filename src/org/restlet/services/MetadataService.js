var MetadataService = new [class Class](Service, {
    initialize: function() {
        this.defaultCharacterSet = [class CharacterSet].DEFAULT;
        this.defaultEncoding = [class Encoding].IDENTITY;
        this.defaultLanguage = [class Language].DEFAULT;
        // [ifndef gwt] instruction
        this.defaultMediaType = [class MediaType].APPLICATION_OCTET_STREAM;
        // [ifdef gwt] instruction uncomment
        // this.defaultMediaType = [class MediaType].APPLICATION_JSON;
        this.mappings = [];
        this.addCommonExtensions();
    },

    addCommonExtensions: function() {
        var dm = [];

        this.ext(dm, "en", [class Language].ENGLISH);
        this.ext(dm, "es", [class Language].SPANISH);
        this.ext(dm, "fr", [class Language].FRENCH);

        // [ifndef gwt]
        this.ext(dm, "ascii", [class CharacterSet].US_ASCII);

        this.ext(dm, "ai", [class MediaType].APPLICATION_POSTSCRIPT);
        this.ext(dm, "atom", [class MediaType].APPLICATION_ATOM);
        this.ext(dm, "atomcat", [class MediaType].APPLICATION_ATOMPUB_CATEGORY);
        this.ext(dm, "atomsvc", [class MediaType].APPLICATION_ATOMPUB_SERVICE);
        this.ext(dm, "au", [class MediaType].AUDIO_BASIC);
        this.ext(dm, "bin", [class MediaType].APPLICATION_OCTET_STREAM);
        this.ext(dm, "bmp", [class MediaType].IMAGE_BMP);
        this.ext(dm, "class", [class MediaType].APPLICATION_JAVA);
        this.ext(dm, "css", [class MediaType].TEXT_CSS);
        this.ext(dm, "csv", [class MediaType].TEXT_CSV);
        this.ext(dm, "dat", [class MediaType].TEXT_DAT);
        this.ext(dm, "dib", [class MediaType].IMAGE_BMP);
        this.ext(dm, "doc", [class MediaType].APPLICATION_WORD);
        this.ext(dm, "docm", [class MediaType].APPLICATION_MSOFFICE_DOCM);
        this.ext(dm, "docx", [class MediaType].APPLICATION_MSOFFICE_DOCX);
        this.ext(dm, "dotm", [class MediaType].APPLICATION_MSOFFICE_DOTM);
        this.ext(dm, "dotx", [class MediaType].APPLICATION_MSOFFICE_DOTX);
        this.ext(dm, "dtd", [class MediaType].APPLICATION_XML_DTD);
        this.ext(dm, "ecore", [class MediaType].APPLICATION_ECORE);
        this.ext(dm, "eps", [class MediaType].APPLICATION_POSTSCRIPT);
        this.ext(dm, "exe", [class MediaType].APPLICATION_OCTET_STREAM);
        this.ext(dm, "fmt", [class Encoding].FREEMARKER);
        this.ext(dm, "form", [class MediaType].APPLICATION_WWW_FORM);
        this.ext(dm, "ftl", [class Encoding].FREEMARKER, true);
        this.ext(dm, "gif", [class MediaType].IMAGE_GIF);
        this.ext(dm, "gwt", [class MediaType].APPLICATION_JAVA_OBJECT_GWT);
        this.ext(dm, "hqx", [class MediaType].APPLICATION_MAC_BINHEX40);
        this.ext(dm, "ico", [class MediaType].IMAGE_ICON);
        this.ext(dm, "jad", [class MediaType].TEXT_J2ME_APP_DESCRIPTOR);
        this.ext(dm, "jar", [class MediaType].APPLICATION_JAVA_ARCHIVE);
        this.ext(dm, "java", [class MediaType].TEXT_PLAIN);
        this.ext(dm, "jnlp", [class MediaType].APPLICATION_JNLP);
        this.ext(dm, "jpe", [class MediaType].IMAGE_JPEG);
        this.ext(dm, "jpeg", [class MediaType].IMAGE_JPEG);
        this.ext(dm, "jpg", [class MediaType].IMAGE_JPEG);
        this.ext(dm, "js", [class MediaType].APPLICATION_JAVASCRIPT);
        this.ext(dm, "jsf", [class MediaType].TEXT_PLAIN);
        this.ext(dm, "kar", [class MediaType].AUDIO_MIDI);
        this.ext(dm, "latex", [class MediaType].APPLICATION_LATEX);
        this.ext(dm, "latin1", [class CharacterSet].ISO_8859_1);
        this.ext(dm, "mac", [class CharacterSet].MACINTOSH);
        this.ext(dm, "man", [class MediaType].APPLICATION_TROFF_MAN);
        this.ext(dm, "mathml", [class MediaType].APPLICATION_MATHML);
        this.ext(dm, "mid", [class MediaType].AUDIO_MIDI);
        this.ext(dm, "midi", [class MediaType].AUDIO_MIDI);
        this.ext(dm, "mov", [class MediaType].VIDEO_QUICKTIME);
        this.ext(dm, "mp2", [class MediaType].AUDIO_MPEG);
        this.ext(dm, "mp3", [class MediaType].AUDIO_MPEG);
        this.ext(dm, "mp4", [class MediaType].VIDEO_MP4);
        this.ext(dm, "mpe", [class MediaType].VIDEO_MPEG);
        this.ext(dm, "mpeg", [class MediaType].VIDEO_MPEG);
        this.ext(dm, "mpg", [class MediaType].VIDEO_MPEG);
        this.ext(dm, "n3", [class MediaType].TEXT_RDF_N3);
        this.ext(dm, "nt", [class MediaType].TEXT_PLAIN);
        this.ext(dm, "odb", [class MediaType].APPLICATION_OPENOFFICE_ODB);
        this.ext(dm, "odc", [class MediaType].APPLICATION_OPENOFFICE_ODC);
        this.ext(dm, "odf", [class MediaType].APPLICATION_OPENOFFICE_ODF);
        this.ext(dm, "odi", [class MediaType].APPLICATION_OPENOFFICE_ODI);
        this.ext(dm, "odm", [class MediaType].APPLICATION_OPENOFFICE_ODM);
        this.ext(dm, "odg", [class MediaType].APPLICATION_OPENOFFICE_ODG);
        this.ext(dm, "odp", [class MediaType].APPLICATION_OPENOFFICE_ODP);
        this.ext(dm, "ods", [class MediaType].APPLICATION_OPENOFFICE_ODS);
        this.ext(dm, "odt", [class MediaType].APPLICATION_OPENOFFICE_ODT);
        this.ext(dm, "onetoc", [class MediaType].APPLICATION_MSOFFICE_ONETOC);
        this.ext(dm, "onetoc2", [class MediaType].APPLICATION_MSOFFICE_ONETOC2);
        this.ext(dm, "otg", [class MediaType].APPLICATION_OPENOFFICE_OTG);
        this.ext(dm, "oth", [class MediaType].APPLICATION_OPENOFFICE_OTH);
        this.ext(dm, "otp", [class MediaType].APPLICATION_OPENOFFICE_OTP);
        this.ext(dm, "ots", [class MediaType].APPLICATION_OPENOFFICE_OTS);
        this.ext(dm, "ott", [class MediaType].APPLICATION_OPENOFFICE_OTT);
        this.ext(dm, "oxt", [class MediaType].APPLICATION_OPENOFFICE_OXT);
        this.ext(dm, "pdf", [class MediaType].APPLICATION_PDF);
        this.ext(dm, "png", [class MediaType].IMAGE_PNG);
        this.ext(dm, "potx", [class MediaType].APPLICATION_MSOFFICE_POTX);
        this.ext(dm, "potm", [class MediaType].APPLICATION_MSOFFICE_POTM);
        this.ext(dm, "ppam", [class MediaType].APPLICATION_MSOFFICE_PPAM);
        this.ext(dm, "pps", [class MediaType].APPLICATION_POWERPOINT);
        this.ext(dm, "ppsm", [class MediaType].APPLICATION_MSOFFICE_PPSM);
        this.ext(dm, "ppsx", [class MediaType].APPLICATION_MSOFFICE_PPSX);
        this.ext(dm, "ppt", [class MediaType].APPLICATION_POWERPOINT);
        this.ext(dm, "pptm", [class MediaType].APPLICATION_MSOFFICE_PPTM);
        this.ext(dm, "pptx", [class MediaType].APPLICATION_MSOFFICE_PPTX);
        this.ext(dm, "ps", [class MediaType].APPLICATION_POSTSCRIPT);
        this.ext(dm, "qt", [class MediaType].VIDEO_QUICKTIME);
        this.ext(dm, "rdf", [class MediaType].APPLICATION_RDF_XML);
        this.ext(dm, "rnc", [class MediaType].APPLICATION_RELAXNG_COMPACT);
        this.ext(dm, "rng", [class MediaType].APPLICATION_RELAXNG_XML);
        this.ext(dm, "rss", [class MediaType].APPLICATION_RSS);
        this.ext(dm, "rtf", [class MediaType].APPLICATION_RTF);
        this.ext(dm, "sav", [class MediaType].APPLICATION_SPSS_SAV);
        this.ext(dm, "sit", [class MediaType].APPLICATION_STUFFIT);
        this.ext(dm, "sldm", [class MediaType].APPLICATION_MSOFFICE_SLDM);
        this.ext(dm, "sldx", [class MediaType].APPLICATION_MSOFFICE_SLDX);
        this.ext(dm, "snd", [class MediaType].AUDIO_BASIC);
        this.ext(dm, "sps", [class MediaType].APPLICATION_SPSS_SPS);
        this.ext(dm, "sta", [class MediaType].APPLICATION_STATA_STA);
        this.ext(dm, "svg", [class MediaType].IMAGE_SVG);
        this.ext(dm, "swf", [class MediaType].APPLICATION_FLASH);
        this.ext(dm, "tar", [class MediaType].APPLICATION_TAR);
        this.ext(dm, "tex", [class MediaType].APPLICATION_TEX);
        this.ext(dm, "tif", [class MediaType].IMAGE_TIFF);
        this.ext(dm, "tiff", [class MediaType].IMAGE_TIFF);
        this.ext(dm, "tsv", [class MediaType].TEXT_TSV);
        this.ext(dm, "ulw", [class MediaType].AUDIO_BASIC);
        this.ext(dm, "utf16", [class CharacterSet].UTF_16);
        this.ext(dm, "utf8", [class CharacterSet].UTF_8);
        this.ext(dm, "vm", [class Encoding].VELOCITY);
        this.ext(dm, "vrml", [class MediaType].MODEL_VRML);
        this.ext(dm, "vxml", [class MediaType].APPLICATION_VOICEXML);
        this.ext(dm, "wadl", [class MediaType].APPLICATION_WADL);
        this.ext(dm, "wav", [class MediaType].AUDIO_WAV);
        this.ext(dm, "win", [class CharacterSet].WINDOWS_1252);
        this.ext(dm, "wrl", [class MediaType].MODEL_VRML);
        this.ext(dm, "xht", [class MediaType].APPLICATION_XHTML);
        this.ext(dm, "xls", [class MediaType].APPLICATION_EXCEL);
        this.ext(dm, "xlsx", [class MediaType].APPLICATION_MSOFFICE_XLSX);
        this.ext(dm, "xlsm", [class MediaType].APPLICATION_MSOFFICE_XLSM);
        this.ext(dm, "xltx", [class MediaType].APPLICATION_MSOFFICE_XLTX);
        this.ext(dm, "xltm", [class MediaType].APPLICATION_MSOFFICE_XLTM);
        this.ext(dm, "xlsb", [class MediaType].APPLICATION_MSOFFICE_XLSB);
        this.ext(dm, "xlam", [class MediaType].APPLICATION_MSOFFICE_XLAM);
        this.ext(dm, "xmi", [class MediaType].APPLICATION_XMI);
        this.ext(dm, "xsd", [class MediaType].APPLICATION_W3C_SCHEMA);
        this.ext(dm, "xsl", [class MediaType].APPLICATION_W3C_XSLT);
        this.ext(dm, "xslt", [class MediaType].APPLICATION_W3C_XSLT);
        this.ext(dm, "xul", [class MediaType].APPLICATION_XUL);
        this.ext(dm, "yaml", [class MediaType].APPLICATION_YAML);
        this.ext(dm, "yaml", [class MediaType].TEXT_YAML);
        this.ext(dm, "z", [class MediaType].APPLICATION_COMPRESS);
        this.ext(dm, "zip", [class MediaType].APPLICATION_ZIP);
        // [enddef]
        this.ext(dm, "htm", [class MediaType].TEXT_HTML);
        this.ext(dm, "html", [class MediaType].TEXT_HTML);
        this.ext(dm, "json", [class MediaType].APPLICATION_JSON);
        this.ext(dm, "txt", [class MediaType].TEXT_PLAIN, true);
        this.ext(dm, "xhtml", [class MediaType].APPLICATION_XHTML);
        this.ext(dm, "xml", [class MediaType].TEXT_XML);
        this.ext(dm, "xml", [class MediaType].APPLICATION_XML);

        // Add all those mappings
        this.mappings.addAll(dm);
    },

    addExtension: function(extension, metadata, preferred) {
    	if (preferred==null) {
    		preferred = false;
    	}
        if (preferred) {
            // Add the mapping at the beginning of the list
            this.mappings.add(0, new [class MetadataExtension](extension, metadata));
        } else {
            // Add the mapping at the end of the list
            this.mappings.add(new [class MetadataExtension](extension, metadata));
        }
    },

    clearExtensions: function() {
        this.mappings.clear();
    },

    ext: function(extensions, extension, metadata, preferred) {
    	if (preferred==null) {
    		preferred = false;
    	}
        if (preferred) {
            // Add the mapping at the beginning of the list
            extensions.add(0, new [class MetadataExtension](extension, metadata));
        } else {
            // Add the mapping at the end of the list
            extensions.add(new [class MetadataExtension](extension, metadata));
        }
    },

    getAllCharacterSetExtensionNames: function() {
        var result = [];

        for (var i=0; i<this.mappings.length; i++) {
        	var mapping = this.mappings[i];
            if ((mapping.getMetadata() instanceof [class CharacterSet])
                    && !result.contains(mapping.getName())) {
                result.push(mapping.getName());
            }
        }

        return result;
    },

    getAllCharacterSets: function(extension) {
        var result = null;

        if (extension != null) {
            // Look for all registered convenient mapping.
            for (var i=0; i<this.mappings.length; i++) {
            	var metadataExtension = this.mappings[i];
                if (extension.equals(metadataExtension.getName())
                        && (metadataExtension.getMetadata() instanceof [class CharacterSet])) {
                    if (result == null) {
                        result = [];
                    }

                    result.push(metadataExtension.getCharacterSet());
                }
            }
        }

        return result;
    },

    getAllEncodingExtensionNames: function() {
        var result = [];

        for (var i=0; i<this.mappings.length; i++) {
        	var mapping = this.mappings[i];
            if ((mapping.getMetadata() instanceof [class Encoding])
                    && !result.contains(mapping.getName())) {
                result.push(mapping.getName());
            }
        }

        return result;
    },

    getAllExtensionNames: function() {
        var result = [];

        for (var i=0; i<this.mappings.length; i++) {
        	var mapping = this.mappings[i];
            if (!result.contains(mapping.getName())) {
                result.push(mapping.getName());
            }
        }

        return result;
    },

    getAllLanguageExtensionNames: function() {
        var result = [];

        for (var i=0; i<this.mappings.length; i++) {
        	var mapping = this.mappings[i];
            if ((mapping.getMetadata() instanceof [class Language])
                    && !result.contains(mapping.getName())) {
                result.push(mapping.getName());
            }
        }

        return result;
    },

    getAllLanguages: function(extension) {
        var result = null;

        if (extension != null) {
            // Look for all registered convenient mapping.
            for (var i=0; i<this.mappings.length; i++) {
            	var metadataExtension = this.mappings[i];
                if (extension.equals(metadataExtension.getName())
                        && (metadataExtension.getMetadata() instanceof [class Language])) {
                    if (result == null) {
                        result = [];
                    }

                    result.push(metadataExtension.getLanguage());
                }
            }
        }

        return result;
    },

    getAllMediaTypeExtensionNames: function() {
        var result = [];

        for (var i=0; i<this.mappings.length; i++) {
        	var mapping = this.mappings[i];
            if ((mapping.getMetadata() instanceof [class MediaType])
                    && !result.contains(mapping.getName())) {
                result.add(mapping.getName());
            }
        }

        return result;
    },

    getAllMediaTypes: function(extension) {
        var result = null;

        if (extension != null) {
            // Look for all registered convenient mapping.
            for (var i=0; i<this.mappings.length; i++) {
            	var metadataExtension = this.mappings[i];
                if (extension.equals(metadataExtension.getName())
                        && (metadataExtension.getMetadata() instanceof [class MediaType])) {
                    if (result == null) {
                        result = [];
                    }

                    result.add(metadataExtension.getMediaType());
                }
            }
        }

        return result;
    },

    getAllMetadata: function(extension) {
        var result = null;

        if (extension != null) {
            // Look for all registered convenient mapping.
            for (var i=0; i<this.mappings.length; i++) {
            	var metadataExtension = this.mappings[i];
                if (extension.equals(metadataExtension.getName())) {
                    if (result == null) {
                        result = [];
                    }

                    result.add(metadataExtension.getMetadata());
                }
            }
        }

        return result;
    },

    getCharacterSet: function(extension) {
        var metadata = this.getMetadata(extension);
        if (metadata instanceof [class CharacterSet]) {
        	return metadata;
        } else {
        	return null;
        }
    },

    getDefaultCharacterSet: function() {
        return this.defaultCharacterSet;
    },

    getDefaultEncoding: function() {
        return this.defaultEncoding;
    },

    getDefaultLanguage: function() {
        return this.defaultLanguage;
    },

    getDefaultMediaType: function() {
        return this.defaultMediaType;
    },

    getEncoding: function(extension) {
        var metadata = this.getMetadata(extension);
        if (metadata instanceof Encoding) {
        	return metadata;
        } else {
        	return null;
        }
    },

    getExtension: function(metadata) {
        if (metadata != null) {
            // Look for the first registered convenient mapping.
            for (var i=0; i<this.mappings.length; i++) {
            	var metadataExtension = this.mappings[i];
                if (metadata.equals(metadataExtension.getMetadata())) {
                    return metadataExtension.getName();
                }
            }
        }
        return null;
    },

    getLanguage: function(extension) {
        var metadata = this.getMetadata(extension);
        if (metadata instanceof [class Language]) {
        	return metadata;
        } else {
        	return null;
        }
    },

    getMediaType: function(extension) {
    	var metadata = this.getMetadata(extension);
    	if (metadata instanceof [class MediaType]) {
    		return metadata;
    	} else {
    		return null;
    	}
    },

    getMetadata: function(extension) {
        if (extension != null) {
            // Look for the first registered convenient mapping.
            for (var i=0; i<this.mappings.length; i++) {
            	var metadataExtension = this.mappings[i];
                if (extension.equals(metadataExtension.getName())) {
                    return metadataExtension.getMetadata();
                }
            }
        }

        return null;
    },

    setDefaultCharacterSet: function(defaultCharacterSet) {
        this.defaultCharacterSet = defaultCharacterSet;
    },

    setDefaultEncoding: function(defaultEncoding) {
        this.defaultEncoding = defaultEncoding;
    },

    setDefaultLanguage: function(defaultLanguage) {
        this.defaultLanguage = defaultLanguage;
    },

    setDefaultMediaType: function(defaultMediaType) {
        this.defaultMediaType = defaultMediaType;
    }
});