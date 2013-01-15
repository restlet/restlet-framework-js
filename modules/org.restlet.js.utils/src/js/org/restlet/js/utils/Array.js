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

Array.prototype.add = function() {
	if (arguments.length==1) {
		var element = arguments[0];
		this.push(element);
	} else if (arguments.length==2) {
		var index = arguments[0];
		var element = arguments[1];
		this.splice(index, 0, element);
	}
};

Array.prototype.addAll = function(elements) {
	for (var i=0; i<elements.length; i++) {
		this.push(elements[i]);
	}
};

Array.prototype.isEmpty = function() {
	return (this.length==0);
};

Array.prototype.size = function() {
	return this.length;
};

Array.prototype.clear = function() {
	this.splice(0, this.length-1);
};

Array.prototype.indexOf = function(element) {
	for (var i=0; i<this.length; i++) {
		if (this[i]==element) {
			return i;
		}
	}
	return -1;
};

Array.prototype.remove = function(i) {
	return this.splice(i, 1);
};

Array.prototype.contains = function(obj) {
	for (var i=0; i<this.length; i++) {
		if (this[i]==obj) {
			return true;
		}
	}
	return false;
};