import { create } from "domain";
import { CallTracker } from "node:assert";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.model";
import { List } from "./list.model";
import { Share } from "./share.model";

export enum Unit {
    "kg",
    "l",
    "un",
    "dz",
    "g"
}

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    public id: number

    @Column("varchar", { length: 100, unique: false, nullable: false })
    public name: string

    @Column("varchar", { length: 200, unique: false, nullable: true })
    public description: string

    @Column("decimal", { precision: 5, scale: 2 })
    public value: number

    @Column("decimal", { precision: 10, scale: 3 })
    public weight: number

    @Column("enum", { enum: Unit })
    public unit: Unit

    @ManyToOne(() => List, list => list.items, {onDelete: "CASCADE"})
    public list: List

    @ManyToOne(() => Category, category => category.item)
    public category: Category

    @OneToMany(()=> Share, share => share.item, )
    public shares: Share[];

    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.name = obj && obj.name || null;
        this.description = obj && obj.description || null;
        this.value = obj && obj.value || null;
        this.weight = obj && obj.weight || null;
        this.unit = obj && obj.unit || null;
        this.list = obj && obj.list || {};
        this.category = obj && obj.category || {};
        this.shares = null;
        if (obj && obj.shares)
            this.shares = Array.isArray(obj.share) ? obj.share.map((x: any) => new Share(x)) : [];
    }

}