import {customAttribute, bindable, inject, ObserverLocator} from 'aurelia-framework';
import 'jquery';
import 'bootstrap';

@inject(Element, ObserverLocator)
@customAttribute('tooltip')
export class Tooltip {
    //element: Element;
    @bindable title;
    @bindable placement = 'top';
    @bindable trigger = 'hover';

    private subscriptions = [];

    constructor(private element: Element, private obsLocator: ObserverLocator) {
        //this.element = Element;
        window['element'] = element;
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
    
    bind() {
        // initialize the tooltip
        if ('ontouchstart' in document.documentElement) {
            return;
        }
        var tooltipElement = $(this.element).tooltip({
            title: this.title,
            placement: this.placement,
            trigger: this.trigger,
        });       

        this.subscriptions.push(
            this.obsLocator
                .getObserver(this, 'title')
                .subscribe(title => {
                    var tooltip = $(this.element).data('bs.tooltip');
                    tooltip.options.title = title;
                    tooltip.setContent();

                    if (!title) {
                        tooltipElement.tooltip('hide');
                    } else {
                        tooltipElement.tooltip('show');
                    }
                })
        );
    }
} 
