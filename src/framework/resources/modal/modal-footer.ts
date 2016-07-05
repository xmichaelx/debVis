import {bindable, customElement} from 'aurelia-framework';

@customElement('modal-footer')
export class ModalFooter {
  @bindable buttons = [];
}
