import {inject, bindable, customElement} from 'aurelia-framework';
import 'jquery';

@customElement('modal-header')
@inject(Element)
export class ModalHeader {
  @bindable title: string = '';
  @bindable subtitle: string = '';
  @bindable close = this.closeDialog();
  @bindable description = 'Sample help message';

  constructor(private element: Element) {

  }

  attached() {
    var that = this.element;
    $(that).find(".help").click(function () {
      $(that).find('.help-region').slideToggle(100);
    });
  }

  public closeDialog() {
  }
}
