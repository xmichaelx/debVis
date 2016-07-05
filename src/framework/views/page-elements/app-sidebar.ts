import {customElement, bindable} from 'aurelia-framework';

@customElement("app-sidebar")
export class AppSidebar {
  @bindable router = null;
}
