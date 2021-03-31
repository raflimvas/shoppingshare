import { ListUser } from './listUser.model';
import { CategoryTemplate } from './categoryTemplate.model';

export class User {

    public id: number;

    public email: string;

    public firstName: string;

    public lastName: string;

    public password: string;

    public passwordHash: string;

    public listUsers: ListUser[];

    public categoryTemplates: CategoryTemplate[];

    constructor(obj?: any) {

        this.id = obj && obj.id || 0;
        this.email = obj && obj.email || null;
        this.firstName = obj && obj.firstName || null;
        this.lastName = obj && obj.lastName || null;
        this.password = obj && obj.password || null;
        this.passwordHash = obj && obj.passwordHash || null;
        this.listUsers = [];
        if (obj && obj.listUser) {
            this.listUsers = Array.isArray(obj.listUser) ? obj.listUser.map((x: any) => new ListUser(x)) : [];
        }
        this.categoryTemplates = [];
        if (obj && obj.categoryTemplates) {
            this.categoryTemplates = Array.isArray(obj.categoryTemplates) ? obj.categoryTemplates.map((x: any) => new CategoryTemplate(x)) : [];
        }

    }
}
