import {inject} from 'aurelia-framework';
import {User} from '../../resources/models/user';
import {UserService} from '../../services/userservice';
import {AstroDriveService} from '../../services/astrodriveservice';
import {PlannerService} from '../../services/plannerservice';

@inject(UserService, AstroDriveService, PlannerService)
export class UserMenu {
    user: User;
    interval: number;

    observingTimeMin: number = 0;
    observingTimeValue: number = 0;
    observingTimeMax: number = 0;
    observingTimeReversed: boolean = true;
    astroDriveMin: number = 0;
    astroDriveMax: number = 0;
    astroDriveValue: number = 0;
    astroDriveReversed: boolean = false;

    constructor(private userService: UserService,
        private astroDriveService: AstroDriveService,
        private plannerService: PlannerService) {
        this.user = this.userService.user;
    }

    attached() {
        // this.interval = setInterval(() => { this.update() }, 10 * 1000);
    }

    update() {
        this.astroDriveService.getDiskUsageInfo().then((data) => {

            this.astroDriveValue = data.UsedSpace;
            this.astroDriveMax = data.TotalSpace;
            //bar.width = data.UsedSpace / data.TotalSpace;
        }).catch(() => {
            console.log("AstroDrive service get usage info unavailable"); 
            });

        this.plannerService.getObservingTime().then((seconds: number) => {
            var hours = seconds / 60 / 60;

            this.observingTimeValue = hours;
            this.observingTimeMax = hours;
        }).catch(() => {
            console.log("AbotTutor service get observing time unavailable");
        });
    }

    detached() {
        clearInterval(this.interval);
        this.interval = null;

    }
}  
