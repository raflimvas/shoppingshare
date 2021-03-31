import { Item } from './item.model';
import { List } from './list.model';

export class Category {

    public id: number;

    public list: List;

    public name: string;

    // public item: Item[];

    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.list = null;
        if (obj && obj.list) {
          this.list = new List(obj.list);
        }
        this.name = obj && obj.name || null;
        // this.item = [];
        // if (obj && obj.item) {
        //   this.item = Array.isArray(obj.item) ? obj.item.map((x: any) => new Item(x)) : [];
        // }
    }

}
