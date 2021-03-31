import { SwaggerArray, SwaggerType, SwaggerTypes } from '../lib/decorators';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './category.model';
import { Item } from './item.model';
import { ListUser } from './listUser.model';

@Entity()

export class List {

    @SwaggerType(SwaggerTypes.number)
    @PrimaryGeneratedColumn()
    public id: number

    @SwaggerType(SwaggerTypes.string,'List name')
    @Column('varchar', { length: 100, unique: false, nullable: false })
    public name: string

    @SwaggerType(SwaggerTypes.string,'List description')
    @Column('varchar', { length: 200, unique: false, nullable: true })
    public description: string

    @SwaggerArray('ListUser')
    @OneToMany(() => ListUser, listUser => listUser.list)
    public listUser: ListUser[]

    @SwaggerArray('Item')
    @OneToMany(() => Item, item => item.list)
    public item: Item[]

    @SwaggerArray('Category')
    @OneToMany(() => Category, category => category.list)
    public category: Category[]

    @SwaggerType(SwaggerTypes.date)
    @CreateDateColumn()
    public createdAt: Date
    
    @SwaggerType(SwaggerTypes.date)
    @UpdateDateColumn()
    public updatedAt: Date
    list: ListUser;

    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.name = obj && obj.name || null;
        this.description = obj && obj.description || null;
        this.listUser = null;
        if (obj && obj.listUser) {
            this.listUser = Array.isArray(obj.listUser) ? obj.listUser.map((x: any) => new ListUser(x)) : [];
        }
        this.item = null;
        if (obj && obj.items) {
            this.item = Array.isArray(obj.items) ? obj.items.map((x: any) => new Item(x)) : [];
        }
        this.category = null;
        if (obj && obj.category) {
            this.category = Array.isArray(obj.category) ? obj.category.map((x: any) => new Category(x)) : [];
        }
    }

}

