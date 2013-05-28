function copyElements(obj1, obj2, parent) {
	for (var elt in obj1) {
		if (parent!=null && obj2[elt]!=null && typeof obj2[elt] == "function") {
			parent[elt] = obj2[elt];
		}
		obj2[elt] = obj1[elt];
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
		if (clazz.initializeExtend!=null && clazz.initializeExtend==true) {
			return;
		}
		if (content!=null && content["initialize"]!=null) {
			content["initialize"].apply(this, arguments);
		}
	}
	if (parent!=null) {
		parent.initializeExtend = true;
		clazz.prototype = new parent();
		clazz.prototype.__parent = parent.prototype;
		parent.prototype.__child = clazz.prototype;
		parent.initializeExtend = null;
		copyElements(content, clazz.prototype, clazz.prototype.__parent);
		clazz.prototype["getClass"] = function() {
			return clazz;
		};
		clazz.prototype["callSuperCstr"] = function() {
			if (this.__currentCallSuperLevel==null) {
				this.__currentCallSuperLevel = {};
			}
			if (this.__currentCallSuperLevel["initialize"]==null) {
				this.__currentCallSuperLevel["initialize"] = this.__parent;
			} else {
				this.__currentCallSuperLevel["initialize"] = this.__currentCallSuperLevel["initialize"].__parent;
			}

			while (this.__currentCallSuperLevel["initialize"]["initialize"]==this["initialize"]) {
				this.__currentCallSuperLevel["initialize"] = this.__currentCallSuperLevel["initialize"].__parent;
			}

			var currentLevel = this.__currentCallSuperLevel["initialize"];
			if (currentLevel["initialize"]!=null && typeof currentLevel["initialize"]=="function") {
				var superInitialize = currentLevel["initialize"];
				superInitialize.apply(this, arguments);
			}
			this.__currentCallSuperLevel["initialize"] = this.__currentCallSuperLevel["initialize"].__child;
		};
		clazz.prototype["callSuper"] = function() {
			var methodName = arguments[0];
			if (this.__currentCallSuperLevel==null) {
				this.__currentCallSuperLevel = {};
			}
			var initialCurrentCallSuperLevel = this.__currentCallSuperLevel[methodName];
			if (this.__currentCallSuperLevel[methodName]==null) {
				this.__currentCallSuperLevel[methodName] = this.__parent;
			} else {
				this.__currentCallSuperLevel[methodName] = this.__currentCallSuperLevel[methodName].__parent;
			}

			while (this.__currentCallSuperLevel[methodName][methodName]==this[methodName]) {
				this.__currentCallSuperLevel[methodName] = this.__currentCallSuperLevel[methodName].__parent;
			}

			var currentLevel = this.__currentCallSuperLevel[methodName];
			var ret = null;
			if (currentLevel[methodName]!=null && typeof currentLevel[methodName]=="function") {
				var args = [];
				for (var i=1;i<arguments.length;i++) {
					args.push(arguments[i]);
				}
				ret = currentLevel[methodName].apply(this, args);
			}
			this.__currentCallSuperLevel[methodName] = initialCurrentCallSuperLevel;
			if (ret!=null) {
				return ret;
			}
		};
	} else {
		clazz.prototype = {};
		copyElements(content, clazz.prototype);
	}

	clazz.extend = function(content) {
		copyElements(content, this);
	};
	return clazz;
};

module.exports = Class;