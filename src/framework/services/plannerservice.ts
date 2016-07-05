import {User} from '../resources/models/user';
import {HttpClientServiceBase} from './httpclientservicebase';

export class PlannerService extends HttpClientServiceBase {
    private filters: string[];
    private users: User[];

    private lastUsersDownload: Date;

    public getFilters(): Promise<string[]> {
        var self = this;
        return (new Promise<string[]>((resolve, reject) => {
            if (self.filters) {
                resolve(self.filters);
            } else {
                self.init().get('/api/helpers/GetFilters')
                    .then(filters => {
                        self.filters = filters.content;
                        resolve(self.filters);
                    })
                    .catch(el => {
                        reject(el);
                    });
            }
        }));
    }

    public getLatestAtomsCount(): Promise<any> {
        var self = this;
        return (new Promise<string[]>((resolve, reject) => {
            self.init().get('/api/helpers/GetLatestAtomsCount')
                .then(data => {
                    resolve(data.content);
                });
        }));
    }

    public getLatestAtoms(page: number = 0, size: number = 100): Promise<any> {
        var self = this;
        return (new Promise<string[]>((resolve, reject) => {
            self.init().get('/api/helpers/getLatestAtoms?page=' + page + '&size=' + size)
                .then(data => {
                    resolve(data.content);
                });
        }));
    }

    public getObservingTime(): Promise<number> {
        var self = this;
        return (new Promise<number>((resolve, reject) => {
            self.init().get('/api/helpers/GetObservingTime')
                .then(time => {
                    resolve(time.content);
                })
                .catch(error => {
                    reject(error);
                });
        }));
    }
    
    public getUsers(): Promise<User[]> {
        var self = this;
        return (new Promise<User[]>((resolve, reject) => {
            var checkDate = null;
            if (self.lastUsersDownload) {
                checkDate = new Date(self.lastUsersDownload.getTime() + 2 * 60 * 1000);
            }

            if (self.filters && checkDate && checkDate.getTime() > Date.now()) {
                resolve(self.users);
            } else {
                self.lastUsersDownload = new Date();
                self.init().get('/api/helpers/getUsers')
                    .then(users => {
                        self.users = users.content.map(user => {
                        var temp = new User("","","","","",false);// is this user logged in?
                            temp.id = user.id;
                            temp.name = user.given_name;

                            return temp;
                        });
                        resolve(self.users);
                    });
            }
        }));
    }
}
