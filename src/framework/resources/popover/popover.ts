import {customAttribute, bindable, inject} from 'aurelia-framework';
import 'jquery';
import 'bootstrap';

@inject(Element)
@customAttribute('popover')
export class Popover {
    element: Element;
    @bindable title;
    @bindable content;
    @bindable placement;

    constructor(private Element: Element) {
        this.element = Element;
    }

    bind() {
        // initialize the popover
        $(this.element).popover({
            title: this.title,
            placement: function() { return $(window).width() < 975 ? 'left' : 'right'; },
            content: this.content,
            trigger: 'focus',
            container: 'body',
            html: true,
        });
    }
} 
