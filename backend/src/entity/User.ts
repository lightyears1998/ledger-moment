import { Column, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@ObjectType({ description: "User Model" })
export class User {
  @Field()
  @PrimaryGeneratedColumn("increment")
  userId!: number

  @Field()
  @Column()
  username!: string

  @Field()
  @Column()
  passwordHash!: string
}
