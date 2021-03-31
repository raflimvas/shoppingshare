import { Category } from "./category.model";
import { Share } from "./share.model";

export enum Unit {
    'kg',
    'l',
    'un',
    'dz',
    'g'
}

export class Item {

    public id: number;

    public name: string;

    public description: string;

    public value: number;

    public weight: number;

    public unit: Unit;

    public category: any;

    // public list: List;

    // public category: Category;

    public shares: Share[];

    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.name = obj && obj.name || null;
        this.description = obj && obj.description || null;
        this.value = obj && obj.value || null;
        this.weight = obj && obj.weight || null;
        this.unit = obj && obj.unit || Unit.un;
        // this.list = null;
        // if (obj && obj.list) {
        //   this.list = new List(obj.list);
        // }
        // this.category = null;
        // if (obj && obj.category) {
        //   this.category = new Category(obj.category);
        // }
        this.shares = [];
        if (obj && obj.shares)
            this.shares = Array.isArray(obj.shares) ? obj.shares.map((x: any) => new Share(x)) : [];
    }

}
