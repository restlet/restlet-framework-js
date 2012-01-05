function copyElements(obj1, obj2) {
	for (var elt in obj1) {
		//console.log("copy "+elt+" ("+typeof obj1[elt]+")");
		if (elt!="initialize" || typeof obj1[elt] != "function") {
			//console.log("  -> ok");
			obj2[elt] = obj1[elt];
		} else {
			obj2["_"+elt] = obj1[elt];
		}
	}
}

var Class = function() {
	var parent = null;
	var content = null;
	if (arguments.length==1) {
		content = arguments[0];
	} else if (arguments.length==2) {
		parent = arguments[0];
		content = arguments[1];
	}
	
	var clazz = function() {
		//console.log("clazz.initializeExtend = "+clazz.initializeExtend);
		if (clazz.initializeExtend!=null && clazz.initializeExtend==true) {
			return;
		}
		if (content!=null && content["initialize"]!=null) {
			content["initialize"].apply(this, arguments);
		}
	}
	if (parent!=null) {
		copyElements(parent, clazz);
		parent.initializeExtend = true;
		//console.log("> new parent");
		clazz.prototype = new parent();
		//console.log("< new parent");
		clazz.parent = parent.prototype;
		parent.initializeExtend = null;
		copyElements(content, clazz.prototype);
		//console.log("adding call super");
		clazz.prototype["callSuper"] = function() {
			//console.log("clazz.parent.prototype = "+clazz.parent.prototype);
			/*console.log("clazz.parent = "+clazz.parent);
			for(var elt in clazz.parent) {
				console.log("- elt "+elt);
			}*/
			if (clazz.parent["_initialize"]!=null) {
				var superInitialize = clazz.parent["_initialize"];
				/*console.log("superInitialize = "+superInitialize);
				console.log("this = "+this);*/
				superInitialize.apply(this, arguments);
			}
		};
		//console.log("added call super");
	} else {
		clazz.prototype = {};
		copyElements(content, clazz.prototype);
	}
	//copyElements(parent, clazz);
	/*console.log("clazz.prototype:");
	for (var elt in clazz.prototype) {
		console.log(" - "+elt);
	}*/

	clazz.extend = function(content) {
		copyElements(content, this);
	};
	return clazz;
};