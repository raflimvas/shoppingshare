import { User } from "./user.model";

export class CategoryTemplate {

    public id: number;

    public name: string;

    public user: User;

    constructor(obj?:any) {
        this.id = obj && obj.id || 0;
        this.user = null;
        if (obj && obj.user) {
          this.user = new User(obj.user);
        }
        this.name = obj && obj.name || null;
    }

}
