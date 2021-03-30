import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.model";
import { User } from "./user.model";

export enum Unit {
    "kg",
    "l",
    "un",
    "dz",
    "g"
}

@Entity()
export class Share {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => User, user => user.id, { onDelete: "CASCADE"})
    public user: User;

    @Column("decimal", { precision: 5, scale: 2 })
    public value: number

    @Column("decimal", { precision: 10, scale: 3 })
    public weight: number

    @Column("enum", { enum: Unit })
    public unit: Unit

    @ManyToOne(() => Item, item => item.shares, { onDelete: "CASCADE"})
    public item: Item;

    constructor(obj?:any){
        this.id = obj && obj.id || 0;
        this.user = obj && obj.user || {};
        this.value = obj && obj.value || null;
        this.weight = obj && obj.value || null;
        this.unit = obj && obj.unit || null;
        this.item = obj && obj.item || {};
    }

}