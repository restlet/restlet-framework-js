var DateUtils = new Class({});

DateUtils.extend({
    FORMAT_ASC_TIME: ["EEE MMM dd HH:mm:ss yyyy"],
    FORMAT_RFC_1036: ["EEEE, dd-MMM-yy HH:mm:ss zzz"],
    FORMAT_RFC_1123: ["EEE, dd MMM yyyy HH:mm:ss zzz"],
    FORMAT_RFC_3339: ["yyyy-MM-dd'T'HH:mm:ssz"],
    FORMAT_RFC_822: [
            "EEE, dd MMM yy HH:mm:ss z", "EEE, dd MMM yy HH:mm z",
            "dd MMM yy HH:mm:ss z", "dd MMM yy HH:mm z"],
    after: function(baseDate, afterDate) {
        if ((baseDate == null) || (afterDate == null)) {
            throw new Error(
                    "Can't compare the dates, at least one of them is null");
        }

        var baseTime = baseDate.getTime() / 1000;
        var afterTime = afterDate.getTime() / 1000;
        return baseTime < afterTime;
    },
    before: function(baseDate, beforeDate) {
        if ((baseDate == null) || (beforeDate == null)) {
            throw new Error(
                    "Can't compare the dates, at least one of them is null");
        }

        var baseTime = baseDate.getTime() / 1000;
        var beforeTime = beforeDate.getTime() / 1000;
        return beforeTime < baseTime;
    },
    equals: function(baseDate, otherDate) {
        if ((baseDate == null) || (otherDate == null)) {
            throw new Error(
                    "Can't compare the dates, at least one of them is null");
        }

        var baseTime = baseDate.getTime() / 1000;
        var otherTime = otherDate.getTime() / 1000;
        return otherTime == baseTime;
    },
    /*format: function(date) {
        return DateUtils.format(date, DateUtils.FORMAT_RFC_1123[0]);
    },*/
    format: function(date, format) {
        if (date == null) {
            throw new Error("Date is null");
        }
        if (format==null) {
        	format = DateUtils.FORMAT_RFC_1123[0];
        }

        var formatter = new DateFormat(format);
        return formatter.format(date, format);
    },
    /*parse: function(date) {
        return DateUtils.parse(date, DateUtils.FORMAT_RFC_1123);
    },*/
    parse: function(date, formats) {
        var result = null;

        if (date == null) {
            throw new Error("Date is null");
        }
        if (formats==null) {
        	formats = DateUtils.FORMAT_RFC_1123;
        }

        var format = null;
        var formatsSize = formats.length;

        for (var i = 0; (result == null) && (i < formatsSize); i++) {
            format = formats[i];
            var parser = new DateFormat(format);
            try {
            	result = parser.parse(date);
            } catch(err) { }
        }

        return result;
    }
});