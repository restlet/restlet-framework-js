Array.prototype.getFirstValue = function(key, ignoreCase) {
	for (var cpt=0; cpt<this.length; cpt++) {
		var elt = this[cpt];
		if (elt instanceof Parameter) {
			if (ignoreCase && elt.getName().equalsIgnoreCase(key)) {
				return elt;
			}
			if (!ignoreCase && elt.getName().equals(key)) {
				return elt;
			}
		}
	}
	return null;
};

Array.prototype.isEmpty = function() {
	return (this.length==0);
};
