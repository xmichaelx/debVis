import {HttpClientServiceBase} from './httpclientservicebase';

export class AvailableCommand {
    public hubName: string;
    public methodName: string;
    public takeOver: boolean;
    public manualMode: boolean;
    public observingState: boolean;
}

export class AvailableCommandService extends HttpClientServiceBase {
    private availableCommands: AvailableCommand[] = null;

    private callGetQuery(url: string): Promise<any> {
        return new Promise<string>((resolve, reject) => {
            this.init().get(url)
                .then(data => {
                resolve(data.content);
            }).catch(response => {
                reject(response);
            });
        });
    }
    
    public getAvailableCommands() : Promise<AvailableCommand[]> {
        return new Promise<AvailableCommand[]>((resolve,reject) => {
            if (this.availableCommands == null) {
                return this.callGetQuery('/api/commandaccess/GetAvailableMethods').then((data) => {
                    this.availableCommands = data;
                    resolve(data);
                 });
            }
            else {
                var data = this.availableCommands;
                resolve(data);
            }
        });
    }
}
