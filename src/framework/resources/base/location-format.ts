import meeus = require('meeus');

export class LocationFormatValueConverter {
    toView(value: meeus.Angle, format) {
        var h = '';

        var d = value.degree;
        var m = value.degreeMinute;
        var s = value.degreeSeconds;

        if (format == 'latitude') {
            h = 'N';
            if (value.degrees < 0.0) {
                h = 'S';
            }
        }
        if (format == 'longitude') {
            h = 'E';
            if (value.degrees < 0.0) {
                h = 'W';
            }
        }


        if (value.degrees < 0.0) {
            d = -d;
            m = -m;
            s = -s;
        }

        return d + "\u00B0" + m + "'" + s + '" ' + h;
    }
} 