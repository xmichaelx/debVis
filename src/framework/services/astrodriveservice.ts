import {inject} from 'aurelia-framework';
import {HttpClientServiceBase} from './httpclientservicebase';

@inject(HttpClientServiceBase)
export class AstroDriveService {
    constructor(private httpClientServiceBase:HttpClientServiceBase) {

    }

    getDiskUsageInfo(): Promise<any> {
        return this.httpClientServiceBase.initAstroDrive().get('api/utils/CurrentUserQuota').then(function (message) {
            return JSON.parse(message.response);
        });
    }

    latestImages(n: number): Promise<any> {
        return this.httpClientServiceBase.initAstroDrive().get('api/utils/GetCurrentUserImages?count=' + n).then(function (message) {
            return JSON.parse(message.response);
        });
    }

    latestAllImages(n: number): Promise<any> {
        return this.httpClientServiceBase.initAstroDrive().get('api/utils/GetLastImagesAsync?count=' + n).then(function (message) {
            return JSON.parse(message.response);
        });
    }
} 
