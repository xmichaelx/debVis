import {inject, customElement, bindable} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@customElement('modal')
@inject(Element, DialogController)
export class Modal {
  @bindable modalType: string = 'default';
  @bindable title: string = 'Sample modal';
  @bindable description = 'Sample description';
  @bindable subtitle = 'Modal subtitle';
  @bindable bodyView: any;
  @bindable bodyModel: any;
  @bindable cancelText: string = 'Cancel';
  @bindable buttons = [];
  element;

  public controller: DialogController;

  constructor(element, controller: DialogController) {
    this.element = element;
    this.controller = controller;
  }

  activate(model) {
    if (model) {
      if (model.hasOwnProperty("modalType")) {
        this.modalType = model.modalType;
      }
      if (model.hasOwnProperty("title")) {
        this.title = model.title;
      }
      if (model.hasOwnProperty("description")) {
        this.description = model.description;
      }
      if (model.hasOwnProperty("subtitle")) {
        this.subtitle = model.subtitle;
      }
      if (model.hasOwnProperty("bodyView")) {
        this.bodyView = model.bodyView;
      }
      if (model.hasOwnProperty("bodyModel")) {
        this.bodyModel = model.bodyModel;
      }
      if (model.hasOwnProperty("cancelText")) {
        this.cancelText = model.cancelText;
      }
    }
  }

}
