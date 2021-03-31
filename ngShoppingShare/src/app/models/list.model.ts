import { Category } from './category.model';
import { Item } from './item.model';
import { ListUser } from './listUser.model';

export class List {

    public id: number;

    public name: string;

    public description: string;

    public listUsers: ListUser[];

    public items: Item[];

    public categories: Category[];

    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.name = obj && obj.name || null;
        this.description = obj && obj.description || null;
        this.listUsers = [];
        if (obj && obj.listUsers) {
            this.listUsers = Array.isArray(obj.listUsers) ? obj.listUsers.map((x: any) => new ListUser(x)) : [];
        }
        this.items = [];
        if (obj && obj.items) {
            this.items = Array.isArray(obj.items) ? obj.items.map((x: any) => new Item(x)) : [];
        }
        this.categories = [];
        if (obj && obj.categories) {
            this.categories = Array.isArray(obj.categories) ? obj.categories.map((x: any) => new Category(x)) : [];
        }
    }

}

