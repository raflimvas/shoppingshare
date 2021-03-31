import { SwaggerType, SwaggerTypes } from "../lib/decorators";
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

    @SwaggerType(SwaggerTypes.number)
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => User, user => user.id, { onDelete: "CASCADE" })
    public user: User;

    @SwaggerType(SwaggerTypes.number)
    public userId: number

    @SwaggerType(SwaggerTypes.number)
    @Column("decimal", { precision: 5, scale: 2 })
    public value: number

    @SwaggerType(SwaggerTypes.number)
    @Column("decimal", { precision: 10, scale: 3 })
    public weight: number

    @SwaggerType(SwaggerTypes.string)
    @Column("enum", { enum: Unit })
    public unit: Unit

    @ManyToOne(() => Item, item => item.share, { onDelete: "CASCADE" })
    public item: Item;

    @SwaggerType(SwaggerTypes.number)
    public itemId: number

    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.user = obj && obj.user || {};
        this.userId = obj && obj.userId || 0;
        this.value = obj && obj.value || null;
        this.weight = obj && obj.value || null;
        this.unit = obj && obj.unit || null;
        this.item = obj && obj.item || {};
        this.itemId = obj && obj.itemId || 0;
    }

}