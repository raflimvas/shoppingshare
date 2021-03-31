import { SwaggerArray, SwaggerType, SwaggerTypes } from '../lib/decorators';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.model';
import { List } from './list.model';

@Entity()

export class Category {

    @SwaggerType(SwaggerTypes.number)
    @PrimaryGeneratedColumn()
    public id: number

    @ManyToOne(() => List, list => list.category, {onDelete:"CASCADE"})
    public list: List
    
    @SwaggerType(SwaggerTypes.number)
    public listId: number

    @SwaggerType(SwaggerTypes.string)
    @Column("varchar", { length: 100, nullable: false })
    public name: string

    @SwaggerArray('Item')
    @OneToMany(() => Item, item => item.category)
    public item: Item[]

    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.list = obj && obj.list || {};
        this.listId = obj && obj.listId || 0;
        this.name = obj && obj.name || null;
        this.item = null;
        if (obj && obj.item) {
            this.item = Array.isArray(obj.item) ? obj.item.map((x: any) => new Item(x)) : [];
        }
    }

}