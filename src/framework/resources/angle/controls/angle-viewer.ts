import {customElement, bindable, inject, ObserverLocator} from 'aurelia-framework';
import meeus = require('meeus');

@customElement('angle-viewer')
@bindable({ name: 'value', defaultValue: 0, changeHandler: 'valueChange' })
@bindable({ name: 'target', defaultValue: undefined, changeHandler: 'targetChange' })
@bindable({ name: 'color', defaultValue: 'black', changeHandler: 'cssChange' })
@bindable({ name: 'textcolor', defaultValue: 'black', changeHandler: 'cssChange' })
@bindable({ name: 'textsize', defaultValue: 20, changeHandler: 'cssChange' })
@bindable({ name: 'style', defaultValue: 1, changeHandler: 'styleChange' })
@bindable({ name: 'normalization', defaultValue: meeus.AngleNormalization.Periodic, changeHandler: 'normalizationChange' })
@inject(ObserverLocator)
export class AngleViewer {
    public textcolor: string;
    public textsize: number;
    public color: string = '#00acd6';
    public targetcolor: string = '#0097bc';
    public value: meeus.Angle | number;
    public target: meeus.Angle | number;
    public vValue: meeus.Angle;
    public tValue: meeus.Angle;
    public style: meeus.AngleStyle;
    public normalization: meeus.AngleNormalization;

    valuesign: string;
    valuePrimary: string;
    valueSecondary: string;
    valueTertiary: string;
    valuePath: string;

    targetsign: string;
    targetPrimary: string;
    targetSecondary: string;
    targetTertiary: string;
    targetPath: string;

    transform1: string;
    transform2: string;
    visibility: string;

    vpathstyle: string;
    tpathstyle: string;
    textstyle: string;

    vradius: number = 45;
    strokewidth: number = 5;

    subscriptions: Array<any> = [];

    constructor(private obsLocator: ObserverLocator) {

    }

    bind() {
        this.targetChange();
        this.valueChange();
        this.cssChange();
        this.valueStyleChange();
        this.normalizationChange();
        this.subscriptions.push(
            this.obsLocator.getObserver(this, 'strokewidth')
                .subscribe(_ => this.cssChange())
            );
    }

    unbind() {
        for (var i = 0, l = this.subscriptions.length; i < l; i++) {
            var sub = this.subscriptions.pop();
            if (sub) {
                if (sub.dispose) {
                    sub.dispose();
                } else {
                    sub();
                }
            }
        }
    }

    normalizationChange(): void {
        switch (this.normalization) {
            case meeus.AngleNormalization.Reflective:
                this.transform1 = '';
                this.transform2 = 'translate(100 0) scale(-1 1)';
                this.visibility = 'visible';
                break;
            default:
                this.transform1 = 'rotate(90 50 50)';
                this.transform2 = '';
                this.visibility = 'hidden';
                break;
        }
    }

    cssChange(): void {
        this.vpathstyle = 'fill: none; stroke-width: ' + this.strokewidth + '; stroke: ' + this.color + ';';
        this.tpathstyle = 'fill: none; stroke-width: ' + this.strokewidth + '; stroke: ' + this.targetcolor + ';';
        this.textstyle = 'fill: ' + this.textcolor + ';';
    }

    valueChange(): void {
        if (this.target === undefined) {
            this.tValue = undefined;
            this.vradius = 40;
            this.strokewidth = 10;
        }
        else {
            this.vradius = 45;
            this.strokewidth = 5;
        }

        if (this.value === undefined) return;

        if (typeof (this.value) == 'number') {
            var num: any = this.value
            this.vValue = meeus.Angle.fromDegrees(<number>(num));
        } else {
            this.vValue = <meeus.Angle>(this.value);
        }

        this.valuePath = this.setValuePath();
        this.valueStyleChange();
    }

    targetChange(): void {
        if (this.target === undefined) {
            this.tValue = undefined;
            this.vradius = 40;
            this.strokewidth = 10;
        }
        else {
            this.vradius = 45;
            this.strokewidth = 5;
        }

        if (this.target === undefined) return;

        if (typeof (this.target) == 'number') {
            var num: any = this.target
            this.tValue = meeus.Angle.fromDegrees(<number>(num));
        } else {
            this.tValue = <meeus.Angle>(this.target);
        }

        this.targetPath = this.setTargetPath();
        this.targetStyleChange();
    }

    styleChange(): void {
        this.valueStyleChange();
        this.targetStyleChange();
    }

    valueStyleChange(): void {
        let val = this.vValue ? this.vValue : meeus.Angle.fromDegrees(0);
        switch (this.style) {
            case meeus.AngleStyle.Hour:
                this.valuePrimary = val.hour.toString();
                this.valuePrimary += 'ʰ'
                //this.valuesign = 'h';
                this.valueSecondary = this.pad(Math.abs(val.hourMinute))
                this.valueTertiary = this.pad(Math.abs(val.hourSecond));
                break;
            case meeus.AngleStyle.Radian:
                let parts = val.radians.toFixed(4).split('.');
                this.valuePrimary = parts[0];
                this.valuePrimary += 'ʳ';
                //this.valuesign = 'r';
                this.valueSecondary = '';
                this.valueTertiary = ' .' + parts[1];
                break;
            default:
                this.valuePrimary = val.degree.toString();
                this.valuePrimary += '°';
                //this.valuesign = '\u00B0';
                this.valueSecondary = this.pad(Math.abs(val.degreeMinute));
                this.valueTertiary = this.pad(Math.abs(val.degreeSecond));
                break;
        }
    }

    targetStyleChange(): void {
        if (this.tValue === undefined) {
            this.targetPrimary = '';
            this.targetsign = '';
            this.targetSecondary = '';
            this.targetTertiary = '';
        }
        else {
            switch (this.style) {
                case meeus.AngleStyle.Hour:
                    this.targetPrimary = this.tValue.hour.toString();
                    this.targetPrimary += 'ʰ'
                    //this.targetsign = 'h';
                    this.targetSecondary = this.pad(Math.abs(this.tValue.hourMinute));
                    this.targetTertiary = this.pad(Math.abs(this.tValue.hourSecond));
                    break;
                case meeus.AngleStyle.Radian:
                    var parts = this.tValue.radians.toFixed(3).split('.');
                    this.targetPrimary = parts[0];
                    this.targetPrimary += 'ʳ';
                    //this.targetsign = 'r';
                    this.targetSecondary = '.' + parts[1];
                    this.targetTertiary = '';
                    break;
                default:
                    this.targetPrimary = this.tValue.degree.toString();
                    this.targetPrimary += '°';
                    //this.targetsign = '\u00B0';
                    this.targetSecondary = this.pad(Math.abs(this.tValue.degreeMinute));
                    this.targetTertiary = this.pad(Math.abs(this.tValue.degreeSecond));
                    break;
            }
        }
    }

    pad(val: number): string {
        return Math.abs(val) < 10 ? '0' + val : val.toString();
    }

    createPath(radius: number, value: number): string {
        var margin = 50 - radius;
        var d = "M" + margin + " 50 a" + radius + " " + radius + " 0";
        var curr = value;
        if (curr > 99.99) {
            curr = 99.99;
        } else if (curr >= 0 && curr < 0.2) {
            curr = 0.2;
        } else if (curr < 0 && curr > -0.2) {
            curr = -0.2;
        } else if (curr < -99.99) {
            curr = -99.99;
        }

        var x = radius * (1 - Math.cos(curr * Math.PI / 50));
        var y = -radius * Math.sin(curr * Math.PI / 50);
        return d + " " + (Math.abs(curr) <= 50 ? 0 : 1) + " " + (curr > 0 ? 1 : 0) + " " + x.toFixed(2) + " " + y.toFixed(2);
    };

    setValuePath(): string {
        var val = this.vValue ? this.vValue.degrees : 0;
        return this.createPath(this.vradius + this.strokewidth / 2, val / 3.6);
    }

    setTargetPath(): string {
        if (this.tValue === undefined) {
            return 'M 0 0';
        } else {
            return this.createPath(this.vradius - this.strokewidth / 2, this.tValue.degrees / 3.6);
        }
    }
}
