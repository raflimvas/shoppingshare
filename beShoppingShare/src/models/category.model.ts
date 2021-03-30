import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.model';
import { List } from './list.model';

@Entity()

export class Category {

    @PrimaryGeneratedColumn()
    public id: number

    @ManyToOne(() => List, list => list.categories, {onDelete:"CASCADE"})
    public list: List

    @Column("varchar", { length: 100, nullable: false })
    public name: string

    @OneToMany(() => Item, item => item.category)
    public item: Item[]

    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.list = obj && obj.list || {};
        this.name = obj && obj.name || null;
        this.item = null;
        if (obj && obj.listUser) {
            this.item = Array.isArray(obj.item) ? obj.item.map((x: any) => new Item(x)) : [];
        }
    }

}