var FormUtils = new [class Class]({});

FormUtils.extend({
    create: function(name, value,
            decode, characterSet) {
        var result = null;

        if (name != null) {
            var nameStr;
            if (decode) {
                nameStr = [class Reference].decode(name.toString(), characterSet);
            } else {
                nameStr = name.toString();
            }
            if (value != null) {
                var valueStr;
                if (decode) {
                    valueStr = [class Reference].decode(value.toString(), characterSet);
                } else {
                    valueStr = value.toString();
                }
                result = new [class Parameter](nameStr, valueStr);
            } else {
                result = new [class Parameter](nameStr, null);
            }
        }
        return result;
    },

    /*public static Parameter getFirstParameter(Representation post, String name)
            throws IOException {
        if (!post.isAvailable()) {
            throw new IllegalStateException(
                    "The Web form cannot be parsed as no fresh content is available. If this entity has been already read once, caching of the entity is required");
        }

        return new FormReader(post).readFirstParameter(name);
    },

    public static Parameter getFirstParameter(String query, String name,
            CharacterSet characterSet, char separator, boolean decode)
            throws IOException {
        return new FormReader(query, characterSet, separator, decode)
                .readFirstParameter(name);
    },

    public static Object getParameter(Representation form, String name)
            throws IOException {
        if (!form.isAvailable()) {
            throw new IllegalStateException(
                    "The Web form cannot be parsed as no fresh content is available. If this entity has been already read once, caching of the entity is required");
        }

        return new FormReader(form).readParameter(name);
    },

    public static Object getParameter(String query, String name,
            CharacterSet characterSet, char separator, boolean decode)
            throws IOException {
        return new FormReader(query, characterSet, separator, decode)
                .readParameter(name);
    },

    public static void getParameters(Representation post,
            Map<String, Object> parameters) throws IOException {
        if (!post.isAvailable()) {
            throw new IllegalStateException(
                    "The Web form cannot be parsed as no fresh content is available. If this entity has been already read once, caching of the entity is required");
        }

        new FormReader(post).readParameters(parameters);
    }

    public static void getParameters(String parametersString,
            Map<String, Object> parameters, CharacterSet characterSet,
            char separator, boolean decode) throws IOException {
        new FormReader(parametersString, characterSet, separator, decode)
                .readParameters(parameters);
    }

    public static boolean isParameterFound(Parameter searchedParam,
            MediaType mediaRange) {
        boolean result = false;

        for (Iterator<Parameter> iter = mediaRange.getParameters().iterator(); !result
                && iter.hasNext();) {
            result = searchedParam.equals(iter.next());
        }

        return result;
    }*/

    /*public static void parse(Form form, Representation post, boolean decode) {
        if (post != null) {
            if (post.isAvailable()) {
                FormReader fr = null;

                try {
                    fr = new FormReader(post, decode);
                } catch (IOException ioe) {
                    Context.getCurrentLogger().log(Level.WARNING,
                            "Unable to create a form reader. Parsing aborted.",
                            ioe);
                }

                if (fr != null) {
                    fr.addParameters(form);
                }
            } else {
                Context.getCurrentLogger()
                        .log(Level.FINE,
                                "The form wasn't changed as the given representation isn't available.");
            }
        }
    }*/

    parse: function(form, parametersString, characterSet, decode, separator) {
        if ((parametersString != null) && parametersString != "") {
            var fr = new [class FormReader](parametersString, characterSet, separator,
                    decode);
            fr.addParameters(form);
        }
    }
});