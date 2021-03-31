import { create } from "domain";
import { CallTracker } from "node:assert";
import { SwaggerArray, SwaggerType, SwaggerTypes } from "../lib/decorators";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.model";
import { List } from "./list.model";
import { Share } from "./share.model";

export enum Unit {
    'kg',
    'l',
    'un',
    'dz',
    'g'
}

@Entity()
export class Item {

    @SwaggerType(SwaggerTypes.number)
    @PrimaryGeneratedColumn()
    public id: number

    @SwaggerType(SwaggerTypes.string)
    @Column('varchar', { length: 100, unique: false, nullable: false })
    public name: string

    @SwaggerType(SwaggerTypes.string)
    @Column('varchar', { length: 200, unique: false, nullable: true })
    public description: string

    @SwaggerType(SwaggerTypes.number)
    @Column('decimal', { precision: 5, scale: 2 })
    public value: number

    @SwaggerType(SwaggerTypes.number)
    @Column('decimal', { precision: 10, scale: 3 })
    public weight: number

    @SwaggerType(SwaggerTypes.string)
    @Column('enum', { enum: Unit })
    public unit: Unit

    @ManyToOne(() => List, list => list.item, { onDelete: "CASCADE" })
    public list: List;

    @SwaggerType(SwaggerTypes.number)
    public listId: number;

    @ManyToOne(() => Category, category => category.item)
    public category: Category

    @SwaggerType(SwaggerTypes.number)
    public categoryId: number

    @SwaggerArray('Share')
    @OneToMany(() => Share, share => share.item,)
    public share: Share[];

    @SwaggerType(SwaggerTypes.date)
    @CreateDateColumn()
    public createdAt: Date

    @SwaggerType(SwaggerTypes.date)
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
        this.listId = obj && obj.listId || 0;
        this.category = obj && obj.category || {};
        this.categoryId = obj && obj.categoryId || 0;
        this.share = null;
        if (obj && obj.share)
            this.share = Array.isArray(obj.share) ? obj.share.map((x: any) => new Share(x)) : [];
    }

}