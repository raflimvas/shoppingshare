import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { List } from "./list.model";
import { User } from "./user.model";

@Entity()

export class ListUser {
    @ManyToOne(() => User, user => user.listUsers, { primary: true, onDelete: "CASCADE"})
    public user: User

    @ManyToOne(() => List, list => list.listUsers, { primary: true , onDelete: "CASCADE"})
    public list: List

    @Column("boolean", { nullable: false })
    public owner: boolean

    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    constructor(obj?: any) {
        this.user = obj && obj.user || {};
        this.list = obj && obj.list || {};
        this.owner = obj && obj.owner || false;
    }
}