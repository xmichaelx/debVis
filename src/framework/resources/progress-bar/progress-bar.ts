import {customElement, bindable} from 'aurelia-framework';

@customElement('progress-bar')
export class ProgressBar {
    @bindable title: string;
    @bindable min: number;
    @bindable value: number;
    @bindable max: number;
    @bindable reversed: boolean;
    @bindable label: boolean;
    @bindable format: string;
    @bindable warn: boolean = false;
    width;
    bartype;

    bind() {
        this.valueChanged(this.value);
    }

    valueChanged(newValue: number) {
        this.calculateWidth();
    }

    calculateWidth() {
        if (this.max > 0) {
            this.width = ((this.value - this.min) / this.max);
        } else {
            this.width = 0;
        }

        this.bartype = 'info';
        if (this.warn) {
          if (this.reversed) {
            if (this.width <= 1 - 0.7) {
                this.bartype = 'warning';
            }

            if (this.width <= 1 - 0.95) {
                this.bartype = 'danger';
            }

          } else {
            if (this.width >= 0.7) {
                this.bartype = 'warning';
            }

            if (this.width >= 0.95) {
                this.bartype = 'danger';
            }
          }
        }

    }
} 
