import { Column, PrimaryGeneratedColumn } from "typeorm";

export class User {
    @PrimaryGeneratedColumn("increment")
    userId!: number

    @Column()
    username!: string

    @Column()
    passwordHash!: string
}
