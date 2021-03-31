import { SwaggerType, SwaggerTypes } from "../lib/decorators";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";

@Entity()
export class CategoryTemplate {
    @SwaggerType(SwaggerTypes.number,1)
    @PrimaryGeneratedColumn()
    public id: number;

    @SwaggerType(SwaggerTypes.string,'Sorvetes')
    @Column("varchar",{ length: 100, unique: false, nullable: true})
    public name: string;

    @ManyToOne(()=> User, user => user.categoryTemplate, { onDelete: "CASCADE"})
    public user: User;
    
    @SwaggerType(SwaggerTypes.number,1)
    public userId: number

    constructor(obj?:any){
        this.id = obj && obj.id || 0;
        this.name = obj && obj.name || null;
        this.user = obj && obj.user || {};
        this.userId = obj && obj.userId || 0;
    }

} 