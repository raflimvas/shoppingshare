import { SwaggerArray, SwaggerType, SwaggerTypes } from '../lib/decorators';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { List } from './list.model';
import { User } from './user.model';

@Entity()
export class ListUser {

    @ManyToOne(() => User, user => user.listUser, { primary: true, onDelete: 'CASCADE'})
    public user: User
    
    @SwaggerType(SwaggerTypes.number,1)
    public userId: number

    @ManyToOne(() => List, list => list.listUser, { primary: true , onDelete: 'CASCADE'})
    public list: List

    @SwaggerType(SwaggerTypes.number,1)
    public listId: number

    @SwaggerType(SwaggerTypes.boolean,true)
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
        this.userId = obj && obj.userId || 0;
        this.list = obj && obj.list || {};
        this.listId = obj && obj.listId || 0;
        this.owner = obj && obj.owner || false;
    }
}