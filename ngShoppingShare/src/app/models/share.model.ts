import { Item, Unit } from "./item.model";
import { User } from "./user.model";

export class Share {

    public id: number;

    public user: User;

    public value: number;

    public weight: number;

    public unit: Unit;

    public item: Item;

    constructor(obj?:any){
        this.id = obj && obj.id || 0;
        this.user = obj && obj.user || null;
        this.value = obj && obj.value || null;
        this.weight = obj && obj.value || null;
        this.unit = obj && obj.unit || null;
        this.item = obj && obj.item || null;
    }

}
