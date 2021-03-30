import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()

export class Share {

    @PrimaryGeneratedColumn()
    public id: number


}