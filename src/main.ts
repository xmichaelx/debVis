import 'jquery';
import {Aurelia} from 'aurelia-framework';
import {Container} from 'aurelia-dependency-injection';
//import * as relay from 'app/relay/abotService';
//import * as mock from 'app/mock/abotService';
import {bootstrap} from 'aurelia-bootstrapper-webpack';
//import {TWCustomBootstrapViewStrategy} from "app/sybilla/custom-validation";
//import * as bp from "../framework/resources";
//import {DI} from "app/configs"
//import {config} from "../framework/configs/auth";

import "aurelia-dialog/styles/dialog.css"
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import "./framework/css/skins/skin-black.css";
import "./framework/css/AdminLTE.css";
import "./framework/css/weather-icons/css/weather-icons.css";
import './framework/css/abot-tutor.css';
import './framework/css/svg/style.css';
import "./framework/css/tutor-font.css";
import "toastr/build/toastr.css";


bootstrap((aurelia: Aurelia): void => {
  aurelia.use
    .standardConfiguration()
    // .developmentLogging()
    .plugin("aurelia-dialog")
    .feature("framework")
    //    .plugin('aurelia-auth', (baseConfig) => {
    //    baseConfig.configure(config);
    //})
    //.plugin('aurelia-validation', (config) => {
    //        config.useViewStrategy(TWCustomBootstrapViewStrategy.AppendToInput);
    //})
    //    .globalResources("views/hardware/power/index")
    //.globalResources("views/hardware/filterwheel/index")
    //.globalResources("views/hardware/camera/index")
    //.globalResources("views/hardware/fieldrotator/index")
    //.globalResources("views/hardware/focuser/index")
    //.globalResources("views/hardware/telescope/index")
    //.globalResources("views/hardware/dome/index");
    
    //bp.configure(aurelia.use);
  //  configureContainer(aurelia.container);
  aurelia.start().then(() => aurelia.setRoot('views/app', document.body));
});



function configureContainer(container:Container ) {
//container.registerAlias(relay.AbotService, DI.AbotService); // here you can switch
    // container.registerAlias(mock.AbotService, DI.AbotService); // here you can switch
}
