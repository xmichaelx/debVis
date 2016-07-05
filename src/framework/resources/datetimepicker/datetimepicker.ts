import {customElement, inject, bindable} from 'aurelia-framework';
import $ = require('jquery');
import moment = require('moment');
import 'bootstrap';
import * as picker from "./picker";

@customElement('date-time-picker')
@inject(Element)
export class DateTimePicker {

    @bindable value: Date = new Date();
    @bindable options: picker.DateTimePickerOptions = new picker.DateTimePickerOptions();
    @bindable useMoment: boolean = false;
    private element: Element;
    private pickerNode: Node;
    private picker: picker.DateTimePicker;

    constructor(element: Element) {
        this.element = element;
    }
    
    bind() {
        if (!this.pickerNode) {
            for (var i = 0, ii = this.element.childNodes.length; i < ii; i++) {
                if (this.element.childNodes[i].attributes && this.element.childNodes[i].attributes['ref']) {
                    this.pickerNode = this.element.childNodes[i];
                }
            }
        }
    }

    attached() {
        this.updateValue();
    }

    private updateValue(selected: boolean = true) {
        if (!this.picker) {
            this.picker = new picker.DateTimePicker($(this.pickerNode), this.options)     
        }
        
        if (this.useMoment) {
            this.picker.date(this.value || moment.utc());
        } else {
            this.picker.date(this.value || new Date());
        }
        
        if (selected) {
            $(this.pickerNode).on('dp.change', (e:any) => {
                if (this.useMoment) {
                    this.value = e.date.toDate();
                } else {
                    this.value = e.date;
                }
            });
        }
    }

    detached() {
       $(this.pickerNode).off();
    }

    valueChanged(newValue) {
        this.updateValue(false);
        console.log(newValue);
    }
} 
