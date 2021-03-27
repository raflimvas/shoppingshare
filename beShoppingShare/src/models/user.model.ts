import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column('varchar', { length: 80, unique: true, nullable: false })
    public email: string;

}