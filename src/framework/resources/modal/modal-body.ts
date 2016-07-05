import {bindable, customElement} from 'aurelia-framework';

@customElement('modal-body')
export class ModalBody {
  @bindable bodyViewModel;
  @bindable bodyModel;

}
