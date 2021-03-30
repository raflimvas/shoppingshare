import { SwaggerType, SwaggerTypes } from '../lib/decorators';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ListUser } from './listUser.model';

@Entity()
export class User {
    
    @SwaggerType(SwaggerTypes.number)
    @PrimaryGeneratedColumn()
    public id: number;

    @SwaggerType(SwaggerTypes.email)
    @Column('varchar', { length: 200, unique: true, nullable: false })
    public email: string;

    @SwaggerType(SwaggerTypes.string)
    @Column('varchar', { length: 100, unique: false, nullable: false })
    public firstName: string;

    @SwaggerType(SwaggerTypes.string)
    @Column('varchar', { length: 200, unique: false, nullable: false })
    public lastName: string;

    @SwaggerType(SwaggerTypes.password)
    public password: string;

    @Column('varchar', { length: 255, unique: false, nullable: false })
    public passwordHash: string;

    //@SwaggerType(SwaggerTypes.array, null, true, ListUser)
    @OneToMany(() => ListUser, listUser => listUser.user)
    public listUsers: ListUser[]

    @SwaggerType(SwaggerTypes.date)
    @CreateDateColumn()
    public createdAt: Date

    @SwaggerType(SwaggerTypes.date)
    @UpdateDateColumn()
    public updatedAt: Date

    constructor(obj?: any) {

        this.id = obj && obj.id || 0;
        this.email = obj && obj.email || null;
        this.firstName = obj && obj.firstName || null;
        this.lastName = obj && obj.lastName || null;
        this.password = obj && obj.password || null;
        this.passwordHash = obj && obj.passwordHash || null;
        this.listUsers = null;
        if (obj && obj.listUser) {
            this.listUsers = Array.isArray(obj.listUser) ? obj.listUser.map((x: any) => new ListUser(x)) : [];
        }

    }
}