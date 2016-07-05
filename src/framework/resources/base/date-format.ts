import moment = require('moment');

export class DateFormatValueConverter {
    toView(value : Date, format, tz = 0) {
        let utc = (format.endsWith('utc') || format.endsWith('UTC'));
        let local = (format.endsWith('local') || format.endsWith('LOCAL'));

        let val = moment(value);

        if (format.indexOf('fromNow') >= 0) {
            var temp = val.fromNow();
            if (temp.indexOf("in ") === 0) {
                temp = "a few seconds ago";
            }

            return temp;
        }

        if (utc) {
            format = format.replace('UTC','').replace('utc', '').trim();
            val = val.utc();
        }

        if (local) {
            format = format.replace('LOCAL', '').replace('local', '').trim();
            val = val.utcOffset(tz);
        }

        return val.format(format);
    }
}