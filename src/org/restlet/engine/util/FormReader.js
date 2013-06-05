var FormReader = new [class Class]({
    /*
	 * public FormReader(Representation representation) throws IOException {
	 * this(representation, true); }
	 * 
	 * public FormReader(Representation representation, boolean decode) throws
	 * IOException { this.decode = decode; this.stream =
	 * representation.getStream(); this.separator = '&';
	 * 
	 * if (representation.getCharacterSet() != null) { this.characterSet =
	 * representation.getCharacterSet(); } else { this.characterSet =
	 * CharacterSet.UTF_8; } }
	 */

    /*
	 * public FormReader(String parametersString, char separator) {
	 * this(parametersString, null, separator, false); }
	 * 
	 * public FormReader(String parametersString, CharacterSet characterSet,
	 * char separator) { this(parametersString, characterSet, separator, true); }
	 */

    initialize: function(parametersString, characterSet, separator, decode) {
    	this.currentIndex = 0;
        this.decode = decode;
        this.stream = parametersString;
        // [ifndef gwt] instruction
        // this.stream = new ByteArrayInputStream(parametersString.getBytes());
        // [ifdef gwt] instruction uncomment
        // this.stream = new
        // org.restlet.engine.io.StringInputStream(parametersString);

        this.characterSet = characterSet;
        this.separator = separator;
    },

    addParameters: function(parameters) {
        var readNext = true;
        var param = null;

        if (this.stream != null) {
            // Let's read all form parameters
            try {
                while (readNext) {
                    param = this.readNextParameter();

                    if (param != null) {
                        // Add parsed parameter to the form
                        parameters.add(param);
                    } else {
                        // Last parameter parsed
                        readNext = false;
                    }
                }
            } catch (err) {
            	console.log(err.stack);
                /*
				 * Context.getCurrentLogger() .log(Level.WARNING, "Unable to
				 * parse a form parameter. Skipping the remaining parameters.",
				 * ioe);
				 */
            }

            try {
                // this.stream.close();
            } catch (err) {
                /*
				 * Context.getCurrentLogger().log(Level.WARNING, "Unable to
				 * close the form input stream", ioe);
				 */
            	console.log(err.stack);
            }
        }
    },

    read: function() {
        var result = new [class Form]();

        if (this.stream != null) {
            var param = this.readNextParameter();

            while (param != null) {
                result.add(param);
                param = this.readNextParameter();
            }

            // this.stream.close();
        }

        return result;
    },

    readFirstParameter: function(name) {
        var result = null;

        if (this.stream != null) {
            var param = this.readNextParameter();

            while ((param != null) && (result == null)) {
                if (param.getName()==name) {
                    result = param;
                }

                param = this.readNextParameter();
            }

            // this.stream.close();
        }

        return result;
    },

    readNextParameter: function() {
        var result = null;

        if (this.stream != null) {
            try {
                var readingName = true;
                var readingValue = false;
                var nameBuffer = new [class StringBuilder]();
                var valueBuffer = new [class StringBuilder]();
                var nextChar = 0;

                while ((result == null) && (this.currentIndex <= this.stream.length)) {
                	if (this.currentIndex < this.stream.length) {
                		nextChar = this.stream[this.currentIndex];
                	} else {
                		nextChar = '';
                	}
                    this.currentIndex++;

                    if (readingName) {
                        if (nextChar == '=') {
                            if (nameBuffer.length() > 0) {
                                readingName = false;
                                readingValue = true;
                            } else {
                                /*
								 * throw new IOException( "Empty parameter name
								 * detected. Please check your form data");
								 */
                            }
                        } else if ((nextChar == this.separator)
                                || (this.currentIndex == this.stream.length+1)) {
                            if (nameBuffer.length() > 0) {
                                result = [class FormUtils].create(nameBuffer, null,
                                        this.decode, this.characterSet);
                            } else if (this.currentIndex == this.stream.length+1) {
                                // Do nothing return null preference
                            } else {
                                /*
								 * [class Context].getCurrentLogger()
								 * .fine("Empty parameter name detected. Please
								 * check your form data");
								 */
                            }
                        } else {
                            nameBuffer.append(nextChar);
                        }
                    } else if (readingValue) {
                        if ((nextChar == this.separator) || (this.currentIndex == this.stream.length+1)) {
                            result = [class FormUtils].create(nameBuffer, valueBuffer,
                                    this.decode, this.characterSet);
                        } else {
                            valueBuffer.append(nextChar);
                        }
                    }
                }
            } catch (err) {
            	console.log(err.stack);
                /*
				 * throw new IOException( "Unsupported encoding. Please contact
				 * the administrator");
				 */
            }
        }

        return result;
    },

    readParameter: function(name) {
        var result = null;

        if (this.stream != null) {
            var param = this.readNextParameter();

            while (param != null) {
                if (param.getName()==name) {
                    if (result != null) {
                        var values = null;

                        if (typeof result == "Array") {
                            // Multiple values already found for this parameter
                            values = result;
                        } else {
                            // Second value found for this parameter
                            // Create a list of values
                            values = [];
                            values.add(result);
                            result = values;
                        }

                        if (param.getValue() == null) {
                            values.add([class Series].EMPTY_VALUE);
                        } else {
                            values.add(param.getValue());
                        }
                    } else {
                        if (param.getValue() == null) {
                            result = [class Series].EMPTY_VALUE;
                        } else {
                            result = param.getValue();
                        }
                    }
                }

                param = this.readNextParameter();
            }

            // this.stream.close();
        }

        return result;
    },

    readParameters: function(parameters) {
        if (this.stream != null) {
            var param = this.readNextParameter();
            var currentValue = null;

            while (param != null) {
                if (parameters.containsKey(param.getName())) {
                    currentValue = parameters.get(param.getName());

                    if (currentValue != null) {
                        List<Object> values = null;

                        if (typeof currentValue == "Array") {
                            // Multiple values already found for this parameter
                            values = currentValue;
                        } else {
                            // Second value found for this parameter
                            // Create a list of values
                            values = [];
                            values.add(currentValue);
                            parameters.put(param.getName(), values);
                        }

                        if (param.getValue() == null) {
                            values.add([class Series].EMPTY_VALUE);
                        } else {
                            values.add(param.getValue());
                        }
                    } else {
                        if (param.getValue() == null) {
                            parameters.put(param.getName(), [class Series].EMPTY_VALUE);
                        } else {
                            parameters.put(param.getName(), param.getValue());
                        }
                    }
                }

                param = this.readNextParameter();
            }

            // this.stream.close();
        }
    }
});