import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {endpoints} from "../configs/endpoints";
import * as AuthService from 'aurelia-auth';

@inject(AuthService.AuthService)
export class HttpClientServiceBase {
    boundCallback : Function;
    constructor(private authService: any) {
        var self = this;
        this.boundCallback = (request) => {
                if (self.authService.isAuthenticated() && self.authService.config.httpInterceptor) {
                var tokenName = self.authService.config.tokenPrefix ? self.authService.config.tokenPrefix + '_' + self.authService.config.tokenName : this.authService.config.tokenName;
                var token = self.authService.auth.storage.get(tokenName);

                if (self.authService.config.authHeader && self.authService.config.authToken) {
                token = self.authService.config.authToken + ' ' + token;
                }

                request.headers.add(self.authService.config.authHeader, token);
            }
            return request;
        }
    }

    public init(): HttpClient {
        return new HttpClient().configure(config => {
            config
                .withBaseUrl(endpoints.abot.historicalDataAccess)
                .withHeader('Content-Type', 'application/json')
                .withHeader('Accept', 'application/json')
                .withInterceptor({
                    request : this.boundCallback ,
                    response : (response) =>  {
                        return response; 
                    }
                });
        });
    }

    public initAstroDrive(): HttpClient {
        return new HttpClient().configure(config => {
            config
                .withBaseUrl(endpoints.astroDrive)
                .withHeader('Content-Type', 'application/json')
                .withHeader('Accept', 'application/json')
                .withInterceptor({
                    request: this.boundCallback ,
                    response : (response) => {
                        return response;
                    }
                });
        });
    }
}
