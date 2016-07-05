import {bindable, inject, ObserverLocator} from 'aurelia-framework';
import meeus = require('meeus');
import 'jquery';

@inject(ObserverLocator)
export class AnglePicker {
    @bindable value: meeus.Angle;
    @bindable format: string = 'D';
    @bindable angleStyle: meeus.AngleStyle = meeus.AngleStyle.Degree;
    parseError: boolean = false;
    angleInput: Element;
    downButton: Element;
    upButton: Element;
    hasFocus: boolean = false;
    subscriptions: Array<any> = [];

    constructor(private obsLocator: ObserverLocator) { }

    bind() {
        this.value = this.value || meeus.Angle.fromDegrees(0);
        this.format = this.format || 'D';
    }

    attached() {
        this.subscriptions.push(
            this.obsLocator
                .getObserver(this, 'hasFocus')
                .subscribe(nv => {
                    if (!nv) {
                        this.onLostFocus();
                    }
                })
        );

        let ai = $(this.angleInput);
        ai.val(this.value.toFormattedString({ format: this.format, digits: 0 }));

        this.setupMouseWheel(ai);
        this.setupMousePress($(this.downButton), true);
        this.setupMousePress($(this.upButton), false);
    }

    detached() {
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

    private mousePressTimer;
    private fired:boolean = false;

    setupMousePress(btn: JQuery, isDownButton: boolean) {
        var changeValue = () => {
            this.setValues(this.changeValue(this.value, this.format, 0, isDownButton ? -60 : 60));
        };

        var mouseleft = false;

        btn.on('mousedown', () => {
            btn.on('mouseleave', () => {
                if (!mouseleft) {
                    mouseleft = true;
                    $('body').on('mouseup', () => {
                        mouseleft = false;
                        clearInterval(this.mousePressTimer);
                    });
                }
            });

            this.fired = false;

            this.mousePressTimer = setInterval(() => {
                console.debug((new Date).getTime().toString());
                changeValue();
                this.fired = true;
            }, 50);
        });

        btn.on('mouseup', () => {
            mouseleft = false;
            clearInterval(this.mousePressTimer);
        });

        btn.on('click', () => {
            if (!this.fired) {
                changeValue();
            }
        });
    }

    setupMouseWheel(ai: JQuery) {
        let mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x

        ai.on(mousewheelevt, e => {
            if (this.hasFocus) {
                var evt: any = window.event || e; //equalize event object
                evt.preventDefault();
                var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta;
                var value = this.changeValue(this.value, this.format, 0, delta > 0 ? 30 : -30);
                this.setValues(value);
            }
        });
    }

    changeValue(value: meeus.Angle, format: string, mins: number = 0, secs: number = 0): meeus.Angle {
        let val: meeus.Angle;
        switch (format) {
            case 'D':
                val = meeus.Angle.fromDegrees(value.degrees, mins, secs);
                break;
            case 'H':
                val = meeus.Angle.fromHours(value.hours, mins, secs);
                if (val.hours < 0) val = meeus.Angle.fromHours(24 + val.hours);
                break;
            //case meeus.AngleStyle.Radian:
            //    this.value = meeus.Angle.fromRadians(this.value.radians - 0.1);
            //    break;
            default:
                break;
        }

        return val;
    }

    valueChanged(newValue: meeus.Angle) {
        $(this.angleInput).val(newValue.toFormattedString({ format: this.format, digits: 0 }));
    }

    down() {
        let val = this.changeValue(this.value, this.format, -30);
        this.setValues(val);
    }

    up() {
        let val = this.changeValue(this.value, this.format, 30);
        this.setValues(val);
    }

    changeFormat() {
        switch (this.format) {
            case 'D':
                this.angleStyle = meeus.AngleStyle.Hour;
                this.format = 'H';
                break;
            case 'H':
                this.angleStyle = meeus.AngleStyle.Degree;
                this.format = 'D';
                break;
            default:
                break;
        }

        $(this.angleInput).val(this.value.toFormattedString({ format: this.format, digits: 0 }));
    }

    onLostFocus() {
        try {
            var val = meeus.Angle.parse($(this.angleInput).val(), this.angleStyle);
            this.setValues(val);
        }
        catch (error) {
            this.setValues(this.value);
        }
    }
    setValues(val: meeus.Angle) {
        this.value = val;
        var value = this.value.toFormattedString({ format: this.format, digits: 0 });
        $(this.angleInput).val(value);
    }
} 