import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.model";
import { Item } from "./item.model";
import { ListUser } from "./listUser.model";

@Entity()

export class List {

    @PrimaryGeneratedColumn()
    public id: number

    @Column("varchar", { length: 100, unique: false, nullable: false })
    public name: string

    @Column("varchar", { length: 200, unique: false, nullable: true })
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
        if (obj && obj.listUser) {
            this.listUsers = Array.isArray(obj.listUser) ? obj.listUser.map((x: any) => new ListUser(x)) : [];
        }
        if (obj && obj.item) {
            this.items = Array.isArray(obj.item) ? obj.item.map((x: any) => new Item(x)) : [];
        }
        if (obj && obj.category) {
            this.categories = Array.isArray(obj.category) ? obj.category.map((x: any) => new Category(x)) : [];
        }
    }

}

