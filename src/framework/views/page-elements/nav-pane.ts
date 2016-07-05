import {inject, bindable, customElement} from 'aurelia-framework';
import {User} from '../../resources/models/user';
import {UserService} from '../../services/userservice';
import {Router} from 'aurelia-router';
import "../../js/AdminLTE.js";

@inject(UserService, Router)
@customElement('nav-pane')
export class NavPane {
    constructor(private userService: UserService, private router: Router) {
    }

    public routes: Array<any> = [];

    // @todo: we should filter out routes that are not accesible by the current user
    private getRoute(routes: Array<any>, r: any): any {
        var m: any;

        routes.every(_m => {
            if (_m.routes != undefined && _m.title == r.settings.parent.title) {
                m = _m;
                return false;
            }
            return true;
        });

        if (m === undefined) {
            m = r.settings.parent;
            m.routes = [];
            routes.push(m);
        }

        return m;
    }

    attached() {
        this.router.navigation.forEach(r => {
            if (r.settings.parent) {
                var m = this.getRoute(this.routes, r);
                m.routes.push(r);
            }
            else {
                this.routes.push(r);
            }
        });

        setTimeout(_ => {
            $.AdminLTE.tree('.sidebar');
        }, 500);
        return true;
    }

}
