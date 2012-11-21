var RangeReader = new [class Class]({
});

RangeReader.extend({
    update: function(value, representation) {
        var prefix = "bytes ";
        if (value != null && value.startsWith(prefix)) {
            value = value.substring(prefix.length());

            var index = value.indexOf("-");
            var index1 = value.indexOf("/");

            if (index != -1) {
                var startIndex = (index == 0) ? [class Range].INDEX_LAST : parseInt(value.substring(0, index));
                var endIndex = parseInt(value.substring(index + 1, index1));

                representation.setRange(new [class Range](startIndex, endIndex - startIndex + 1));
            }

            var strLength = value.substring(index1 + 1, value.length);
            if (!("*".equals(strLength))) {
                representation.setSize(parseInt(strLength));
            }
        }
    },

    read: function(rangeHeader) {
        var result = [];
        var prefix = "bytes=";
        if (rangeHeader != null && rangeHeader.startsWith(prefix)) {
            rangeHeader = rangeHeader.substring(prefix.length());

            var array = rangeHeader.split(",");
            for (var i = 0; i <array.length; i++) {
                var value = array[i].trim();
                var index = 0;
                var length = 0;
                if (value.startsWith("-")) {
                    index = [class Range].INDEX_LAST;
                    length = parseInt(value.substring(1));
                } else if (value.endsWith("-")) {
                    index = parseInt(value.substring(0, value.length - 1));
                    length = [class Range].SIZE_MAX;
                } else {
                    var tab = value.split("-");
                    if (tab.length == 2) {
                        index = parseInt(tab[0]);
                        length = parseInt(tab[1]) - index + 1;
                    }
                }
                result.push(new [class Range](index, length));
            }
        }

        return result;
    }
});