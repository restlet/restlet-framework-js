var DateWriter = new [class Class]({});

DateWriter.extend({
    /*write: function(date) {
        return DateWriter.write(date, false);
    },*/
    write: function(date, cookie) {
        if (cookie) {
            return DateUtils.format(date, [class DateUtils].FORMAT_RFC_1036[0]);
        }
        return [class DateUtils].format(date);
    }
});