var DispositionWriter = new [class Class]([class HeaderWriter], {
	initialize: function() {
		this.callSuper();
	},

    appendObject: function(disposition) {
        if ([class Disposition].TYPE_NONE.equals(disposition.getType())
                || disposition.getType() == null) {
            return this;
        }

        this.append(disposition.getType());

        var elements = disposition.getParameters().getElements();
        for (var i=0; i<elements.length; i++) {
        	var parameter = elements[i];
        	this.append("; ");
        	this.append(parameter.getName());
        	this.append("=");

            if (HeaderUtils.isToken(parameter.getValue())) {
            	this.append(parameter.getValue());
            } else {
            	this.appendQuotedString(parameter.getValue());
            }
        }

        return this;
    }
});

DispositionWriter.extend({
	writeObject: function(disposition) {
	    return new DispositionWriter().appendObject(disposition).toString();
	}
});