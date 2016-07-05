import {Aurelia, inject} from 'aurelia-framework';
import {Router, RouterConfiguration, RouteConfig} from 'aurelia-router';
import {AuthService, AuthorizeStep} from 'aurelia-auth';

//import {AvailableCommandService} from 'framework/services/availablecommandservice';
//import {UserService} from 'framework/services/userservice';
//import {DI} from "framework/configs";
//import {endpoints} from "framework/configs/endpoints";
//import {Observatory} from "../domain/common";
import {baseRouter} from "../framework/configs/router";
//import {types} from "../configs/types";
//import {IAbotService} from '../domain/abotInterfaces';
//import * as observatory from '../resources/observatory';

import "../framework/js/jquery.slimscroll.js";
import "../framework/js/AdminLTE.js";

export class App {
  private router: Router
  
  constructor() {
  }
  
  activate() {
  }
  
  attached() {
         $.AdminLTE.initialize();
        var ev = document.createEvent('Event');
        ev.initEvent('resize', true, true);
        window.dispatchEvent(ev);
    }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = "debVis Laboratory";
    //config.addPipelineStep('authorize', AuthorizeStep);
        
        config.map(baseRouter);
        this.router = router;
    }
 
  }

/*
@inject( DI.AbotService, AppService, AvailableCommandService,AuthService)
export class App {
    private router: Router;
    private conf:Observatory;
    constructor(private hws: IAbotService, 
        private appService: AppService,
        private availableCommandService: AvailableCommandService,
        private authService:AuthService) {  }
        
    
    activate() : any {
        if (!this.authService.isAuthenticated()) {
            return this.authService.authenticate('identSrv',true, null)
            .then((response)=>{
                console.log("auth response " + response);
                this.appService.updateUser(this.authService.getTokenPayload());
                this.hws.updateToken(this.authService.auth.getToken());
                this.availableCommandService.getAvailableCommands();
                
                return this.hws.initialize().then((conf) => { 
                    this.appService.observatory = new observatory.Observatory(conf.name, conf.id,"Azure", conf.latitude, conf.longitude,conf.altitude);
                    endpoints.cameras = conf.streams;
                    this.conf = conf;
                    return true
                });
            })    
            .catch(error => {
                console.log("Authentication error login.authenticate:39");
            });
        } else {
            this.appService.updateUser(this.authService.getTokenPayload());
            this.hws.updateToken(this.authService.auth.getToken());
            this.availableCommandService.getAvailableCommands();
            return this.hws.initialize().then((conf) => {
                    this.appService.observatory = new observatory.Observatory(conf.name, conf.id,"Azure", conf.latitude, conf.longitude,conf.altitude);
                    endpoints.cameras = conf.streams;
                    this.conf = conf;
                    return true;
            });
        }
    }
    
    configureRouter(config: RouterConfiguration, router: Router) {
    config.title = "debVis";
        config.addPipelineStep('authorize', AuthorizeStep);
        var devicesToAdd = this.conf.devices.map( device => {
           var typeInfo = types[device.type];
           
           if (!typeInfo) { 
               return null
           };
           
           return {
                "route": `${typeInfo.category}/${device.id}`,
                "moduleId": typeInfo.moduleId,
                "nav": true,
                "auth": true,
                "title": device.id,
                "settings": {
                    "pagetype": typeInfo.category,
                    "subtitle": "",
                    "icon": "fa fa-server",
                    "parent": {
                        "title": typeInfo.category,
                        "settings": {
                            "icon": "fa fa-server"
                        }
                    }
                }
            }
        }).filter(v => v !== null);
        
        config.map(routerConfig.concat(devicesToAdd));
        this.router = router;
    }
    
    
    attached() {
         $.AdminLTE.initialize();
        var ev = document.createEvent('Event');
        ev.initEvent('resize', true, true);
        window.dispatchEvent(ev);
    }
    }*/
