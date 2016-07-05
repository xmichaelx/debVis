import {customElement, inject, bindable} from 'aurelia-framework';

@customElement('progress-ring')
@bindable({ name: 'value', defaultValue: 0, changeHandler: 'valueChange' })
@bindable({ name: 'color', defaultValue: 'black', changeHandler: 'cssChange' })
@bindable({ name: 'textcolor', defaultValue: 'black', changeHandler: 'cssChange' })
@bindable({ name: 'textsize', defaultValue: 20, changeHandler: 'cssChange' })
export class ProgressRing {
    public textcolor: string;
    public textsize: number;
    public color: string;
    public value: number;
    _value: string;

    public path: string;

    public pathstyle: string;
    public textstyle: string;
    public signstyle: string;

    bind() {
        this.valueChange();
        this.cssChange();
    }

    cssChange(): void {
        this.pathstyle = 'fill: none; stroke-width: 15; stroke: ' + this.color + ';';
        this.textstyle = 'fill: ' + this.textcolor + '; font-size: ' + this.textsize + ';';
        this.signstyle = 'fill: ' + this.textcolor + '; font-size: ' + (this.textsize - 10) + ';';
    }

    valueChange(): void {
        if (this.value > 100) {
            this._value = '100';
        } else if (this.value < -100) {
            this._value = '-100';
        } else {
            this._value = this.value.toFixed(0);
        }

        this.path = this.setPath();
    }

    setPath(): string {
        var d = "M10 50 a40 40 0";
        var curr = this.value;
        if (curr > 99.99) {
            curr = 99.99;
        }
        if (curr < -99.99) {
            curr = -99.99;
        }
        var x = 40 - 40 * Math.cos(curr * Math.PI / 50);
        var y = -40 * Math.sin(curr * Math.PI / 50);
        return d + " " + (Math.abs(curr) <= 50 ? 0 : 1) + " " + (curr > 0 ? 1 : 0) + " " + x.toFixed(2) + " " + y.toFixed(2);
    }
}