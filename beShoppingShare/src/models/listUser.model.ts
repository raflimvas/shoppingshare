import { SwaggerType, SwaggerTypes } from '../lib/decorators';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { List } from './list.model';
import { User } from './user.model';

@Entity()
export class ListUser {

    @SwaggerType(SwaggerTypes.object, null, null, User)
    @ManyToOne(() => User, user => user.listUsers, { primary: true, onDelete: 'CASCADE'})
    public user: User

    @ManyToOne(() => List, list => list.listUsers, { primary: true , onDelete: 'CASCADE'})
    public list: List

    @SwaggerType(SwaggerTypes.boolean)
    @Column('boolean', { nullable: false })
    public owner: boolean

    @SwaggerType(SwaggerTypes.date)
    @CreateDateColumn()
    public createdAt: Date

    @SwaggerType(SwaggerTypes.date)
    @UpdateDateColumn()
    public updatedAt: Date

    constructor(obj?: any) {
        this.user = obj && obj.user || {};
        this.list = obj && obj.list || {};
        this.owner = obj && obj.owner || null;
    }
}