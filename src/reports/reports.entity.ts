import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user: number;

    @Column()
    make: string;

    @Column()
    model: string;

    @Column()
    year: number; //?

    @Column()
    mileage: number;

    @Column()
    latitude: number; //?

    @Column()
    longitude: number; //?

    @Column()
    price: number;

    @Column()
    approved: boolean;
}