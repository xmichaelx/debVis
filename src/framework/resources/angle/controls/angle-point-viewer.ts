import {customElement, bindable, inject} from 'aurelia-framework';
import meeus = require('meeus');

@customElement('angle-point-viewer')
@bindable({ name: 'value', defaultValue: 0, changeHandler: 'valueChanged' })
@bindable({ name: 'color', defaultValue: 'black', changeHandler: 'cssChanged' })
@bindable({ name: 'textcolor', defaultValue: 'black', changeHandler: 'cssChanged' })
@bindable({ name: 'textsize', defaultValue: 20, changeHandler: 'cssChanged' })
@bindable({ name: 'style', defaultValue: 1, changeHandler: 'styleChanged' })
export class AnglePointViewer {
    public textcolor: string;
    public textsize: number;
    public color: string = '#00acd6';
    public targetcolor: string = '#0097bc';
    public value: meeus.Angle | number;
    public target: meeus.Angle | number;
    public vValue: meeus.Angle;
    public style: meeus.AngleStyle;

    valuesign: string;
    valuePrimary: string;
    valueSecondary: string;
    valueTertiary: string;
    valuePath: string;

    transform: string;

    vpathstyle: string;
    tpathstyle: string;
    textstyle: string;

    vradius: number = 45;

    bind() {
        this.valueChanged();
        this.cssChanged();
        this.styleChanged();
    }

    cssChanged(): void {
        this.vpathstyle = 'fill: none; stroke-width: 10; stroke: ' + this.color + ';';
        this.textstyle = 'fill: ' + this.textcolor + ';';
    }

    valueChanged(): void {
        if (this.value === undefined) return;

        if (typeof (this.value) == 'number') {
            var num: any = this.value
            this.vValue = meeus.Angle.fromDegrees(<number>(num));
        } else {
            this.vValue = <meeus.Angle>(this.value);
        }

        this.transform = 'rotate(' + (this.vValue.degrees + 82.5) + ' 50 50)';
        this.styleChanged();
    }
    
    styleChanged(): void {
        let val = this.vValue ? this.vValue : meeus.Angle.fromDegrees(0);
        switch (this.style) {
            case meeus.AngleStyle.Hour:
                this.valuePrimary = val.hour.toString();
                this.valuesign = 'h';
                this.valueSecondary = this.pad(Math.abs(val.hourMinute))
                this.valueTertiary = this.pad(Math.abs(val.hourSecond));
                break;
            case meeus.AngleStyle.Radian:
                let parts = val.radians.toFixed(4).split('.');
                this.valuePrimary = parts[0];
                this.valuesign = 'r';
                this.valueSecondary = '';
                this.valueTertiary = ' .' + parts[1];
                break;
            default:
                this.valuePrimary = val.degree.toString();
                this.valuesign = '\u00B0';
                this.valueSecondary = this.pad(Math.abs(val.degreeMinute));
                this.valueTertiary = this.pad(Math.abs(val.degreeSecond));
                break;
        }
    }

    pad(val: number): string {
        return Math.abs(val) < 10 ? '0' + val : val.toString();
    }


}
