import {customElement, inject, bindable, ObserverLocator} from 'aurelia-framework';

@customElement('paginator')
@inject(Element, ObserverLocator)
export class Paginator {
    @bindable value: Date = new Date();
    @bindable currentPage: number = 0;
    @bindable totalPages: number = 0;
    @bindable toCall: any;
    @bindable style: string = '';
    @bindable 'class': string = '';

    pages: number[] = [];

    private element: Element;
    private picker: any;
    private subscriptions: any[] = [];

    constructor(element: Element, private obsLocator: ObserverLocator) {
        this.element = element;

        this.subscriptions.push(
            this.obsLocator.getObserver(this, 'totalPages')
                .subscribe(() => {
                    this.setupPages();
                }));

        this.subscriptions.push(
            this.obsLocator.getObserver(this, 'currentPage')
                .subscribe((nv, ov) => {
                    if (nv !== ov && this.toCall) {
                        this.toCall();

                        this.setupPages();
                    }
                }));
    }

    setupPages() {
        if (this.pages.length === 0) {
            if (this.totalPages >= 5) {
                this.pages = [0, 1, 2, 3, 4];
            } else {
                for (var i = 0; i < this.totalPages; i++) {
                    this.pages.push(i);
                }
            }
        } else {
            var first = this.currentPage;
            var temp = [];

            if (this.totalPages >= 5) {
                var offset = 0;
                switch (first) {
                    case this.pages[0]:
                        offset = -2;
                        break;
                    case this.pages[1]:
                        offset = -1;
                        break;
                    case this.pages[3]:
                        offset = 1;
                        break;
                    case this.pages[4]:
                        offset = 2;
                        break;
                }

                first = this.pages[0] + offset;
                var last = first + 5;

                if (first < 0) {
                    last -= first;
                    first = 0;
                }
                if (last > this.totalPages) {
                    var difference = last - (this.totalPages);
                    first -= difference;
                    last = this.totalPages;
                }

                for (var i = first; i < last; i++) {
                    temp.push(i);
                }
            } else {
                for (var i = 0; i < this.totalPages; i++) {
                    temp.push(i);
                }
            }
            console.log('changed');
            this.pages = temp;
        }
    }

    changePage(page: number) {
        this.currentPage = page;
    }

    bind(bc) {
        if (isNaN(this.totalPages)) {
            this.totalPages = 0;
        }

        if (isNaN(this.currentPage)) {
            this.currentPage = 0;
        }

        this.setupPages();
    }

    attached() {

    }

    detached() {
        this.dispose();
    }

    valueChanged(newValue) {

    }

    dispose() {
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
} 
