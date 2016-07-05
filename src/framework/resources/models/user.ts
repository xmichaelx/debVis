export class User {
  constructor(
    public id:string,
    public name: string,
    public surname: string,
    public position: string,
    public image: string,
    public isLoggedIn: boolean
  ) {}
}
