var Tag = new Class({
	initialize: function(opaqueTag, weak) {
		this.name = opaqueTag;
		if (weak==null) {
			this.weak = true;
		} else {
			this.weak = weak;
		}
	},

    equals: function(object, checkWeakness) {
    	if (checkWeakness==null) {
    		checkWeakness = true;
    	}
        var result = (object != null) && (object instanceof Tag);

        if (result) {
            var that = object;

            if (checkWeakness) {
                result = (that.isWeak() == this.isWeak());
            }

            if (result) {
                if (this.getName() == null) {
                    result = (that.getName() == null);
                } else {
                    result = this.getName().equals(that.getName());
                }
            }
        }

        return result;
    },

    format: function() {
        if (this.getName().equals("*")) {
            return "*";
        }

        var sb = new StringBuilder();
        if (this.isWeak()) {
            sb.append("W/");
        }
        return sb.append('"').append(this.getName()).append('"').toString();
    },

    getName: function() {
        return this.name;
    },

    isWeak: function() {
        return this.weak;
    },

    toString: function() {
        return getName();
    }
});

Tag.extend({
    parse: function(httpTag) {
        var result = null;
        var weak = false;
        var httpTagCopy = httpTag;

        if (httpTagCopy.startsWith("W/")) {
            weak = true;
            httpTagCopy = httpTagCopy.substring(2);
        }

        if (httpTagCopy.startsWith("\"") && httpTagCopy.endsWith("\"")) {
            result = new Tag(
                    httpTagCopy.substring(1, httpTagCopy.length() - 1), weak);
        } else if (httpTagCopy.equals("*")) {
            result = new Tag("*", weak);
        } else {
            /*Context.getCurrentLogger().log(Level.WARNING,
                    "Invalid tag format detected: " + httpTagCopy);*/
        }

        return result;
    }
});

Tag.ALL = Tag.parse("*");
