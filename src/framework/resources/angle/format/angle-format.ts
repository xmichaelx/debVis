import meeus = require('meeus');

export class AngleFormatValueConverter {
    toView(value: meeus.Angle | number | string, format: string, style: meeus.AngleStyle, digits: number) : string {
        format = format || 'D';
        if (style == null) style = 1;
        digits = digits || 0;

        if (value == null || value == undefined) {
            return '<i class="wi wi-na"></i>';
        }

        var val: meeus.Angle;
        if (typeof (value) == 'number') {
            switch (style) {
                case meeus.AngleStyle.Hour:
                    val = meeus.Angle.fromHours(<number>(value));
                    break;
                case meeus.AngleStyle.Radian:
                    val = meeus.Angle.fromRadians(<number>(value));
                    break;
                default:
                    val = meeus.Angle.fromDegrees(<number>(value));
            }
        } else if (typeof (value) === 'string') {
            val = meeus.Angle.parse(<string>(value), style);                
        } else {
            val = <meeus.Angle>(value);
        }

        return val.toFormattedString({ format: format, digits: digits });
    }

    fromView(value: string, format: string, style: meeus.AngleStyle) : meeus.Angle {
        format = format || 'D';
        if (style == null) style = 1;

        if (value == null || value.length == 0) {
            return new meeus.Angle(0);
        }

        var angle = meeus.Angle.parse(value, style);

        return angle;
    }
} 