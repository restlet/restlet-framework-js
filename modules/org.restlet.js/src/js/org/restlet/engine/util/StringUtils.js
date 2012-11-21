var CharacterEntity = new [class Class]({
	initialize: function(numericValue, name) {
		this.numericValue = numericValue;
		this.name = name;
	},

	getName: function() {
		return this.name;
	},

	getNumericValue: function() {
		return this.numericValue;
	}
});

var CharacterEntitySolver = new [class Class]({
	initialize: function() {
		this.toName = new Array[10000];
		this.toValue = {};
	},

	add: function(value, name) {
		this.toName[value] = name;
		this.toValue.put(name, value);
	},

	getName: function(value) {
		return this.toName[value];
	},

	getValue: function(name) {
		return this.toValue.get(name);
	}
});

var StringUtils = new [class Class]();
StringUtils.extend({
    getAsciiBytes: function(string) {
        if (string != null) {
            try {
                var buf = iconv.encode(string, "US-ASCII");
                return buf.toString();
            } catch (err) {
            	console.log(err.stack);
                // Should not happen.
                return null;
            }
        }
        return null;
    },

    getLatin1Bytes: function(string) {
        if (string != null) {
            try {
                var buf = iconv.encode(string, "ISO-8859-1");
                return buf.toString();
            } catch (err) {
            	console.log(err.stack);
                // Should not happen.
                return null;
            }
        }
        return null;
    },

    htmlEscape: function(str) {
        if (str == null) {
            return null;
        }
        var len = str.length;
        var sb = new [class StringBuilder](len * 1.5);
        for (var i = 0; i < len; i++) {
            var c = str.charCodeAt(i);
            var entityName = html40Entities.getName(c);
            if (entityName == null) {
                if (c > 127) {
                    // Escape non ASCII characters.
                    sb.append("&#").append(c.toString(10)).append(';');
                } else {
                    // ASCII characters are not escaped.
                    sb.append(c);
                }
            } else {
                sb.append('&').append(entityName).append(';');
            }
        }
        return sb.toString();
    },

    htmlUnescape: function(str) {
        if (str == null) {
            return null;
        }
        var len = str.length;
        var sb = new [class StringBuilder](len);
        for (var i = 0; i < len; i++) {
            var c = str.charAt(i);
            if (c == '&') {
                var nextIndex = i + 1;
                var semicolonIndex = -1;
                var ampersandIndex = -1;
                var stop = false;
                for (var j = nextIndex; !stop && j < len; j++) {
                	var ch = str.charAt(j);
                    if (';' == ch) {
                        semicolonIndex = j;
                        stop = true;
                    } else if ('&' == ch) {
                        ampersandIndex = j;
                        stop = true;
                    }
                }
                if (semicolonIndex != -1) {
                    // Entity found
                    if (nextIndex != semicolonIndex) {
                    	var entityValue = -1;
                    	var entityName = str.substring(nextIndex,
                                semicolonIndex);
                        if (entityName.charAt(0) == '#') {
                            // Numeric value
                            if (entityName.length > 1) {
                            	var hexChar = entityName.charAt(1);
                                try {
                                    if (hexChar == 'X') {
                                        entityValue = parseInt(
                                                entityName.substring(2), 16);
                                    } else if (hexChar == 'x') {
                                        entityValue = parseInt(
                                                entityName.substring(2), 16);
                                    } else {
                                        entityValue = parseInt(
                                                entityName.substring(1), 10);
                                    }
                                    if(!Character.isValidCodePoint(entityValue)){
                                        // Invalid Unicode character
                                        entityValue = -1;
                                    }
                                } catch (err) {
                                    entityValue = -1;
                                }
                            }
                        } else {
                            var val = html40Entities.getValue(entityName);
                            if (val != null) {
                                entityValue = val.intValue();
                            }
                        }
                        if (entityValue == -1) {
                            sb.append('&').append(entityName).append(';');
                        } else {
                            sb.append(entityValue);
                        }
                    } else {
                        sb.append("&;");
                    }
                    i = semicolonIndex;
                } else if (stop) {
                    // found a "&" character
                    sb.append(str, i, ampersandIndex).append('&');
                    i = ampersandIndex;
                } else {
                    // End of the string reached, no more entities to parse.
                    sb.append(str, i, len);
                    i = len;
                }
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    },

    strip: function(source, delimiter, start, end) {
    	if (start==null) {
    		start = true;
    	}
    	if (end==null) {
    		end = true;
    	}
        var beginIndex = 0;
        var endIndex = source.length;
        var stripping = true;

        // Strip beginning
        while (stripping && (beginIndex < endIndex)) {
            if (source.charAt(beginIndex) == delimiter) {
                beginIndex++;
            } else {
                stripping = false;
            }
        }

        // Strip end
        stripping = true;
        while (stripping && (beginIndex < endIndex - 1)) {
            if (source.charAt(endIndex - 1) == delimiter) {
                endIndex--;
            } else {
                stripping = false;
            }
        }

        return source.substring(beginIndex, endIndex);
    }
});

StringUtils.xml10 = [];
StringUtils.xml10.push(new CharacterEntity(34, "quot"));
StringUtils.xml10.push(new CharacterEntity(38, "amp"));
StringUtils.xml10.push(new CharacterEntity(62, "gt"));
StringUtils.xml10.push(new CharacterEntity(60, "lt"));
StringUtils.htmlLat1 = [];
StringUtils.htmlLat1.push(new CharacterEntity(160, "nbsp"));
StringUtils.htmlLat1.push(new CharacterEntity(161, "iexcl"));
StringUtils.htmlLat1.push(new CharacterEntity(162, "cent"));
StringUtils.htmlLat1.push(new CharacterEntity(163, "pound"));
StringUtils.htmlLat1.push(new CharacterEntity(164, "curren"));
StringUtils.htmlLat1.push(new CharacterEntity(165, "yen"));
StringUtils.htmlLat1.push(new CharacterEntity(166, "brvbar"));
StringUtils.htmlLat1.push(new CharacterEntity(167, "sect"));
StringUtils.htmlLat1.push(new CharacterEntity(168, "uml"));
StringUtils.htmlLat1.push(new CharacterEntity(169, "copy"));
StringUtils.htmlLat1.push(new CharacterEntity(170, "ordf"));
StringUtils.htmlLat1.push(new CharacterEntity(171, "laquo"));
StringUtils.htmlLat1.push(new CharacterEntity(172, "not"));
StringUtils.htmlLat1.push(new CharacterEntity(173, "shy"));
StringUtils.htmlLat1.push(new CharacterEntity(174, "reg"));
StringUtils.htmlLat1.push(new CharacterEntity(175, "macr"));
StringUtils.htmlLat1.push(new CharacterEntity(176, "deg"));
StringUtils.htmlLat1.push(new CharacterEntity(177, "plusmn"));
StringUtils.htmlLat1.push(new CharacterEntity(178, "sup2"));
StringUtils.htmlLat1.push(new CharacterEntity(179, "sup3"));
StringUtils.htmlLat1.push(new CharacterEntity(180, "acute"));
StringUtils.htmlLat1.push(new CharacterEntity(181, "micro"));
StringUtils.htmlLat1.push(new CharacterEntity(182, "para"));
StringUtils.htmlLat1.push(new CharacterEntity(183, "middot"));
StringUtils.htmlLat1.push(new CharacterEntity(184, "cedil"));
StringUtils.htmlLat1.push(new CharacterEntity(185, "sup1"));
StringUtils.htmlLat1.push(new CharacterEntity(186, "ordm"));
StringUtils.htmlLat1.push(new CharacterEntity(187, "raquo"));
StringUtils.htmlLat1.push(new CharacterEntity(188, "frac14"));
StringUtils.htmlLat1.push(new CharacterEntity(189, "frac12"));
StringUtils.htmlLat1.push(new CharacterEntity(190, "frac34"));
StringUtils.htmlLat1.push(new CharacterEntity(191, "iquest"));
StringUtils.htmlLat1.push(new CharacterEntity(192, "Agrave"));
StringUtils.htmlLat1.push(new CharacterEntity(193, "Aacute"));
StringUtils.htmlLat1.push(new CharacterEntity(194, "Acirc"));
StringUtils.htmlLat1.push(new CharacterEntity(195, "Atilde"));
StringUtils.htmlLat1.push(new CharacterEntity(196, "Auml"));
StringUtils.htmlLat1.push(new CharacterEntity(197, "Aring"));
StringUtils.htmlLat1.push(new CharacterEntity(198, "AElig"));
StringUtils.htmlLat1.push(new CharacterEntity(199, "Ccedil"));
StringUtils.htmlLat1.push(new CharacterEntity(200, "Egrave"));
StringUtils.htmlLat1.push(new CharacterEntity(201, "Eacute"));
StringUtils.htmlLat1.push(new CharacterEntity(202, "Ecirc"));
StringUtils.htmlLat1.push(new CharacterEntity(203, "Euml"));
StringUtils.htmlLat1.push(new CharacterEntity(204, "Igrave"));
StringUtils.htmlLat1.push(new CharacterEntity(205, "Iacute"));
StringUtils.htmlLat1.push(new CharacterEntity(206, "Icirc"));
StringUtils.htmlLat1.push(new CharacterEntity(207, "Iuml"));
StringUtils.htmlLat1.push(new CharacterEntity(208, "ETH"));
StringUtils.htmlLat1.push(new CharacterEntity(209, "Ntilde"));
StringUtils.htmlLat1.push(new CharacterEntity(210, "Ograve"));
StringUtils.htmlLat1.push(new CharacterEntity(211, "Oacute"));
StringUtils.htmlLat1.push(new CharacterEntity(212, "Ocirc"));
StringUtils.htmlLat1.push(new CharacterEntity(213, "Otilde"));
StringUtils.htmlLat1.push(new CharacterEntity(214, "Ouml"));
StringUtils.htmlLat1.push(new CharacterEntity(215, "times"));
StringUtils.htmlLat1.push(new CharacterEntity(216, "Oslash"));
StringUtils.htmlLat1.push(new CharacterEntity(217, "Ugrave"));
StringUtils.htmlLat1.push(new CharacterEntity(218, "Uacute"));
StringUtils.htmlLat1.push(new CharacterEntity(219, "Ucirc"));
StringUtils.htmlLat1.push(new CharacterEntity(220, "Uuml"));
StringUtils.htmlLat1.push(new CharacterEntity(221, "Yacute"));
StringUtils.htmlLat1.push(new CharacterEntity(222, "THORN"));
StringUtils.htmlLat1.push(new CharacterEntity(223, "szlig"));
StringUtils.htmlLat1.push(new CharacterEntity(224, "agrave"));
StringUtils.htmlLat1.push(new CharacterEntity(225, "aacute"));
StringUtils.htmlLat1.push(new CharacterEntity(226, "acirc"));
StringUtils.htmlLat1.push(new CharacterEntity(227, "atilde"));
StringUtils.htmlLat1.push(new CharacterEntity(228, "auml"));
StringUtils.htmlLat1.push(new CharacterEntity(229, "aring"));
StringUtils.htmlLat1.push(new CharacterEntity(230, "aelig"));
StringUtils.htmlLat1.push(new CharacterEntity(231, "ccedil"));
StringUtils.htmlLat1.push(new CharacterEntity(232, "egrave"));
StringUtils.htmlLat1.push(new CharacterEntity(233, "eacute"));
StringUtils.htmlLat1.push(new CharacterEntity(234, "ecirc"));
StringUtils.htmlLat1.push(new CharacterEntity(235, "euml"));
StringUtils.htmlLat1.push(new CharacterEntity(236, "igrave"));
StringUtils.htmlLat1.push(new CharacterEntity(237, "iacute"));
StringUtils.htmlLat1.push(new CharacterEntity(238, "icirc"));
StringUtils.htmlLat1.push(new CharacterEntity(239, "iuml"));
StringUtils.htmlLat1.push(new CharacterEntity(240, "eth"));
StringUtils.htmlLat1.push(new CharacterEntity(241, "ntilde"));
StringUtils.htmlLat1.push(new CharacterEntity(242, "ograve"));
StringUtils.htmlLat1.push(new CharacterEntity(243, "oacute"));
StringUtils.htmlLat1.push(new CharacterEntity(244, "ocirc"));
StringUtils.htmlLat1.push(new CharacterEntity(245, "otilde"));
StringUtils.htmlLat1.push(new CharacterEntity(246, "ouml"));
StringUtils.htmlLat1.push(new CharacterEntity(247, "divide"));
StringUtils.htmlLat1.push(new CharacterEntity(248, "oslash"));
StringUtils.htmlLat1.push(new CharacterEntity(249, "ugrave"));
StringUtils.htmlLat1.push(new CharacterEntity(250, "uacute"));
StringUtils.htmlLat1.push(new CharacterEntity(251, "ucirc"));
StringUtils.htmlLat1.push(new CharacterEntity(252, "uuml"));
StringUtils.htmlLat1.push(new CharacterEntity(253, "yacute"));
StringUtils.htmlLat1.push(new CharacterEntity(254, "thorn"));
StringUtils.htmlLat1.push(new CharacterEntity(255, "yuml"));
StringUtils.htmlSymbol = [];
StringUtils.htmlSymbol.push(new CharacterEntity(402, "fnof"));
StringUtils.htmlSymbol.push(new CharacterEntity(913, "Alpha"));
StringUtils.htmlSymbol.push(new CharacterEntity(914, "Beta"));
StringUtils.htmlSymbol.push(new CharacterEntity(915, "Gamma"));
StringUtils.htmlSymbol.push(new CharacterEntity(916, "Delta"));
StringUtils.htmlSymbol.push(new CharacterEntity(917, "Epsilon"));
StringUtils.htmlSymbol.push(new CharacterEntity(918, "Zeta"));
StringUtils.htmlSymbol.push(new CharacterEntity(919, "Eta"));
StringUtils.htmlSymbol.push(new CharacterEntity(920, "Theta"));
StringUtils.htmlSymbol.push(new CharacterEntity(921, "Iota"));
StringUtils.htmlSymbol.push(new CharacterEntity(922, "Kappa"));
StringUtils.htmlSymbol.push(new CharacterEntity(923, "Lambda"));
StringUtils.htmlSymbol.push(new CharacterEntity(924, "Mu"));
StringUtils.htmlSymbol.push(new CharacterEntity(925, "Nu"));
StringUtils.htmlSymbol.push(new CharacterEntity(926, "Xi"));
StringUtils.htmlSymbol.push(new CharacterEntity(927, "Omicron"));
StringUtils.htmlSymbol.push(new CharacterEntity(928, "Pi"));
StringUtils.htmlSymbol.push(new CharacterEntity(929, "Rho"));
StringUtils.htmlSymbol.push(new CharacterEntity(931, "Sigma"));
StringUtils.htmlSymbol.push(new CharacterEntity(932, "Tau"));
StringUtils.htmlSymbol.push(new CharacterEntity(933, "Upsilon"));
StringUtils.htmlSymbol.push(new CharacterEntity(934, "Phi"));
StringUtils.htmlSymbol.push(new CharacterEntity(935, "Chi"));
StringUtils.htmlSymbol.push(new CharacterEntity(936, "Psi"));
StringUtils.htmlSymbol.push(new CharacterEntity(937, "Omega"));
StringUtils.htmlSymbol.push(new CharacterEntity(945, "alpha"));
StringUtils.htmlSymbol.push(new CharacterEntity(946, "beta"));
StringUtils.htmlSymbol.push(new CharacterEntity(947, "gamma"));
StringUtils.htmlSymbol.push(new CharacterEntity(948, "delta"));
StringUtils.htmlSymbol.push(new CharacterEntity(949, "epsilon"));
StringUtils.htmlSymbol.push(new CharacterEntity(950, "zeta"));
StringUtils.htmlSymbol.push(new CharacterEntity(951, "eta"));
StringUtils.htmlSymbol.push(new CharacterEntity(952, "theta"));
StringUtils.htmlSymbol.push(new CharacterEntity(953, "iota"));
StringUtils.htmlSymbol.push(new CharacterEntity(954, "kappa"));
StringUtils.htmlSymbol.push(new CharacterEntity(955, "lambda"));
StringUtils.htmlSymbol.push(new CharacterEntity(956, "mu"));
StringUtils.htmlSymbol.push(new CharacterEntity(957, "nu"));
StringUtils.htmlSymbol.push(new CharacterEntity(958, "xi"));
StringUtils.htmlSymbol.push(new CharacterEntity(959, "omicron"));
StringUtils.htmlSymbol.push(new CharacterEntity(960, "pi"));
StringUtils.htmlSymbol.push(new CharacterEntity(961, "rho"));
StringUtils.htmlSymbol.push(new CharacterEntity(962, "sigmaf"));
StringUtils.htmlSymbol.push(new CharacterEntity(963, "sigma"));
StringUtils.htmlSymbol.push(new CharacterEntity(964, "tau"));
StringUtils.htmlSymbol.push(new CharacterEntity(965, "upsilon"));
StringUtils.htmlSymbol.push(new CharacterEntity(966, "phi"));
StringUtils.htmlSymbol.push(new CharacterEntity(967, "chi"));
StringUtils.htmlSymbol.push(new CharacterEntity(968, "psi"));
StringUtils.htmlSymbol.push(new CharacterEntity(969, "omega"));
StringUtils.htmlSymbol.push(new CharacterEntity(977, "thetasym"));
StringUtils.htmlSymbol.push(new CharacterEntity(978, "upsih"));
StringUtils.htmlSymbol.push(new CharacterEntity(982, "piv"));
StringUtils.htmlSymbol.push(new CharacterEntity(8230, "hellip"));
StringUtils.htmlSymbol.push(new CharacterEntity(8242, "prime"));
StringUtils.htmlSymbol.push(new CharacterEntity(8243, "Prime"));
StringUtils.htmlSymbol.push(new CharacterEntity(8254, "oline"));
StringUtils.htmlSymbol.push(new CharacterEntity(8260, "frasl"));
StringUtils.htmlSymbol.push(new CharacterEntity(8465, "image"));
StringUtils.htmlSymbol.push(new CharacterEntity(8472, "weierp"));
StringUtils.htmlSymbol.push(new CharacterEntity(8476, "real"));
StringUtils.htmlSymbol.push(new CharacterEntity(8482, "trade"));
StringUtils.htmlSymbol.push(new CharacterEntity(8501, "alefsym"));
StringUtils.htmlSymbol.push(new CharacterEntity(8592, "larr"));
StringUtils.htmlSymbol.push(new CharacterEntity(8593, "uarr"));
StringUtils.htmlSymbol.push(new CharacterEntity(8594, "rarr"));
StringUtils.htmlSymbol.push(new CharacterEntity(8595, "darr"));
StringUtils.htmlSymbol.push(new CharacterEntity(8596, "harr"));
StringUtils.htmlSymbol.push(new CharacterEntity(8629, "crarr"));
StringUtils.htmlSymbol.push(new CharacterEntity(8656, "lArr"));
StringUtils.htmlSymbol.push(new CharacterEntity(8657, "uArr"));
StringUtils.htmlSymbol.push(new CharacterEntity(8658, "rArr"));
StringUtils.htmlSymbol.push(new CharacterEntity(8659, "dArr"));
StringUtils.htmlSymbol.push(new CharacterEntity(8660, "hArr"));
StringUtils.htmlSymbol.push(new CharacterEntity(8704, "forall"));
StringUtils.htmlSymbol.push(new CharacterEntity(8706, "part"));
StringUtils.htmlSymbol.push(new CharacterEntity(8707, "exist"));
StringUtils.htmlSymbol.push(new CharacterEntity(8709, "empty"));
StringUtils.htmlSymbol.push(new CharacterEntity(8711, "nabla"));
StringUtils.htmlSymbol.push(new CharacterEntity(8712, "isin"));
StringUtils.htmlSymbol.push(new CharacterEntity(8713, "notin"));
StringUtils.htmlSymbol.push(new CharacterEntity(8715, "ni"));
StringUtils.htmlSymbol.push(new CharacterEntity(8719, "prod"));
StringUtils.htmlSymbol.push(new CharacterEntity(8721, "sum"));
StringUtils.htmlSymbol.push(new CharacterEntity(8722, "minus"));
StringUtils.htmlSymbol.push(new CharacterEntity(8727, "lowast"));
StringUtils.htmlSymbol.push(new CharacterEntity(8730, "radic"));
StringUtils.htmlSymbol.push(new CharacterEntity(8733, "prop"));
StringUtils.htmlSymbol.push(new CharacterEntity(8734, "infin"));
StringUtils.htmlSymbol.push(new CharacterEntity(8736, "ang"));
StringUtils.htmlSymbol.push(new CharacterEntity(8743, "and"));
StringUtils.htmlSymbol.push(new CharacterEntity(8744, "or"));
StringUtils.htmlSymbol.push(new CharacterEntity(8745, "cap"));
StringUtils.htmlSymbol.push(new CharacterEntity(8746, "cup"));
StringUtils.htmlSymbol.push(new CharacterEntity(8747, "int"));
StringUtils.htmlSymbol.push(new CharacterEntity(8756, "there4"));
StringUtils.htmlSymbol.push(new CharacterEntity(8764, "sim"));
StringUtils.htmlSymbol.push(new CharacterEntity(8773, "cong"));
StringUtils.htmlSymbol.push(new CharacterEntity(8776, "asymp"));
StringUtils.htmlSymbol.push(new CharacterEntity(8800, "ne"));
StringUtils.htmlSymbol.push(new CharacterEntity(8801, "equiv"));
StringUtils.htmlSymbol.push(new CharacterEntity(8804, "le"));
StringUtils.htmlSymbol.push(new CharacterEntity(8805, "ge"));
StringUtils.htmlSymbol.push(new CharacterEntity(8834, "sub"));
StringUtils.htmlSymbol.push(new CharacterEntity(8835, "sup"));
StringUtils.htmlSymbol.push(new CharacterEntity(8836, "nsub"));
StringUtils.htmlSymbol.push(new CharacterEntity(8838, "sube"));
StringUtils.htmlSymbol.push(new CharacterEntity(8839, "supe"));
StringUtils.htmlSymbol.push(new CharacterEntity(8853, "oplus"));
StringUtils.htmlSymbol.push(new CharacterEntity(8855, "otimes"));
StringUtils.htmlSymbol.push(new CharacterEntity(8869, "perp"));
StringUtils.htmlSymbol.push(new CharacterEntity(8901, "sdot"));
StringUtils.htmlSymbol.push(new CharacterEntity(8968, "lceil"));
StringUtils.htmlSymbol.push(new CharacterEntity(8969, "rceil"));
StringUtils.htmlSymbol.push(new CharacterEntity(8970, "lfloor"));
StringUtils.htmlSymbol.push(new CharacterEntity(8971, "rfloor"));
StringUtils.htmlSymbol.push(new CharacterEntity(9001, "lang"));
StringUtils.htmlSymbol.push(new CharacterEntity(9002, "rang"));
StringUtils.htmlSymbol.push(new CharacterEntity(9674, "loz"));
StringUtils.htmlSymbol.push(new CharacterEntity(9824, "spades"));
StringUtils.htmlSymbol.push(new CharacterEntity(9827, "clubs"));
StringUtils.htmlSymbol.push(new CharacterEntity(9829, "hearts"));
StringUtils.htmlSymbol.push(new CharacterEntity(9830, "diams"));
StringUtils.htmlSpecial = [];
StringUtils.htmlSpecial.push(new CharacterEntity(34, "quot"));
StringUtils.htmlSpecial.push(new CharacterEntity(38, "amp"));
StringUtils.htmlSpecial.push(new CharacterEntity(39, "apos"));
StringUtils.htmlSpecial.push(new CharacterEntity(60, "lt"));
StringUtils.htmlSpecial.push(new CharacterEntity(62, "gt"));
StringUtils.htmlSpecial.push(new CharacterEntity(338, "OElig"));
StringUtils.htmlSpecial.push(new CharacterEntity(339, "oelig"));
StringUtils.htmlSpecial.push(new CharacterEntity(352, "Scaron"));
StringUtils.htmlSpecial.push(new CharacterEntity(353, "scaron"));
StringUtils.htmlSpecial.push(new CharacterEntity(376, "Yuml"));
StringUtils.htmlSpecial.push(new CharacterEntity(710, "circ"));
StringUtils.htmlSpecial.push(new CharacterEntity(732, "tilde"));
StringUtils.htmlSpecial.push(new CharacterEntity(8194, "ensp"));
StringUtils.htmlSpecial.push(new CharacterEntity(8195, "emsp"));
StringUtils.htmlSpecial.push(new CharacterEntity(8201, "thinsp"));
StringUtils.htmlSpecial.push(new CharacterEntity(8204, "zwnj"));
StringUtils.htmlSpecial.push(new CharacterEntity(8205, "zwj"));
StringUtils.htmlSpecial.push(new CharacterEntity(8206, "lrm"));
StringUtils.htmlSpecial.push(new CharacterEntity(8207, "rlm"));
StringUtils.htmlSpecial.push(new CharacterEntity(8211, "ndash"));
StringUtils.htmlSpecial.push(new CharacterEntity(8212, "mdash"));
StringUtils.htmlSpecial.push(new CharacterEntity(8216, "lsquo"));
StringUtils.htmlSpecial.push(new CharacterEntity(8217, "rsquo"));
StringUtils.htmlSpecial.push(new CharacterEntity(8218, "sbquo"));
StringUtils.htmlSpecial.push(new CharacterEntity(8220, "ldquo"));
StringUtils.htmlSpecial.push(new CharacterEntity(8221, "rdquo"));
StringUtils.htmlSpecial.push(new CharacterEntity(8222, "bdquo"));
StringUtils.htmlSpecial.push(new CharacterEntity(8224, "dagger"));
StringUtils.htmlSpecial.push(new CharacterEntity(8225, "Dagger"));
StringUtils.htmlSpecial.push(new CharacterEntity(8226, "bull"));
StringUtils.htmlSpecial.push(new CharacterEntity(8240, "permil"));
StringUtils.htmlSpecial.push(new CharacterEntity(8249, "lsaquo"));
StringUtils.htmlSpecial.push(new CharacterEntity(8250, "rsaquo"));
StringUtils.htmlSpecial.push(new CharacterEntity(8364, "euro"));
var list = [];
/*        list.addAll(xml10);
        list.addAll(htmlLat1);
        list.addAll(htmlSymbol);
        list.addAll(htmlSpecial);
        html40Entities = new CharacterEntitySolver();
        for (CharacterEntity entity : xml10) {
            html40Entities.add(entity.getNumericValue(), entity.getName());
        }
        for (CharacterEntity entity : htmlLat1) {
            html40Entities.add(entity.getNumericValue(), entity.getName());
        }
        for (CharacterEntity entity : htmlSymbol) {
            html40Entities.add(entity.getNumericValue(), entity.getName());
        }
        for (CharacterEntity entity : htmlSpecial) {
            html40Entities.add(entity.getNumericValue(), entity.getName());
        }
    }
});*/