import { SwaggerType, SwaggerTypes } from "../lib/decorators";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    
    @SwaggerType(SwaggerTypes.number)
    @PrimaryGeneratedColumn()
    public id: number;

    @SwaggerType(SwaggerTypes.email)
    @Column('varchar', { length: 80, unique: true, nullable: false })
    public email: string;

    @SwaggerType(SwaggerTypes.date)
    public date: Date;

    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.email = obj && obj.email || null;
        this.date = obj && obj.date || null;
    }

}