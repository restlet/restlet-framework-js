var RouteList = new [class Class](Array, {
    initialize: function(delegate) {
    	this.delegate = delegate;
        this.lastIndex = -1;
    },

    /*public RouteList() {
        super(new CopyOnWriteArrayList<Route>());
        this.lastIndex = -1;
    }

    public RouteList(List<Route> delegate) {
        super(new CopyOnWriteArrayList<Route>(delegate));
        this.lastIndex = -1;
    }*/

    getBest: function(request, response, requiredScore) {
        var result = null;
        var bestScore = 0;
        var score;

        for (var i=0; i<this.length; i++) {
        	var current = this[i]
            score = current.score(request, response);

            if ((score > bestScore) && (score >= requiredScore)) {
                bestScore = score;
                result = current;
            }
        }

        return result;
    },

    getFirst: function(request, response, requiredScore) {
        for (var i=0; i<this.length; i++) {
        	var current = this[i]
            if (current.score(request, response) >= requiredScore) {
                return current;
            }
        }

        // No match found
        return null;
    },

    getLast: function(request, response, requiredScore) {
        for (var j = this.size() - 1; (j >= 0); j--) {
            var route = this.get(j);
            if (route.score(request, response) >= requiredScore) {
                return route;
            }
        }

        // No match found
        return null;
    },

    getNext: function(request, response, requiredScore) {
        if (!this.isEmpty()) {
            for (var initialIndex = this.lastIndex++; initialIndex != this.lastIndex; this.lastIndex++) {
                if (this.lastIndex >= this.size()) {
                    this.lastIndex = 0;
                }

                var route = this.get(this.lastIndex);
                if (route.score(request, response) >= requiredScore) {
                    return route;
                }
            }
        }

        // No match found
        return null;
    },

    getRandom: function(request, response, requiredScore) {
        var length = this.size();

        if (length > 0) {
            var j = new Random().nextInt(length);
            var route = this.get(j);

            if (route.score(request, response) >= requiredScore) {
                return route;
            }

            var loopedAround = false;

            do {
                if ((j == length) && (loopedAround == false)) {
                    j = 0;
                    loopedAround = true;
                }

                route = this.get(j++);

                if (route.score(request, response) >= requiredScore) {
                    return route;
                }
            } while ((j < length) || !loopedAround);
        }

        // No match found
        return null;
    },

    removeAll: function(target) {
        for (var i = this.size() - 1; i >= 0; i--) {
            if (this.get(i).getNext() == target) {
                this.remove(i);
            }
        }
    },

    subList: function(fromIndex, toIndex) {
        return new [class RouteList](this.getDelegate().subList(fromIndex, toIndex));
    }
});