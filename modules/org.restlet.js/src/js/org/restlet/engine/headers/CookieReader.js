var CookieReader = new [class Class](HeaderReader, {
    initialize: function(header) {
        this.callSuperCstr(header);
        this.globalVersion = -1;
    },

    readPair: function(readAttribute) {
        var result = null;

        var readingName = true;
        var readingValue = false;
        var nameBuffer = new StringBuilder();
        var valueBuffer = new StringBuilder();
        var nextChar = 0;

        while ((result == null) && (nextChar != -1)) {
            nextChar = this.read();

            if (readingName) {
                if (([class HeaderUtils].isSpace(nextChar))
                        && (nameBuffer.length() == 0)) {
                    // Skip spaces
                } else if ((nextChar == -1) || (nextChar == ';')
                        || (nextChar == ',')) {
                    if (nameBuffer.length() > 0) {
                        // End of pair with no value
                        result = [class Parameter].create(nameBuffer, null);
                    } else if (nextChar == -1) {
                        // Do nothing return null preference
                    } else {
                        throw new Error(
                                "Empty cookie name detected. Please check your cookies");
                    }
                } else if (nextChar == '=') {
                    readingName = false;
                    readingValue = true;
                } else if ([class HeaderUtils].isTokenChar(nextChar)
                        || (this.globalVersion < 1)) {
                    if (readAttribute && nextChar != '$'
                            && (nameBuffer.length() == 0)) {
                        this.unread();
                        nextChar = -1;
                    } else {
                        nameBuffer.append(nextChar);
                    }
                } else {
                    throw new Error(
                            "Separator and control characters are not allowed within a token. Please check your cookie header");
                }
            } else if (readingValue) {
                if (([class HeaderUtils].isSpace(nextChar))
                        && (valueBuffer.length() == 0)) {
                    // Skip spaces
                } else if ((nextChar == -1) || (nextChar == ';')) {
                    // End of pair
                    result = [class Parameter].create(nameBuffer, valueBuffer);
                } else if ((nextChar == '"') && (valueBuffer.length() == 0)) {
                    // Step back
                    this.unread();
                    valueBuffer.append(this.readQuotedString());
                } else if ([class HeaderUtils].isTokenChar(nextChar)
                        || (this.globalVersion < 1)) {
                    valueBuffer.append(nextChar);
                } else {
                    throw new Error(
                            "Separator and control characters are not allowed within a token. Please check your cookie header");
                }
            }
        }

        return result;
    },

    readValue: function() {
        var result = null;
        var pair = this.readPair(false);

        if (this.globalVersion == -1) {
            // Cookies version not yet detected
            if (pair.getName().equalsIgnoreCase(CookieReader.NAME_VERSION)) {
                if (pair.getValue() != null) {
                    this.globalVersion = parseInt(pair.getValue());
                } else {
                    throw new Error(
                            "Empty cookies version attribute detected. Please check your cookie header");
                }
            } else {
                // Set the default version for old Netscape cookies
                this.globalVersion = 0;
            }
        }

        while ((pair != null) && (pair.getName().charAt(0) == '$')) {
            // Unexpected special attribute
            // Silently ignore it as it may have been introduced by new
            // specifications
            pair = this.readPair(false);
        }

        if (pair != null) {
            // Set the cookie name and value
            result = new [class Cookie](this.globalVersion, pair.getName(),
                    pair.getValue());
            pair = this.readPair(true);
        }

        while ((pair != null) && (pair.getName().charAt(0) == '$')) {
            if (pair.getName().equalsIgnoreCase(CookieReader.NAME_PATH)) {
                result.setPath(pair.getValue());
            } else if (pair.getName().equalsIgnoreCase(CookieReader.NAME_DOMAIN)) {
                result.setDomain(pair.getValue());
            } else {
                // Unexpected special attribute
                // Silently ignore it as it may have been introduced by new
                // specifications
            }

            pair = this.readPair(true);
        }

        return result;
    }
});

CookieReader.extend({
	NAME_DOMAIN: "$Domain",
	NAME_PATH: "$Path",
	NAME_VERSION: "$Version",

	read: function(cookie) {
        var cr = new CookieReader(cookie);

        try {
            return cr.readValue();
        } catch (err) {
            throw new Error("Could not read the cookie");
        }
    }
});