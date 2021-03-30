import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";

@Entity()
export class CategoryTemplate {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar",{ length: 100, unique: false, nullable: true})
    public name: string;

    @ManyToOne(()=> User, user => user.categoryTemplates, { onDelete: "CASCADE"})
    public user: User;

    constructor(obj?:any){
        this.id = obj && obj.id || 0;
        this.name = obj && obj.name || null;
        this.user = obj && obj.user || {};
    }

} 