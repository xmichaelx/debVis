import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {User} from '../resources/models/user';
import {config} from "../configs/auth";

declare var require;
var AuthService = require('aurelia-auth');

@inject(AuthService.AuthService, EventAggregator)
export class UserService {
  public user: User;
  constructor(private authService: any, private ea: EventAggregator) {
    this.user = new User('', '', '', '', '', false);
    
  }

  public login() {
    this.authService.authenticate('identSrv', true, null);
  }

  public signout() {
    var token = encodeURIComponent(this.authService.auth.Token());
    var redirect_uri = (window.location.origin || window.location.protocol + '//' + window.location.host);
    this.authService.auth.removeToken();
        window.location.assign(`${config.baseUrl}${config.unlinkUrl}?id_token_hint=${token}&post_    logout_redirect_uri=${redirect_uri}`);
    }

  public updateUser(profile: any) {
    if (!profile) {
      this.user.isLoggedIn = false;
      this.user.id = "";
      this.user.name = "";
      this.user.surname = "";
      this.user.position = "";
      } else {
        this.user.id = profile.sub;
        this.user.isLoggedIn = true;
        this.user.name = profile.given_name;
        this.user.surname = profile.family_name;
        this.user.position = profile.mpi_role;
      }
  }
}

