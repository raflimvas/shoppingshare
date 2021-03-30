import { SwaggerType, SwaggerTypes } from '../lib/decorators';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './category.model';
import { Item } from './item.model';
import { ListUser } from './listUser.model';

@Entity()

export class List {

    @SwaggerType(SwaggerTypes.number)
    @PrimaryGeneratedColumn()
    public id: number

    @Column('varchar', { length: 100, unique: false, nullable: false })
    public name: string

    @Column('varchar', { length: 200, unique: false, nullable: true })
    public description: string

    @OneToMany(() => ListUser, listUser => listUser.list)
    public listUsers: ListUser[]

    @OneToMany(() => Item, item => item.list)
    public items: Item[]

    @OneToMany(() => Category, category => category.list)
    public categories: Category[]

    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.name = obj && obj.name || null;
        this.description = obj && obj.description || null;
        this.listUsers = null;
        if (obj && obj.listUser) {
            this.listUsers = Array.isArray(obj.listUser) ? obj.listUser.map((x: any) => new ListUser(x)) : [];
        }
        this.items = null;
        if (obj && obj.items) {
            this.items = Array.isArray(obj.items) ? obj.items.map((x: any) => new Item(x)) : [];
        }
        this.categories = null;
        if (obj && obj.categories) {
            this.categories = Array.isArray(obj.categories) ? obj.categories.map((x: any) => new Category(x)) : [];
        }
    }

}

