import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(aurelia:FrameworkConfiguration) {
aurelia.globalResources('./resources/datetimepicker/datetimepicker');
aurelia.globalResources('./resources/popover/popover');
aurelia.globalResources('./resources/tooltip/tooltip');
aurelia.globalResources('./resources/progress-bar/progress-bar');
aurelia.globalResources('./resources/progress-ring/progress-ring');
aurelia.globalResources('./resources/modal/modal');
aurelia.globalResources('./resources/modal/modal-header');
aurelia.globalResources('./resources/modal/modal-body');
aurelia.globalResources('./resources/modal/modal-footer');
aurelia.globalResources('./views/page-elements/app-header');
aurelia.globalResources('./views/page-elements/app-footer');
aurelia.globalResources('./views/page-elements/app-sidebar');
aurelia.globalResources('./views/page-elements/app-control');
}
