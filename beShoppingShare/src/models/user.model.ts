import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ListUser } from "./listUser.model";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column('varchar', { length: 200, unique: true, nullable: false })
    public email: string;

    @Column('varchar', { length: 100, unique: false, nullable: false })
    public firstName: string;

    @Column('varchar', { length: 200, unique: false, nullable: false })
    public lastName: string;

    public password: string;

    @Column('varchar', { length: 255, unique: false, nullable: false })
    public passwordHash: string;

    @OneToMany(() => ListUser, listUser => listUser.user)
    public listUsers: ListUser[]

    @CreateDateColumn()
    public createdAt: Date

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