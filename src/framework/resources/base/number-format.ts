import numeral = require('numeral');

export class NumberFormatValueConverter {
    toView(value, format, unit: string, max = 0) {

        var u = '';
        switch (unit) {
            case 'degrees':
                u = '°';
                break;
            case 'celsius':
                u = '°C';
                break;
            case 'micron':
                u = "µm";
                break;
            case 'percent':
                u = "%";
                break;
            case 'ms':
                u = "m/s";
                break;
            case 'kmh':
                u = 'km/h';
                break;
            case 'm':
                u = "m";
                break;
            case 'hours':
                u = "Hrs";
                break;
            case 'minutes':
                u = "min";
                break;
            case 'seconds':
                u = "s";
                break;
            case 'hms':
                u = "";
                break;
            case 'none':
                u = "";
                break;
            default:
                break;
        }

        if (value != null && value != undefined) {
            var suffix = '';
            var prefix = '';

            suffix = '<span class="unit">' + u + '</span>';

            if (format == 'hours') {
                format = '0.0';
            }

            if (format == 'minutes') {
                format = '0.0';
            }

            if (format == 'seconds') {
                format = '0';
            }
            
            if (format == 'steps') {
                prefix = 'Step ';
                format = '0';
                suffix = ' of ' + max;
            }

            if (format == 'frames') {
                prefix = 'Frame ';
                format = '0';
                suffix = ' of ' + max;
            }

            return prefix + numeral(value).format(format) + suffix;
        }

        return '<i class="wi wi-na"></i>';
    }
}