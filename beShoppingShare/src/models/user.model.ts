import { SwaggerArray, SwaggerType, SwaggerTypes } from '../lib/decorators';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ListUser } from './listUser.model';
import { CategoryTemplate } from './categoryTemplate.model';

@Entity()
export class User {
    
    @SwaggerType(SwaggerTypes.number,1)
    @PrimaryGeneratedColumn()
    public id: number;

    @SwaggerType(SwaggerTypes.email)
    @Column('varchar', { length: 200, unique: true, nullable: false })
    public email: string;

    @SwaggerType(SwaggerTypes.string,'End')
    @Column('varchar', { length: 100, unique: false, nullable: false })
    public firstName: string;

    @SwaggerType(SwaggerTypes.string,'Game')
    @Column('varchar', { length: 200, unique: false, nullable: false })
    public lastName: string;

    @SwaggerType(SwaggerTypes.password)
    public password: string;

    @Column('varchar', { length: 255, unique: false, nullable: false })
    public passwordHash: string;

    @SwaggerArray('ListUser')
    @OneToMany(() => ListUser, listUser => listUser.user)
    public listUser: ListUser[]

    @SwaggerArray('CategoryTemplate')
    @OneToMany(() => CategoryTemplate, categoryTemplate => categoryTemplate.user)
    public categoryTemplate: CategoryTemplate[]

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
        this.listUser = null;
        if (obj && obj.listUser) {
            this.listUser = Array.isArray(obj.listUser) ? obj.listUser.map((x: any) => new ListUser(x)) : [];
        }
        this.categoryTemplate = null;
        if (obj && obj.categoryTemplate) {
            this.categoryTemplate = Array.isArray(obj.categoryTemplate) ? obj.categoryTemplate.map((x: any) => new CategoryTemplate(x)) : [];
        }

    }
}